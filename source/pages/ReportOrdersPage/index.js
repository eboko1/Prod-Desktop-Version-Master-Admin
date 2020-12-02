/*
The purpose of this module is to provide report about all clients' debts.
Also it provides basic search and print button.
*/
// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {Input, Checkbox} from 'antd';
import _ from "lodash";

const Search = Input.Search;

// proj
// import {
//     fetchReport,
//     fetchExcelFileReport,
//     setReportQuery,
//     setReportOverdueOnly,
// } from "core/reports/duck";

import {
    fetchReportOrders,
    setReportOrdersIncludeServicesDiscount,
} from 'core/reportOrders/duck';

import { Layout, Paper, Spinner, StyledButton, Catcher } from "commons";
import { ReportOrdersTable } from "components";
import { isForbidden, permissions } from "utils";

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    // stats: state.cash.stats,
    // user: state.auth,
    // report: state.reports.report,
    // isFetching: state.ui.reportFetching,
    tableData: state.reportOrders.tableData,
    includeServicesDiscount: state.reportOrders.options.includeServicesDiscount,
});

const mapDispatchToProps = {
    // fetchReport,
    // fetchExcelFileReport,
    // setReportQuery,
    // setReportOverdueOnly,
    fetchReportOrders,
    setReportOrdersIncludeServicesDiscount,

};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class CashClientsDebtsPage extends Component {
    constructor(props) {
        super(props);

        // this.handleReportsSearch = _.debounce(value => {
        //     const { fetchReport, setReportQuery } = this.props;
        //     setReportQuery(value);
        //     fetchReport();
        // }, 1000);
    }

    componentDidMount() {
        // this.props.fetchReport();
    }

    render() {
        const {
            // isFetching,
            // collapsed,
            // fetchExcelFileReport,
            // fetchReport,
            // report,
            // setReportOverdueOnly,
            fetchReportOrders,
            tableData,
            setReportOrdersIncludeServicesDiscount,
            includeServicesDiscount,
        } = this.props;

        // console.log("---------------------------------------", tableData);
        
        return (
            <Layout
                title={<FormattedMessage id="navigation.report_orders" />}
                paper={false}
            >
                {/* <section
                    className={`${Styles.filters} ${collapsed &&
                        Styles.filtersCollapsed}`}
                >
                    <Catcher>
                        <div className={Styles.filter}>
                            <Search
                                className={Styles.search}
                                placeholder={ this.props.intl.formatMessage({id: 'cash_clients_debts_page.filter_placeholder'}) }
                                onChange={({ target: { value } }) =>
                                    this.handleReportsSearch(value)
                                }
                            />
                        </div>
                        <div>
                            <Checkbox onChange={e => {
                                setReportOverdueOnly(e.target.checked);
                                fetchReport();
                            }}>
                                <FormattedMessage id="cash_clients_debts_page.overdue_only" />
                            </Checkbox>
                        </div>
                    </Catcher>
                </section> */}
                <button onClick={() => fetchReportOrders()}>Press me</button>
                <ReportOrdersTable 
                    totalCount={10}
                    tableData={tableData}
                    // stats={report.stats}
                    // reportFetching={isFetching}
                    setIncludeServicesDiscount={setReportOrdersIncludeServicesDiscount}
                    includeServicesDiscount={includeServicesDiscount}
                />
                {/* <Paper className={Styles.content}>
                    
                </Paper> */}
            </Layout>
        );
    }
}
