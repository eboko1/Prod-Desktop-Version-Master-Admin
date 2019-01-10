// vendor
import React, { Component } from 'react';
import { Form, Select } from 'antd';
import { injectIntl } from 'react-intl';
import moment from 'moment';

// proj
import {
    fetchCashboxes,
    fetchCashOrders,
    selectCashStats,
    setCashOrdersFilters,
    selectCashOrdersFilters,
} from 'core/cash/duck';
import { onChangeCashOrdersFiltersForm } from 'core/forms/cashOrdersFiltersForm/duck';

import { StatsCountsPanel } from 'components';
import {
    DecoratedSearch,
    DecoratedSelect,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';
import { withReduxForm2, getDaterange } from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

@withReduxForm2({
    name:    'cashOrdersFiltersForm',
    actions: {
        change: onChangeCashOrdersFiltersForm,
        fetchCashboxes,
        fetchCashOrders,
        setCashOrdersFilters,
    },
    mapStateToProps: state => ({
        cashStats: selectCashStats(state),
        filters:   selectCashOrdersFilters(state),
        cashboxes: state.cash.cashboxes,
    }),
})
@injectIntl
export class CashOrdersFiltersForm extends Component {
    componentDidMount() {
        this.props.fetchCashboxes();
    }

    _onSearch = ({ target: { value } }) => {
        this.props.setCashOrdersFilters({ query: value });
        this.props.fetchCashOrders();
    };

    _onCashboxSelect = value => {
        this.props.setCashOrdersFilters({ cashBoxId: value });
        this.props.fetchCashOrders();
    };

    _onDateRangeChange = value => {
        const normalizedValue = value.map(date => date.format('YYYY-MM-DD'));
        const daterange = {
            startDate: normalizedValue[ 0 ],
            endDate:   normalizedValue[ 1 ],
        };
        this.props.setCashOrdersFilters(daterange);
        this.props.fetchCashOrders();
    };

    render() {
        const {
            cashStats,
            cashboxes,
            filters,
            intl: { formatMessage },
            form: { getFieldDecorator },
        } = this.props;

        return (
            <Form>
                <div className={ Styles.row }>
                    <DecoratedSearch
                        fields={ {} }
                        field='query'
                        getFieldDecorator={ getFieldDecorator }
                        className={ Styles.filter }
                        placeholder={ formatMessage({
                            id: 'orders-filter.search_placeholder',
                        }) }
                        onChange={ this._onSearch }
                    />
                    <DecoratedSelect
                        field='cashBoxId'
                        initialValue={ filters.cashBoxId }
                        placeholder={ formatMessage({
                            id: 'cash-order-form.cashbox',
                        }) }
                        getFieldDecorator={ getFieldDecorator }
                        cnStyles={ Styles.filter }
                        onChange={ this._onCashboxSelect }
                        allowClear
                    >
                        { cashboxes.map(({ id, name }) => (
                            <Option value={ id } key={ id }>
                                { name }
                            </Option>
                        )) }
                    </DecoratedSelect>
                    <DecoratedDatePicker
                        field='daterange'
                        initialValue={ [ moment(filters.startDate), moment(filters.endDate) ] }
                        // initialValue={ {
                        //     startDate: filters.startDate,
                        //     endDate:   filters.endDate,
                        // } }
                        getFieldDecorator={ getFieldDecorator }
                        formatMessage={ formatMessage }
                        getCalendarContainer={ trigger => trigger.parentNode }
                        cnStyles={ Styles.filter }
                        ranges={ {
                            // this day
                            [ formatMessage({
                                id: 'datepicker.today',
                            }) ]: getDaterange('today', 'ant'),
                            // prev month
                            [ formatMessage({
                                id: 'datepicker.prev_month',
                            }) ]: getDaterange('prevMonth', 'ant'),
                            // prev year
                            [ formatMessage({
                                id: 'datepicker.prev_year',
                            }) ]: getDaterange('prevYear', 'ant'),
                        } }
                        // showTime
                        format='YYYY-MM-DD'
                        onChange={ this._onDateRangeChange }
                    />
                </div>
                <StatsCountsPanel stats={ cashStats } extendedCounts />
            </Form>
        );
    }
}
