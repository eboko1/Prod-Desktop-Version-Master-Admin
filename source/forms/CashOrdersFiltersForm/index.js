// vendor
import React, { Component } from 'react';
import { Form, Select } from 'antd';
import { injectIntl } from 'react-intl';

// proj
import { fetchCashboxes, selectCashStats } from 'core/cash/duck';
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
    },
    mapStateToProps: state => ({
        cashStats: selectCashStats(state),
        cashboxes: state.cash.cashboxes,
    }),
})
@injectIntl
export class CashOrdersFiltersForm extends Component {
    componentDidMount() {
        this.props.fetchCashboxes();
    }

    render() {
        const {
            cashStats,
            cashboxes,
            intl: { formatMessage },
            form: { getFieldDecorator },
        } = this.props;

        return (
            <Form>
                <div className={ Styles.row }>
                    <DecoratedSearch
                        field='query'
                        getFieldDecorator={ getFieldDecorator }
                        className={ Styles.filter }
                        placeholder={ formatMessage({
                            id: 'orders-filter.search_placeholder',
                        }) }
                        // onChange={ ({ target: { value } }) =>
                        //     this.handleOrdersSearch(value)
                        // }
                    />
                    <DecoratedSelect
                        field='cashBoxId'
                        // label={ formatMessage({ id: 'add' }) }
                        placeholder={ formatMessage({
                            id: 'cash-order-form.cashbox',
                        }) }
                        getFieldDecorator={ getFieldDecorator }
                        cnStyles={ Styles.filter }
                    >
                        { cashboxes.map(({ id, name }) => (
                            <Option value={ id } key={ id }>
                                { name }
                            </Option>
                        )) }
                    </DecoratedSelect>
                    <DecoratedDatePicker
                        field='daterange'
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
                        format='YYYY-MM-DD HH:mm'
                    />
                </div>
                <StatsCountsPanel stats={ cashStats } extendedCounts />
            </Form>
        );
    }
}
