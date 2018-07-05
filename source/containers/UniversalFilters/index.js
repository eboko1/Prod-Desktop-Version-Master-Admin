// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { onChangeUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';
import {
    fetchOrders,
    fetchStatsCounts,
    setUniversalFilters,
} from 'core/orders/duck';
import { fetchUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Catcher } from 'commons';
import { UniversalFiltersModal } from 'modals';
import { UniversalFiltersTags } from 'components';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        stats:                state.orders.statsCountsPanel.stats.stats,
        filter:               state.orders.filter,
        universaFiltersModal: state.modals.modal,
    };
};

const mapDispatchToProps = {
    fetchOrders,
    fetchStatsCounts,
    fetchUniversalFiltersForm,
    setUniversalFilters,
    onChangeUniversalFiltersForm,
    setModal,
    resetModal,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class UniversalFilters extends Component {
    setUniversalFiltersModal = () => {
        this.props.setModal(MODALS.UNIVERSAL_FILTERS);
        this.props.fetchStatsCounts();
        this.props.fetchUniversalFiltersForm();
    };

    clearUniversalFilters = filterNames => {
        const updateFilters = _.fromPairs(
            filterNames.map(filterName => [ filterName, void 0 ]),
        );
        this.props.onChangeUniversalFiltersForm(updateFilters);
        this.props.setUniversalFilters({
            ...this.props.filter,
            ...updateFilters,
        });
        this.props.fetchOrders();
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    handleUniversalFiltersModalSubmit = () => {
        const form = this.formRef.props.form;
        this.props.resetModal();
        form.validateFields((err, values) => {
            if (!err) {
                console.log(
                    'Received values of UniversalFiltersForm: ',
                    values,
                );
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

                this.props.setUniversalFilters({
                    ...values,
                    ...modelsTransformQuery,
                    ...momentFields,
                });
                this.props.fetchOrders();
            }
        });
    };

    render() {
        const { resetModal, universaFiltersModal, stats, filter } = this.props;

        return (
            <Catcher>
                <section className={ Styles.filters }>
                    <Button
                        type='primary'
                        onClick={ () => this.setUniversalFiltersModal() }
                    >
                        Фильтр
                    </Button>
                    <UniversalFiltersTags
                        filter={ filter }
                        clearUniversalFilters={ this.clearUniversalFilters.bind(
                            this,
                        ) }
                    />
                </section>
                <UniversalFiltersModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ universaFiltersModal }
                    stats={ stats }
                    filter={ filter }
                    handleUniversalFiltersModalSubmit={
                        this.handleUniversalFiltersModalSubmit
                    }
                    resetModal={ () => resetModal() }
                />
            </Catcher>
        );
    }
}
