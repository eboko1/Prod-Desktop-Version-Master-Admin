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
    setFiltersAnalyticsUniqueIds,
    setFiltersCashbox,
    fetchReportCashFlow,

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
    setCashOrderToDate,
    setFiltersAnalyticsUniqueIds,
    setFiltersCashbox,
    fetchReportCashFlow
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
        this.onCashboxSelect = this.onCashboxSelect.bind(this);
        this.onAnalyticsSelect = this.onAnalyticsSelect.bind(this);
    }

    onDateChange(arr) {
        const createdFromDate = _.get(arr, '[0]');
        const createdToDate = _.get(arr, '[1]');

        const {
            setCashOrderFromDate,
            setCashOrderToDate,
            fetchReportCashFlow
        } = this.props;

        //Call action for specific date
        createdFromDate.isValid() && setCashOrderFromDate(createdFromDate.format(DEFAULT_DATE_FORMAT));
        createdToDate.isValid() && setCashOrderToDate(createdToDate.format(DEFAULT_DATE_FORMAT));

        fetchReportCashFlow();

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

    onCashboxSelect(cashboxId) {
        const {
            setFiltersCashbox,
            fetchReportCashFlow
        } = this.props;

        setFiltersCashbox(cashboxId);
        fetchReportCashFlow();
    }

    onAnalyticsSelect(analyticsIds) {
        const {
            setFiltersAnalyticsUniqueIds,
            fetchReportCashFlow
        } = this.props;

        setFiltersAnalyticsUniqueIds(analyticsIds);
        fetchReportCashFlow();
    }

    render() {

        const {
            analytics,
            cashboxes,

            analyticsIsFetching,
            cashboxesIsFetching,
            intl: {formatMessage}
        } = this.props;

        const filteredAnalytics = _.filter(analytics, ans => !ans.analyticsDisabled);

        return (
            <div className={Styles.mainFilterCont}>
                <div className={Styles.selectCont}>
                    <Select
                        style={{width: '100%'}}
                        allowClear
                        showSearch
                        placeholder={formatMessage({id: 'report_cash_flow_page.cashbox'})}
                        disabled={analyticsIsFetching}
                        onChange={this.onCashboxSelect}
                        filterOption={(input, option) => {
                            return (
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                String(option.props.value).indexOf(input.toLowerCase()) >= 0
                            )
                        }}
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
                        showSearch
                        mode="multiple" //To enable multiple select
                        placeholder={formatMessage({id: 'report_cash_flow_page.analytics'})}
                        disabled={cashboxesIsFetching}
                        onChange={this.onAnalyticsSelect}
                        filterOption={(input, option) => {
                            return (
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                String(option.props.value).indexOf(input.toLowerCase()) >= 0
                            )
                        }}
                    >
                        {_.map(filteredAnalytics, ans => (
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