/*
This is cash flow report page, it uses analytics to provide report(it is base of this report).
Each analytics level has it's sum values.
Each analytics is grouped accordingly to its level in a binary tree(parent analytics and its dependencies)

Release date: 24.02.2021;
Last updated: 24.02.2021;
*/

// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

// proj
import { Layout, StyledButton } from "commons";
import { StatsPanel } from 'components';
import { permissions, isForbidden } from 'utils';
import {
    fetchReportCashFlow,
    fetchAnalytics,
    fetchCashboxes,
    fetchExcelFileReport
} from 'core/reports/reportCashFlow/duck';


// own
import Styles from "./styles.m.css";
import CashFlowItemsDropdown from './CashFlowItemsDropdown';
import CashFlowFilter from './CashFlowFilter';

const mapStateToProps = state => ({
    tableData: state.reportCashFlow.tableData,
    stats: state.reportCashFlow.stats,
    user: state.auth,
});

const mapDispatchToProps = {
    fetchReportCashFlow,
    fetchAnalytics,
    fetchCashboxes,
    fetchExcelFileReport
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class ReportCashFlowPage extends Component {
    constructor(props) {
        super(props);

        this.onGetExelFileReport = this.onGetExelFileReport.bind(this);
    }

    componentDidMount() {
        this.props.fetchReportCashFlow();

        //For filter
        this.props.fetchAnalytics();
        this.props.fetchCashboxes();
    }

    getNormalizedStats(stats) {

        const {
            intl: {formatMessage}
        } = this.props;

        const normalizedStats = [
            {
                label: formatMessage({id: 'report_cash_flow_page.total_increase'}),
                value: stats.totalIncreaseSum,
            },
            {
                label: formatMessage({id: 'report_cash_flow_page.total_decrease'}),
                // TT requires decreasing sums to be with minus before nuber
                value: -stats.totalDecreaseSum,
            },
            {
                label: formatMessage({id: 'report_cash_flow_page.total_balance'}),
                value: stats.totalBalanceSum,
            }
        ];

        return normalizedStats;
    }

    onGetExelFileReport(e) {
        const {
            fetchExcelFileReport
        } = this.props;

        fetchExcelFileReport();
    }
    
    render() {

        const {
            tableData,
            stats,
            user,
            intl: {formatMessage}
        } = this.props;

        const normalizedStats= this.getNormalizedStats(stats);


        return (
            <Layout
                title={
                    <div>
                        <div><FormattedMessage id="navigation.report_cash_flow" /></div>
                    </div>
                }
                controls={
                    <div className={Styles.buttonGroup}>
                        <StyledButton
                            type="primary"
                            onClick={this.onGetExelFileReport}
                            disabled={ isForbidden(user, permissions.ACCESS_REPORT_PROFIT_FROM_BUSINESSES_PRINT) }
                        >
                            <FormattedMessage id='report_cash_flow_page.download_full_report'/>
                        </StyledButton>
                    </div>
                }
                paper={false}
            >
                <div className={Styles.header}>
                    <div className={Styles.filterCont}>
                        <CashFlowFilter />
                    </div>

                    <div>
                        <StatsPanel extended stats={normalizedStats}/>
                    </div>
                </div>
                
                <CashFlowItemsDropdown
                    tableData={tableData}
                />
            </Layout>
        );
    }
}
