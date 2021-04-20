/*
This page is a node page for client hot operations. It was developed to work with Biinotel service.
But it is very universal page, so it can be used somewhere else. All components have to be as autonomous as possible.
All folders have to structured in feature first order(all subcomponents in the same folder as parent is and each module 
autonomous as possible)

User on this page can select some operations for client:
    1. Create a new client - will be redirected to the page where user can create a new client
    2. Open client page - Redirect to a page with client's information(client page)
    3. Create order with that client
    4. Create a new order with a client and its car
*/

// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

// proj
import { setModal, resetModal, MODALS } from "core/modals/duck";
import { Layout, StyledButton } from "commons";
import { fetchClients } from 'core/clientHotOperations/duck';
import { AddClientModal } from 'modals';

// own
import ClientsContainer from './ClientsContainer';
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    user: state.auth,
    clients: state.clientHotOperations.clients,
    modal: state.modals.modal,
});

const mapDispatchToProps = {
    fetchClients,
    setModal,
    resetModal
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

    onAddClientModal = (e) => {
        this.props.setModal(MODALS.ADD_CLIENT);
    } 

    render() {

        const {
            intl: {formatMessage},
        } = this.props;
                
        return (
            <Layout
                title={ <div><FormattedMessage id="navigation.client_hot_operations" /></div> }
                paper={true}
                controls={(<div>
                    <StyledButton onClick={this.onAddClientModal} className={Styles.styledButton} type="secondary">
                        <FormattedMessage id={"client_hot_operations_page.create_new_cient"} />
                    </StyledButton>
                </div>)}
            >
                <ClientsContainer />
                <AddClientModal
                    visible={this.props.modal}
                    resetModal={this.props.resetModal}
                />
            </Layout>
        );
    }
}
