// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import JsBarcode  from "jsbarcode"; //https://github.com/lindell/JsBarcode/wiki/Options
import { Button, Icon, Modal, message, Input, notification } from "antd";
import { permissions, isForbidden, fetchAPI } from "utils";
import _ from "lodash";

// proj

// own
import Styles from './styles.m.css';

function replaceLocation(str, reverse) {
    const replacer = {
        "q": "й", "w": "ц", "e": "у", "r": "к", "t": "е", "y": "н", "u": "г",
        "i": "ш", "o": "щ", "p": "з", "[": "х", "]": "ъ", "a": "ф", "s": "ы",
        "d": "в", "f": "а", "g": "п", "h": "р", "j": "о", "k": "л", "l": "д",
        ";": "ж", "'": "э", "z": "я", "x": "ч", "c": "с", "v": "м", "b": "и",
        "n": "т", "m": "ь", ",": "б", ".": "ю", "/": ".",
    };

    reverse && Object.keys(replacer).forEach(key => {
        let v = replacer[key]
        delete (replacer[key])
        replacer[v] = key
    })

    for (let i = 0; i < str.length; i++) {
        if (replacer[str[i].toLowerCase()] != undefined) {
            let replace;
            if (str[i] == str[i].toLowerCase()) {
                replace = replacer[str[i].toLowerCase()];
            } else if (str[i] == str[i].toUpperCase()) {
                replace = replacer[str[i].toLowerCase()].toUpperCase();
            }
            str = str.replace(str[i], replace);
        }
    }

    return str;
}

const mapStateToProps = state => ({
    user: state.auth,
});

