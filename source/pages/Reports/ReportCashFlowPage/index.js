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
import {
    fetchReportCashFlow,
} from 'core/reports/reportCashFlow/duck';


// own
import Styles from "./styles.m.css";
import CashFlowItemsDropdown from './CashFlowItemsDropdown'

const mapStateToProps = state => ({
    tableData: state.reportCashFlow.tableData,
});

const mapDispatchToProps = {
    fetchReportCashFlow
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class ReportAnalyticsPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchReportCashFlow();
    }
    
    render() {

        const {
            tableData,
            intl: {formatMessage}
        } = this.props;

        return (
            <Layout
                title={
                    <div>
                        <div><FormattedMessage id="navigation.report_cash_flow" /></div>
                    </div>
                }
                controls={
                    <div className={Styles.buttonGroup}>
                        <StyledButton type="primary">Download full report</StyledButton>
                    </div>
                }
                paper={false}
            >
                <CashFlowItemsDropdown
                    tableData={tableData}
                />
            </Layout>
        );
    }
}
