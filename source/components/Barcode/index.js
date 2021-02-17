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
            scanedBarcodeValue: undefined,
        };

        this.defaultBarcodeOptions = {
            format: "EAN13",
            lineColor: "#000",
            background: "transparent",
            width:2,
            height:40,
            fontSize: 14,
            fontOptions: "",
            textAlign: "center",
            textPosition: "bottom",
            textMargin: 2,
            margin: 12,
            marginTop: undefined,
            marginBottom: undefined,
            marginLeft: undefined,
            marginRight: undefined,
            flat: true,
        };

        this.defaultModalBarcodeOptions = {
            format: "EAN13",
            lineColor: "#000",
            background: "transparent",
            width:3,
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
        }
    }

    updateBarcode() {
        const { displayBarcode } = this.props;
        const barcodeValue = _.get(this.props, 'barcodeValue', "")
                                .replace(/\D/g,'')
                                .padEnd(12, "0");

        const defaultOptions = displayBarcode ? this.defaultBarcodeOptions : this.defaultModalBarcodeOptions;
        const options = _.get(this.props, 'options', {});

        try {
            JsBarcode("#barcode", barcodeValue, {
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
        const { user, showIcon, displayBarcode, iconStyle, barcodeValue, button } = this.props;
        const { visible } = this.state;
        return !displayBarcode ? (
            <div >
                {button ? 
                    <Button
                        //type={'primary'}
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
                    width={390}
                    zIndex={500}
                >
                    <div className={Styles.barcodeWrapp}>
                        {barcodeValue &&
                            <div className={Styles.barcodeActions}>
                                <Icon
                                    type="copy"
                                    onClick={() => {
                                        navigator.clipboard.writeText(barcodeValue);
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
                            <canvas id="barcode"></canvas>
                        </div>
                    </div>
                </Modal>
            </div>
        ) : (
            <canvas id="barcode"></canvas>
        );
    }
}
