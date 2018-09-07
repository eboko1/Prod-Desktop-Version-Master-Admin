// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';

// proj
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { fetchUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';

import { Layout } from 'commons';
import { AddClientModal } from 'modals';
import {
    ClientsContainer,
    ClientsFilterContainer,
    UniversalFilters,
} from 'containers';
import { permissions, isForbidden } from 'utils';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    modal:             state.modals.modal,
    addClientFormData: state.forms.addClientForm.data,
    collapsed:         state.ui.collapsed,
    user:              state.auth,
});

const mapDispatchToProps = {
    setModal,
    resetModal,
    fetchUniversalFiltersForm,
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
            collapsed,
        } = this.props;

        return (
            <Layout
                paper={ false }
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
                <section
                    className={ `${Styles.filters} ${collapsed &&
                        Styles.filtersCollapsed}` }
                >
                    <ClientsFilterContainer />
                    <UniversalFilters />
                </section>
                <section className={ Styles.table }>
                    <ClientsContainer />
                </section>
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
