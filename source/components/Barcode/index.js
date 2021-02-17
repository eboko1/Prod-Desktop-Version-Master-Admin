// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import JsBarcode  from "jsbarcode";
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
            width:2,
            height:20,
        }
    }

    updateBarcode() {
        const value = _.get('value', this.props, "123456789012").replace(/\D/g,'').padEnd(12, "0");
        const options = _.get('options', this.props, {});
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
