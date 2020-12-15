// vendor
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Table } from "antd";
import _ from "lodash";
import moment from 'moment';

// proj
import {
    fetchCashboxesActivity,
    setCashAccountingFilters,
    setCashOrdersFilters,
    selectCashAccountingFilters,
} from "core/cash/duck";

import book from "routes/book";
import { RangePickerField } from "forms/_formkit";
import { ResponsiveView } from "commons";
import { DateRangePicker } from 'components';
import { BREAKPOINTS, linkTo } from "utils";

// own
import { columnsConfig } from "./config";
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    data: state.cash.activity,
    filters: selectCashAccountingFilters(state),
});

const mapDispatchToProps = {
    fetchCashboxesActivity,
    setCashAccountingFilters,
    setCashOrdersFilters,
};

@connect(mapStateToProps, mapDispatchToProps)
export class CashActivityTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig();
    }

    componentDidMount() {
        this.props.fetchCashboxesActivity();
    }

    _onDateRangeChange = value => {
        const normalizedValue = value.map(date => date.format("YYYY-MM-DD"));
        const daterange = {
            startDate: normalizedValue[0],
            endDate: normalizedValue[1],
        };
        this.props.setCashAccountingFilters(daterange);
        this.props.fetchCashboxesActivity();
    };

    _onRowClick = data => {
        const { filters, setCashOrdersFilters } = this.props;
        linkTo(book.cashFlowPage);
        setCashOrdersFilters({
            cashBoxId: data.id,
            startDate: filters.startDate,
            endDate: filters.endDate,
        });
    };

    render() {
        const { cashboxesFetching, data, filters } = this.props;

        return (
            <div className={Styles.tableWrapper}>
                <div className={Styles.tableHead}>
                    <ResponsiveView
                        view={{ min: BREAKPOINTS.xxl.min, max: null }}
                    >
                        <h3 className={Styles.tableHeadText}>
                            <FormattedMessage id="cash-table.trace" />
                        </h3>
                    </ResponsiveView>
                    <DateRangePicker
                        dateRange={[
                            moment(_.get(filters, "startDate")),
                            moment( _.get(filters, "endDate"))
                        ]}
                        onDateChange={ this._onDateRangeChange }
                    />
                </div>
                <Table
                    className={Styles.table}
                    size="small"
                    columns={this.columns}
                    dataSource={data}
                    loading={cashboxesFetching}
                    pagination={false}
                    onRow={record => ({
                        onClick: () => this._onRowClick(record),
                    })}
                    locale={{
                        emptyText: <FormattedMessage id="no_data" />,
                    }}
                />
            </div>
        );
    }
}
