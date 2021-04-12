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
import { Row, Col } from "antd";
import _ from "lodash";

// proj
import { Layout, StyledButton } from "commons";
import { fetchClients } from 'core/clientHotOperations/duck';

// own
import ClientsContainer from './ClientsContainer';
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    user: state.auth,
    clients: state.clientHotOperations.clients
});

const mapDispatchToProps = {
    fetchClients
}

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class ClientHotOperationsPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchClients();
    }

    render() {

        const {
            intl: {formatMessage},
            clients
        } = this.props;

        console.log("Here: ", clients);
        
        
        return (
            <Layout
                title={ <div><FormattedMessage id="navigation.client_hot_operations" /></div> }
                paper={true}
            >
                <div style={{width: '90%', height: '50vh', margin: '0 auto 0 auto', padding: '5px', backgroundColor: 'grey'}}>
                    <ClientsContainer />
                </div>

                <div style={{width: '50%', height: '10vh', margin: '0 auto 0 auto', padding: '5px', backgroundColor: 'grey'}}>
                    <Row>
                        <Col span={12} className={Styles.col}><StyledButton className={Styles.styledButton} type="primary"/></Col>
                        <Col span={12} className={Styles.col}><StyledButton className={Styles.styledButton} type="primary"/></Col>
                    </Row>

                    <Row>
                        <Col span={12} className={Styles.col}><StyledButton className={Styles.styledButton} type="primary"/></Col>
                        <Col span={12} className={Styles.col}><StyledButton className={Styles.styledButton} type="primary"/></Col>
                    </Row>
                </div>
            </Layout>
        );
    }
}
