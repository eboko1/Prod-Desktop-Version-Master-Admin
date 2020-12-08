/*
The purpose of this module is to provide report about all clients' debts.
Also it provides basic search and print button.
*/
// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {Input} from 'antd';
import _ from "lodash";

const Search = Input.Search;

// proj
import {
    fetchReportOrders,
    setReportOrdersIncludeServicesDiscount,
    setReportOrdersIncludeAppurtenanciesDiscount,
    setReportOrdersQuery,
    setReportOrdersStatus,
    setReportOrdersCreationFromDate,
    setReportOrdersCreationToDate,
    setReportOrdersAppointmentFromDate,
    setReportOrdersAppointmentToDate,
    setReportOrdersDoneFromDate,
    setReportOrdersDoneToDate,
    setReportOrdersPage,
} from 'core/reportOrders/duck';

import { Layout, Numeral } from "commons";
import { ReportOrdersTable, ReportOrdersFilter } from "components";
import { isForbidden, permissions } from "utils";

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    tableData: state.reportOrders.tableData,
    includeServicesDiscount: state.reportOrders.options.includeServicesDiscount,
    includeAppurtenanciesDiscount: state.reportOrders.options.includeAppurtenanciesDiscount,
    filter: state.reportOrders.filter,
    page: state.reportOrders.filter.page,
    stats: state.reportOrders.stats,
});

const mapDispatchToProps = {
    fetchReportOrders,
    setReportOrdersPage,
    setReportOrdersIncludeServicesDiscount,
    setReportOrdersIncludeAppurtenanciesDiscount,
    setReportOrdersQuery,
    setReportOrdersStatus,
    setReportOrdersCreationFromDate,
    setReportOrdersCreationToDate,
    setReportOrdersAppointmentFromDate,
    setReportOrdersAppointmentToDate,
    setReportOrdersDoneFromDate,
    setReportOrdersDoneToDate,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class CashClientsDebtsPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchReportOrders();
    }

    showStats(stats) {

        const {
            totalRowsCount,
            totalServicesSum,
            totalAppurtenanciesSum,
            totalServicesProfit,
            totalAppurtenanciesProfit,
        } = stats;

        const totalSum = (parseInt(totalServicesSum) + parseInt(totalAppurtenanciesSum));
        const totalProfit = (parseInt(totalServicesProfit) + parseInt(totalAppurtenanciesProfit));
        const totalLaborsMargin = ((totalServicesProfit*100.0)/totalServicesSum).toFixed(2);
        const totalAppurtenanciesMargin = ((totalAppurtenanciesProfit*100.0)/totalAppurtenanciesSum).toFixed(2);
        const totalMargin = (((totalProfit)/(totalSum))* 100.0).toFixed(2);

        return <div>
            <div className={Styles.statsCont}>
                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.labors_sum'} /></div>
                    <div className={Styles.statsText}><Numeral>{parseInt(totalServicesSum)}</Numeral></div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.parts_sum'} /></div>
                    <div className={Styles.statsText}><Numeral>{parseInt(totalAppurtenanciesSum)}</Numeral></div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.total_sum'} /></div>
                    <div className={Styles.statsText}><Numeral>{parseInt(totalSum)}</Numeral></div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.labors_profit'} /></div>
                    <div className={Styles.statsText}><Numeral>{parseInt(totalServicesProfit)}</Numeral></div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.parts_profit'} /></div>
                    <div className={Styles.statsText}><Numeral>{parseInt(totalAppurtenanciesProfit)}</Numeral></div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.total_profit'} /></div>
                    <div className={Styles.statsText}><Numeral>{parseInt(totalProfit)}</Numeral></div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.labors_margin'} /></div>
                    <div className={Styles.statsText}>{totalLaborsMargin}</div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.parts_margin'} /></div>
                    <div className={Styles.statsText}>{totalAppurtenanciesMargin}</div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.total_margin'} /></div>
                    <div className={Styles.statsText}>{totalMargin}</div>
                </div>

                <div className={Styles.statsBlock}>
                    <div className={Styles.statsHeader}><FormattedMessage id={'report_orders_page_page.total_rows'} /></div>
                    <div className={Styles.statsText}><Numeral>{totalRowsCount}</Numeral></div>
                </div>
            </div>
        </div>
    }

    render() {
        const {
            fetchReportOrders,
            tableData,
            setReportOrdersIncludeServicesDiscount,
            setReportOrdersIncludeAppurtenanciesDiscount,
            includeServicesDiscount,
            includeAppurtenanciesDiscount,
            filter,
            stats,
            setReportOrdersPage,

            setReportOrdersQuery,
            setReportOrdersStatus,
            setReportOrdersCreationFromDate,
            setReportOrdersCreationToDate,
            setReportOrdersAppointmentFromDate,
            setReportOrdersAppointmentToDate,
            setReportOrdersDoneFromDate,
            setReportOrdersDoneToDate,
        } = this.props;

        //Transfer all filter methods in one object to easily manipulate data
        const filterControls = {
            fetchReportOrders,

            setReportOrdersPage,
            setReportOrdersIncludeServicesDiscount,
            setReportOrdersIncludeAppurtenanciesDiscount,
            includeServicesDiscount,
            includeAppurtenanciesDiscount,

            setReportOrdersQuery,
            setReportOrdersStatus,
            setReportOrdersCreationFromDate,
            setReportOrdersCreationToDate,
            setReportOrdersAppointmentFromDate,
            setReportOrdersAppointmentToDate,
            setReportOrdersDoneFromDate,
            setReportOrdersDoneToDate,
        };
        
        return (
            <Layout
                title={<FormattedMessage id="navigation.report_orders" />}
                paper={false}
            >
                {this.showStats(stats)}

                <ReportOrdersTable
                    stats={stats}
                    filterControls={filterControls}
                    filter={filter}
                    totalCount={10}
                    tableData={tableData}
                    setIncludeServicesDiscount={setReportOrdersIncludeServicesDiscount}
                    includeServicesDiscount={includeServicesDiscount}
                />
            </Layout>
        );
    }
}
