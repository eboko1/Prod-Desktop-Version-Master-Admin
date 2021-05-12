/*
The purpose of this module is to provide logts for rst and its orders.
*/
// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";
import moment from 'moment';

// proj
import {
    DEFAULT_DATE_FORMAT,
    fetchCashOrdersLogs,
    setCashOrdersLogsFilterDateRange,
    selectFilter,
} from 'core/reports/reportCashOrdersLogs/duck';
import { ReportCashOrdersLogsTable } from 'components';

import { Layout } from "commons";
import { DateRangePicker } from 'components';

const mapStateToProps = state => ({
    filter: selectFilter(state)
});

const mapDispatchToProps = {
    fetchCashOrdersLogs,
    setCashOrdersLogsFilterDateRange
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class ReportCashOrdersLogsPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchCashOrdersLogs();
    }

    onChangeDataRangeFilter = daterange => {
        const [ startDate, endDate ] = daterange;

        this.props.setCashOrdersLogsFilterDateRange({
            startDate: startDate? startDate.format(DEFAULT_DATE_FORMAT): undefined,
            endDate: endDate? endDate.format(DEFAULT_DATE_FORMAT): undefined
        });
    };

    render() {
        const { filter } = this.props;
        
        return (
            <Layout
                title={
                    <div>
                        <div><FormattedMessage id="navigation.report_cash_orders_logs" /></div>
                    </div>
                }
                paper={false}
                controls={
                    <div>
                        <DateRangePicker
                            minimize
                            style={{margin: 0}}//prevent default space
                            dateRange={[moment(filter.startDate), moment(filter.endDate)]}
                            onDateChange={ this.onChangeDataRangeFilter }
                        />
                    </div>
                }
            >
                <ReportCashOrdersLogsTable/>
            </Layout>
        );
    }
}
