// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';
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

import { Catcher } from 'commons';
import { UniversalFiltersModal } from 'modals';
import { UniversalFiltersTags } from 'components';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        stats:  state.orders.statsCountsPanel.stats.stats,
        filter: state.orders.filter,
    };
};

const mapDispatchToProps = {
    fetchOrders,
    fetchStatsCounts,
    fetchUniversalFiltersForm,
    setUniversalFilters,
    onChangeUniversalFiltersForm,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class UniversalFilters extends Component {
    constructor(props) {
        super(props);

        this.clearUniversalFilter = this.clearUniversalFilter.bind(this);
    }

    state = {
        visible: false,
    };

    setUniversalFiltersModal = visible => {
        this.setState(state => {
            if (!state.visible) {
                this.props.fetchStatsCounts();
                this.props.fetchUniversalFiltersForm();
            }

            return { visible };
        });
    };

    clearUniversalFilter = filterName => {
        this.props.onChangeUniversalFiltersForm(
            { [ filterName ]: void 0 },
            { form: 'universalFiltersForm', field: filterName },
        );
        this.props.setUniversalFilters({ ...this.props.filter, [ filterName ]: void 0 });
        this.props.fetchOrders();
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    handleUniversalFiltersModalSubmit = () => {
        const form = this.formRef.props.form;
        this.setUniversalFiltersModal(false);
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

                const momentFields = _(values)
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
        return (
            <Catcher>
                <section className={ Styles.filters }>
                    <Button
                        type='primary'
                        onClick={ () => this.setUniversalFiltersModal(true) }
                    >
                        Фильтр
                    </Button>
                    <UniversalFiltersTags
                        filter={ this.props.filter }
                        clearUniversalFilter={ this.clearUniversalFilter }
                    />
                </section>
                <UniversalFiltersModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ this.state.visible }
                    show={ this.setUniversalFiltersModal }
                    stats={ this.props.stats }
                    filter={ this.props.filter }
                    handleUniversalFiltersModalSubmit={
                        this.handleUniversalFiltersModalSubmit
                    }
                    setUniversalFiltersModal={ this.setUniversalFiltersModal }
                    // onSubmit={}
                    // onClose={}
                />
            </Catcher>
        );
    }
}
