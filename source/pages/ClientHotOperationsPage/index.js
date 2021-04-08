/*
This page is a node page for client hot operations. It was developed o work with Biinotel service.
User on this page can select some operations for client:
    1. Create a new client - will be redirected to the page where user can create a new client
    2. Open client page - Redirect to a page with client's information(client page)
    3. Create order with that client
*/

// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

// proj
import { Layout, StyledButton } from "commons";
// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    user: state.auth
});

@connect(
    mapStateToProps,
    void 0,
)
@injectIntl
export default class ClientHotOperationsPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const {
            intl: {formatMessage}
        } = this.props;
        
        
        return (
            <Layout
                title={ <div><FormattedMessage id="navigation.client_hot_operations" /></div> }
                paper={true}
            >
                Hello world
            </Layout>
        );
    }
}
