// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';

// proj
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { fetchUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';

import { Layout, StyledButton } from 'commons';
import { AddClientModal } from 'modals';
import {
    ClientsContainer,
    ClientsFilterContainer,
    UniversalFilters,
} from 'containers';
import { permissions, isForbidden } from 'utils';
import { setUniversalFilters } from 'core/clients/duck';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    modal:             state.modals.modal,
    addClientFormData: state.forms.addClientForm.data,
    collapsed:         state.ui.collapsed,
    user:              state.auth,
    stats:             state.clients.stats,
    universalFilter:   state.clients.universalFilter,
});

const mapDispatchToProps = {
    setModal,
    resetModal,
    fetchUniversalFiltersForm,
    setUniversalFilters,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientsPage extends Component {
    render() {
        const {
            user,
            modal,
            setModal,
            resetModal,
            addClientFormData,
            collapsed,
            stats,
        } = this.props;

        return (
            <Layout
                paper={ false }
                title={ <FormattedMessage id='clients-page.title' /> }
                description={ <FormattedMessage id='clients-page.description' /> }
                controls={
                    <div className={ Styles.buttonGroup }>
                        <StyledButton
                            type='secondary'
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
                        </StyledButton>
                        <Button
                            type='primary'
                            disabled={ isForbidden(
                                this.props.user,
                                permissions.CREATE_EDIT_DELETE_CLIENTS,
                            ) }
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
                    <UniversalFilters
                        areFiltersDisabled={ isForbidden(
                            this.props.user,
                            permissions.FILTER_CLIENTS,
                        ) }
                        universalFilter={ this.props.universalFilter }
                        setUniversalFilter={ this.props.setUniversalFilters }
                        stats={ stats }
                    />
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
