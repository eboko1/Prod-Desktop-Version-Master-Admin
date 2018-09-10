// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import {
    onChangeUniversalFiltersForm,
    fetchUniversalFiltersForm,
    fetchStatsCounts,
    setUniversalFilters,
} from 'core/forms/universalFiltersForm/duck';
import { fetchClients } from 'core/clients/duck';
import { fetchOrders } from 'core/orders/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Catcher } from 'commons';
import { UniversalFiltersModal } from 'modals';
import { UniversalFiltersTags } from 'components';
import { permissions, isForbidden } from 'utils';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    stats:                state.forms.universalFiltersForm.stats,
    ordersFilter:         state.orders.filter,
    clientsFilter:        state.clients.filter,
    universalFilters:     state.forms.universalFiltersForm.fields,
    universaFiltersModal: state.modals.modal,
    user:                 state.auth,
});

const mapDispatchToProps = {
    fetchClients,
    fetchOrders,
    fetchStatsCounts,
    fetchUniversalFiltersForm,
    setUniversalFilters,
    onChangeUniversalFiltersForm,
    setModal,
    resetModal,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class UniversalFilters extends Component {
    state = {
        filters: {},
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.type === 'clients') {
            return {
                filters: {
                    ...nextProps.clientsFilter,
                    ...nextProps.universalFilters,
                },
            };
        }

        if (nextProps.type === 'orders') {
            return {
                filters: {
                    ...nextProps.ordersFilter,
                    ...nextProps.universalFilters,
                },
            };
        }
    }

    _saveFormRef = formRef => {
        this.formRef = formRef;
    };

    _setUniversalFiltersModal = () => {
        this.props.setModal(MODALS.UNIVERSAL_FILTERS);
        this.props.fetchStatsCounts();
        this.props.fetchUniversalFiltersForm();
    };

    _clearUniversalFilters = filterNames => {
        const {
            fetchOrders,
            fetchClients,
            onChangeUniversalFiltersForm,
            setUniversalFilters,
            type,
        } = this.props;
        const { filters } = this.state;

        const updateFilters = _.fromPairs(
            filterNames.map(filterName => [ filterName, void 0 ]),
        );
        onChangeUniversalFiltersForm(updateFilters);
        setUniversalFilters({
            ...filters,
            ...updateFilters,
        });

        if (type === 'clients') {
            fetchClients();
        }
        if (type === 'orders') {
            fetchOrders();
        }
    };

    _handleUniversalFiltersModalSubmit = () => {
        const {
            resetModal,
            fetchOrders,
            fetchClients,
            setUniversalFilters,
            type,
        } = this.props;
        const form = this.formRef.props.form;

        resetModal();
        form.validateFields((err, values) => {
            if (!err) {
                const modelsTransformQuery = values.models
                    ? {
                        models: _(values.models)
                            .map(model => model.split(','))
                            .flatten()
                            .value(),
                    }
                    : {};

                const [ startDate, endDate ] = values.beginDate || [];
                const [ createStartDate, createEndDate ] =
                    values.createDate || [];

                const momentFields = _({
                    startDate,
                    endDate,
                    createEndDate,
                    createStartDate,
                })
                    .pickBy(moment.isMoment)
                    .mapValues(momentDate => momentDate.format('YYYY-MM-DD'))
                    .value();

                setUniversalFilters({
                    ...values,
                    ...modelsTransformQuery,
                    ...momentFields,
                });

                if (type === 'clients') {
                    fetchClients();
                }
                if (type === 'orders') {
                    fetchOrders();
                }
            }
        });
    };

    render() {
        const { user, resetModal, universaFiltersModal, stats } = this.props;

        const { filters } = this.state;

        const areFiltersDisabled = isForbidden(user, permissions.SHOW_FILTERS);

        return (
            <Catcher>
                <section className={ Styles.filters }>
                    <Button
                        type='primary'
                        disabled={ areFiltersDisabled }
                        onClick={ () => this._setUniversalFiltersModal() }
                    >
                        <FormattedMessage id='universal-filters-container.filter' />
                    </Button>
                    <UniversalFiltersTags
                        filter={ filters }
                        clearUniversalFilters={ this._clearUniversalFilters.bind(
                            this,
                        ) }
                    />
                </section>
                <UniversalFiltersModal
                    wrappedComponentRef={ this._saveFormRef }
                    visible={ universaFiltersModal }
                    stats={ stats }
                    filter={ filters }
                    handleUniversalFiltersModalSubmit={
                        this._handleUniversalFiltersModalSubmit
                    }
                    resetModal={ () => resetModal() }
                />
            </Catcher>
        );
    }
}
