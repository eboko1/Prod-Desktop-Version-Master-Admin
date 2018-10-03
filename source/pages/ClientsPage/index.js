// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

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
import { setUniversalFilters, setSearchQuery } from 'core/clients/duck';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    modal:             state.modals.modal,
    addClientFormData: state.forms.addClientForm.data,
    collapsed:         state.ui.collapsed,
    user:              state.auth,
    stats:             state.clients.stats,
    universalFilter:   state.clients.universalFilter,
    searchQuery:       state.clients.searchQuery,
});

const mapDispatchToProps = {
    setModal,
    resetModal,
    fetchUniversalFiltersForm,
    setUniversalFilters,
    setSearchQuery,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientsPage extends Component {
    render() {
        const {
            modal,
            setModal,
            resetModal,
            addClientFormData,
            collapsed,
            stats,
            setSearchQuery,
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
                            disabled={ isForbidden(
                                this.props.user,
                                permissions.CREATE_EDIT_DELETE_CLIENTS,
                            ) }
                            onClick={ () => setModal(MODALS.ADD_CLIENT) }
                        >
                            <FormattedMessage id='clients-page.add_client' />
                        </StyledButton>
                    </div>
                }
            >
                <section
                    className={ `${Styles.filters} ${collapsed &&
                        Styles.filtersCollapsed}` }
                >
                    <ClientsFilterContainer setSearchQuery={ setSearchQuery } />
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
                    searchQuery={ this.props.searchQuery }
                    wrappedComponentRef={ this.clientsPageRef }
                    visible={ modal }
                    resetModal={ resetModal }
                    addClientFormData={ addClientFormData }
                />
            </Layout>
        );
    }
}
