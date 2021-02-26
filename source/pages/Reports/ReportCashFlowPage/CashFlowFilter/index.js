//vendor
import React from 'react';
import {Select} from 'antd'
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from 'lodash';
import moment from 'moment';

//proj
import {DateRangePicker} from 'components';
import {
    setCashOrderFromDate,
    setCashOrderToDate,
    DEFAULT_DATE_FORMAT
} from 'core/reports/reportCashFlow/duck';

//own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    cashOrderFromDate: state.reportCashFlow.filters.createdFromDate,
    cashOrderToDate: state.reportCashFlow.filters.createdToDate,
    analytics: state.reportCashFlow.analytics,
    cashboxes: state.reportCashFlow.cashboxes,
    analyticsIsFetching: state.reportCashFlow.analyticsIsFetching,
    cashboxesIsFetching: state.reportCashFlow.cashboxesIsFetching
});

const mapDispatchToProps = {
    setCashOrderFromDate,
    setCashOrderToDate
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class CashFlowFilter extends React.Component {
    constructor(props) {
        super(props);

        this.onDateChange = this.onDateChange.bind(this);
        this.getDaterange = this.getDateRange.bind(this);
    }

    onDateChange(arr) {
        const createdFromDate = _.get(arr, '[0]');
        const createdToDate = _.get(arr, '[1]');

        const {
            setCashOrderFromDate,
            setCashOrderToDate
        } = this.props;

        //Call action for specific date
        createdFromDate.isValid() && setCashOrderFromDate(createdFromDate.format(DEFAULT_DATE_FORMAT));
        createdToDate.isValid() && setCashOrderToDate(createdToDate.format(DEFAULT_DATE_FORMAT));

    }

    /**
     * Returns undefined if canntot reproduce full dateRange(not all fields are present)
     * else return date range
     */
    getDateRange() {
        const {
            cashOrderFromDate,
            cashOrderToDate,
        } = this.props;

        if(!cashOrderFromDate || !cashOrderToDate) return undefined;

        let dateRange = [
            moment(cashOrderFromDate, DEFAULT_DATE_FORMAT),
            moment(cashOrderToDate, DEFAULT_DATE_FORMAT)
        ];

        return dateRange;
    }

    render() {

        const {
            analytics,
            cashboxes,

            analyticsIsFetching,
            cashboxesIsFetching,
            intl: {formatMessage}
        } = this.props;

        return (
            <div className={Styles.mainFilterCont}>
                <div className={Styles.selectCont}>
                    <Select
                        style={{width: '100%'}}
                        allowClear
                        placeholder={formatMessage({id: 'report_cash_flow_page.cashbox'})}
                        disabled={analyticsIsFetching}
                    >
                        {_.map(cashboxes, obj => (
                            <Select.Option key={obj.id} value={obj.id}>
                                {obj.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                <div className={Styles.selectCont}>
                    <Select
                        style={{width: '100%'}}
                        allowClear
                        mode="multiple" //To enable multiple select
                        placeholder={formatMessage({id: 'report_cash_flow_page.analytics'})}
                        disabled={cashboxesIsFetching}
                    >
                        {_.map(analytics, ans => (
                            <Select.Option key={ans.analyticsUniqueId} value={ans.analyticsUniqueId}>
                                {ans.analyticsName}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                
                <div className={Styles.selectCont}>
                    <DateRangePicker
                        dateRange={this.getDateRange()}
                        onDateChange={this.onDateChange}
                    />
                </div>
            </div>
        );
    }
}