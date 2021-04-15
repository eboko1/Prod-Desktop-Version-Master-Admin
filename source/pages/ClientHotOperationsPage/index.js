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
                <div style={{width: '100%', height: '90vh', margin: '0 auto 0 auto', padding: '5px', backgroundColor: 'grey'}}>
                    <ClientsContainer />
                </div>
                <AddClientModal
                    // searchQuery={searchClientQuery}
                    visible={this.props.modal}
                    resetModal={this.props.resetModal}
                    // addClientFormData={this.props.addClientFormData}
                />
            </Layout>
        );
    }
}
