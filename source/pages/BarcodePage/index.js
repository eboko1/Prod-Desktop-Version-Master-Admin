// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button } from "antd";
import { permissions, isForbidden } from "utils";

// proj
import { Layout } from "commons";
import { BarcodeContainer } from "containers";
import { Barcode } from "components";
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
                /*controls={
                    <Barcode
                        barcodeValue={"123456789012"}
                        iconStyle={{
                            fontSize: 24,
                        }}
                        options={{
                            height: 90,
                            fontSize: 18,
                            width: 3,
                            margin: 0,
                        }}
                    />
                }*/
            >
                <BarcodeContainer/>
            </Layout>
        );
    }
}
