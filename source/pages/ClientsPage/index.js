// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';

// proj
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Layout } from 'commons';
import { AddClientModal } from 'modals';
import { ClientsContainer } from 'containers';
import { permissions, isForbidden } from 'utils';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    modal:             state.modals.modal,
    addClientFormData: state.forms.addClientForm.data,
    user:              state.auth,
});

const mapDispatchToProps = {
    setModal,
    resetModal,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientsPage extends Component {
    _saveClientsPageRef = clientsPageRef => {
        this.clientsPageRef = clientsPageRef;
    };

    render() {
        const {
            user,
            modal,
            setModal,
            resetModal,
            addClientFormData,
            // form,
        } = this.props;

        return (
            <Layout
                title={ <FormattedMessage id='clients-page.title' /> }
                description={ <FormattedMessage id='clients-page.description' /> }
                controls={
                    <div className={ Styles.buttonGroup }>
                        <Button
                            disabled={
                                isForbidden(user, permissions.CREATE_ORDER) ||
                                isForbidden(
                                    user,
                                    permissions.CREATE_INVITE_ORDER,
                                )
                            }
                            onClick={ () => setModal(MODALS.INVITE) }
                        >
                            <FormattedMessage id='clients-page.invite_to_service' />
                        </Button>
                        <Button
                            type='primary'
                            onClick={ () => setModal(MODALS.ADD_CLIENT) }
                        >
                            <FormattedMessage id='clients-page.add_client' />
                        </Button>
                    </div>
                }
            >
                <div>ClientsContainer</div>
                { /* <ClientsContainer /> */ }
                <AddClientModal
                    // searchQuery={ form.getFieldValue('searchClientQuery') }
                    wrappedComponentRef={ this.clientsPageRef }
                    visible={ modal }
                    resetModal={ resetModal }
                    addClientFormData={ addClientFormData }
                />
            </Layout>
        );
    }
}
