// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import JsBarcode  from "jsbarcode"; //https://github.com/lindell/JsBarcode/wiki/Options
import { Button, Icon, Modal, message } from "antd";
import { permissions, isForbidden } from "utils";
import _ from "lodash";

// proj

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
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
            scanedvalue: undefined,
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
        const id = this.id;
        const displayBarcode = _.get(this.props, 'displayBarcode', false);
        const value = (_.get(this.props, 'value', "") || "0000");

        const defaultOptions = displayBarcode ? this.defaultBarcodeOptions : this.defaultModalBarcodeOptions;
        const options = _.get(this.props, 'options', {});

        try {
            JsBarcode(`#${id}`, value, {
                ...defaultOptions,
                ...options,
            });
        } catch (e) {
        }
    }


    componentDidMount() {
        this.updateBarcode();
    }

    componentDidUpdate(prevProps) {
        this.updateBarcode();
    }

    render() {
        const { user, showIcon, displayBarcode, iconStyle, value, button, disabled, style } = this.props;
        const { visible } = this.state;
        const id = this.id;
        return !displayBarcode ? (
            <div >
                {button ? 
                    <Button
                        //type={'primary'}
                        disabled={disabled || true}
                        onClick={()=>this.setState({visible: true})}
                    >
                        <Icon
                            type={'barcode'}
                            style={{
                                fontSize: 22
                            }}
                        />
                    </Button> :
                    <Icon
                        type={'barcode'}
                        style={{
                            fontSize: 18,
                            ...iconStyle,
                            pointerEvents: "none",
                            color: "var(--text4)"
                        }}
                        onClick={()=>this.setState({visible: true})}
                    />
                }
                <Modal
                    title={<FormattedMessage id='navigation.barcode'/>}
                    visible={visible}
                    forceRender
                    onCancel={()=>this.setState({visible: false})}
                    footer={null}
                    width={620}
                    zIndex={500}
                >
                    <div className={Styles.barcodeWrapp}>
                        {value &&
                            <div className={Styles.barcodeActions}>
                                <Icon
                                    type="copy"
                                    onClick={() => {
                                        navigator.clipboard.writeText(value);
                                        message.success('Coppied!');
                                    }}
                                />
                                <Icon
                                    type="printer"
                                    onClick={() => {
                                        window.print()
                                    }}
                                />
                            </div> 
                        }
                        <div className={Styles.barcode}>
                            <canvas id={id}></canvas>
                        </div>
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