const mapDispatchToProps = {
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class Barcode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            scanedCode: undefined,
            scanedInputValue: undefined,
        };

        this.id = _.uniqueId("barcode-");

        this.defaultBarcodeOptions = {
            //format: "EAN13",
            lineColor: "#000",
            background: "transparent",
            width:2,
            height:40,
            fontSize: 14,
            fontOptions: "",
            textAlign: "center",
            textPosition: "left",
            textMargin: 2,
            margin: 4,
            marginTop: undefined,
            marginBottom: undefined,
            marginLeft: undefined,
            marginRight: undefined,
            flat: true,
            displayValue: false,
        };

        this.defaultModalBarcodeOptions = {
            //format: "EAN13",
            lineColor: "#000",
            background: "transparent",
            width:2,
            height:90,
            fontSize: 14,
            fontOptions: "",
            textAlign: "center",
            textPosition: "bottom",
            textMargin: 2,
            margin: 0,
            marginTop: undefined,
            marginBottom: undefined,
            marginLeft: undefined,
            marginRight: undefined,
            flat: true,
            displayValue: true,
        }
    }

    updateBarcode = () => {
        const { prefix, user, displayBarcode } = this.props;
        const { scanedCode } = this.state;
        const id = this.id;
        const defaultOptions = displayBarcode ? this.defaultBarcodeOptions : this.defaultModalBarcodeOptions;
        const options = _.get(this.props, 'options', {});

        let code = scanedCode || "SCAN YOUR CODE";
        if(Boolean(scanedCode) && !(/\w+-\d+\-\w+/).test(scanedCode) && prefix) {
            code = `${prefix}-${user.businessId}-${code}`
        }
        
        try {
            JsBarcode(`#${id}`, code, {
                ...defaultOptions,
                ...options,
            });
        } catch (e) {
        }

        if(this.input) this.input.focus();
    }

    showModal = () => {
        const { disabled, value, prefix, user } = this.props;
        let code = value;
        if(value && prefix) {
            code = code.replace(`${prefix}-${user.businessId}-`, '');
        }
        if(!disabled) {
            this.setState({
                visible: true,
                scanedCode: code,
            })
        }
    }

    handleCancel = () => {
        this.setState({
            scanedInputValue: undefined,
            scanedCode: undefined,
            visible: false,
        })
    }

    handleOk = async () => {
        const { referenceId, table, onConfirm, prefix, user, multipleMode } = this.props;
        const { scanedCode } = this.state;
        const fullPrefix = `${prefix}-${user.businessId}`;
        const codeWithPrefix = `${fullPrefix}-${scanedCode}`
        
        if(referenceId && table && scanedCode) {
            try {
                await fetchAPI(
                    'POST', 
                    'barcodes', 
                    undefined, 
                    [{
                        referenceId: String(referenceId),
                        table,
                        customCode: scanedCode,
                    }],
                    {handleErrorInternally: true}
                );
                this.setState({
                    inputCode : "",
                })
                notification.success({
                    message: `Штрих-код задан`,
                });
                if(onConfirm) {
                    onConfirm(scanedCode, fullPrefix, codeWithPrefix);
                }
            } catch(e) {
                notification.error({
                    message: `Штрих-код уже задан`,
                });
            }
        } else if(onConfirm) {
            if(multipleMode) {
                onConfirm(scanedCode, fullPrefix, codeWithPrefix);
                this.setState({
                    scanedInputValue: undefined,
                    scanedCode: undefined,
                })
            } else {
                onConfirm(scanedCode, fullPrefix, codeWithPrefix);
                this.handleCancel();
            }
        }
    }

    componentDidMount() {
        this.updateBarcode();
    }

    componentDidUpdate(prevProps) {
        this.updateBarcode();
        //setTimeout(() => this.setState({scanedInputValue: undefined}), 1000);
    }

    render() {
        const { zIndex, displayBarcode, iconStyle, button, disabled: propsDisabled, style, onConfirm, prefix, user, referenceId, value, enableScanIcon, multipleMode } = this.props;
        const { visible, scanedCode, scanedInputValue } = this.state;
        const id = this.id;
        const iconType = enableScanIcon && !value
                            ? 'scan'
                            : 'barcode'; 

        const disabled = propsDisabled || isForbidden(user, permissions.ACCESS_STORE_PRODUCT_BARCODE_FUNCTIONALITY);

        return !displayBarcode ? (
            <div >
                {button ? 
                    <Button
                        //type={'primary'}
                        disabled={disabled}
                        onClick={this.showModal}
                    >
                        <Icon
                            type={iconType}
                            style={{
                                fontSize: 22
                            }}
                        />
                    </Button> :
                    <Icon
                        type={iconType}
                        className={disabled && Styles.disabledIcon}
                        style={{
                            fontSize: 18,
                            ...iconStyle,
                        }}
                        onClick={this.showModal}
                    />
                }
                <Modal
                    title={
                        <div
                            onClick={()=>{
                                this.input.focus();
                            }}
                        >
                            <FormattedMessage id='navigation.barcode'/>
                        </div>
                    }
                    visible={visible}
                    forceRender
                    destroyOnClose
                    onCancel={this.handleCancel}
                    footer={
                        scanedCode && onConfirm
                            ? ([
                                <Button key="back" onClick={this.handleCancel}>
                                    {<FormattedMessage id='cancel' />}
                                </Button>,
                                <Button key="submit" type="primary" onClick={this.handleOk}>
                                    {<FormattedMessage id={value ? 'update' : 'add'} />}
                                </Button>,
                            ])
                            : null
                    }
                    width={'fit-content'}
                    zIndex={zIndex || 300}
                    bodyStyle={{ padding: 0}}
                >
                    <div className={Styles.barcodeWrapp}>
                        <div className={Styles.barcodeActions}>
                        {scanedCode &&
                            <>
                                <Icon
                                    type="copy"
                                    onClick={() => {
                                        let code = scanedCode;
                                        if(scanedCode && prefix) {
                                            code = `${prefix}-${user.businessId}-${code}`
                                        }
                                        navigator.clipboard.writeText(code);
                                        message.success('Coppied!');
                                    }}
                                />
                                <Icon
                                    type="printer"
                                    onClick={() => {
                                        window.print()
                                    }}
                                />
                            </>
}
                            {referenceId &&
                                <Icon 
                                    type="sync"
                                    onClick={() => {
                                        this.setState({
                                            scanedCode: String(referenceId),
                                        })
                                    }}
                                />
                            }
                        </div>
                        <div
                            className={Styles.barcode}
                            onClick={()=>{
                                this.input.focus();
                            }}
                        >
                            <canvas id={id}></canvas>
                        </div>
                        <Input
                            autoFocus
                            disabled={disabled || !onConfirm}
                            className={Styles.barcodeInput}
                            placeholder={this.props.intl.formatMessage({id: 'barcode.scan_barcode'})}
                            value={scanedInputValue}
                            onChange={({target})=>{
                                this.setState({
                                    scanedInputValue: replaceLocation(target.value, true),
                                })
                            }}
                            onPressEnter={async ()=>{
                                if(scanedInputValue) {
                                    await this.setState({
                                        scanedCode: String(scanedInputValue).replace(`${prefix}-${user.businessId}-`, '').toUpperCase(),
                                        scanedInputValue: undefined,
                                    })
                                }
                                if(multipleMode) {
                                    this.handleOk();
                                }
                            }}
                            ref={node => (this.input = node)}
                        />
                    </div>
                </Modal>
            </div>
        ) : (
            <div className={Styles.barcode} style={style}>
                <canvas id={id}></canvas>
            </div>
        );
    }
}
