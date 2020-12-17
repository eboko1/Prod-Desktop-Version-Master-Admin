// vendor
import React, { Component } from "react";
import { Form, Select, Input } from "antd";
import { injectIntl } from "react-intl";
import moment from "moment";
import _ from "lodash";

// proj
import {
    fetchCashboxes,
    fetchCashOrders,
    selectCashStats,
    setCashOrdersFilters,
    selectCashOrdersFilters,
    setSearchQuery,
} from "core/cash/duck";
import { onChangeCashOrdersFiltersForm } from "core/forms/cashOrdersFiltersForm/duck";

import { StatsCountsPanel, DateRangePicker } from "components";
import {
    DecoratedSearch,
    DecoratedSelect,
    DecoratedDatePicker,
} from "forms/DecoratedFields";
import { withReduxForm2, getDaterange } from "utils";

// own
import Styles from "./styles.m.css";
const Search = Input.Search;
const Option = Select.Option;

@withReduxForm2({
    name: "cashOrdersFiltersForm",
    actions: {
        change: onChangeCashOrdersFiltersForm,
        fetchCashboxes,
        fetchCashOrders,
        setCashOrdersFilters,
        setSearchQuery,
    },
    debouncedFields: ["query"],
    mapStateToProps: state => ({
        cashStats: selectCashStats(state),
        filters: selectCashOrdersFilters(state),
        cashboxes: state.cash.cashboxes,
    }),
})
@injectIntl
export class CashOrdersFiltersForm extends Component {
    componentDidMount() {
        this.props.fetchCashboxes();
    }

    _onSearch = value => this.props.setSearchQuery(value);

    _onCashboxSelect = value => {
        this.props.setCashOrdersFilters({ cashBoxId: value });
        this.props.fetchCashOrders();
    };

    _onDateRangeChange = value => {
        const normalizedValue = value.map(date => date.format("YYYY-MM-DD"));
        const daterange = {
            startDate: normalizedValue[0],
            endDate: normalizedValue[1],
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
                <div className={Styles.row}>
                    <Search
                        placeholder={formatMessage({
                            id: "orders-filter.search_placeholder",
                        })}
                        onChange={({ target: { value } }) =>
                            this._onSearch(value)
                        }
                        className={Styles.filter}
                    />
                    <DecoratedSelect
                        field="cashBoxId"
                        initialValue={filters.cashBoxId}
                        placeholder={formatMessage({
                            id: "cash-order-form.cashbox",
                        })}
                        getFieldDecorator={getFieldDecorator}
                        cnStyles={Styles.filter}
                        onChange={this._onCashboxSelect}
                        allowClear
                    >
                        {cashboxes.map(({ id, name }) => (
                            <Option value={id} key={id}>
                                {name}
                            </Option>
                        ))}
                    </DecoratedSelect>
                    <DateRangePicker
                        dateRange={[
                            moment(filters.startDate),
                            moment(filters.endDate),
                        ]}
                        onDateChange={ this._onDateRangeChange }
                    />
                </div>
                <StatsCountsPanel stats={cashStats} extendedCounts />
            </Form>
        );
    }
}
