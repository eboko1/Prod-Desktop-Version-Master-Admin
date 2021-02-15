// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button } from "antd";
import { permissions, isForbidden } from "utils";

// proj
import { Layout } from "commons";
import { BarcodeContainer } from "containers";
// own

const mapStateToProps = state => ({
    user: state.auth,
});

const mapDispatchToProps = {
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class BarcodePage extends Component {
    render() {
        const { user } = this.props;
        return (
            <Layout
            	title={ <FormattedMessage id='navigation.barcode' /> }
            >
                <BarcodeContainer/>
            </Layout>
        );
    }
}
