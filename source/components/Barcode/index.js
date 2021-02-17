// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import JsBarcode  from "jsbarcode"; //https://github.com/lindell/JsBarcode/wiki/Options
import { Button } from "antd";
import { permissions, isForbidden } from "utils";
import _ from "lodash";

// proj

// own

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class Barcode extends Component {
    constructor(props) {
        super(props);
        this.defaultOptions = {
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
            margin: 10,
            marginTop: undefined,
            marginBottom: undefined,
            marginLeft: undefined,
            marginRight: undefined,
            flat: true,
        }
    }

    updateBarcode() {
        const value = _.get(this.props, 'value', "123456789012")
                        .replace(/\D/g,'')
                        .padEnd(12, "0");

        const options = _.get(this.props, 'options', {});

        JsBarcode(
            "#barcode", 
            value, 
            {
                ...this.defaultOptions,
                ...{},
            }
        );
    }

    componentDidMount() {
        this.updateBarcode();
    }

    componentDidUpdate() {
        this.updateBarcode();
    }

    render() {
        const { user } = this.props;
        return (
            <canvas id="barcode"></canvas>
        );
    }
}
