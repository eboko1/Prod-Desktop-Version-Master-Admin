/*
The purpose of this module is to provide report about all orders.
*/
// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";


// proj
import { fetchCashOrdersLogs } from 'core/reports/reportCashOrdersLogs/duck';
import { ReportCashOrdersLogsTable } from 'components';

import { Layout } from "commons";
import { isForbidden, permissions } from "utils";

const mapStateToProps = state => ({
    tableData: state.reportOrders.tableData,
    user: state.auth,
});

const mapDispatchToProps = {
    fetchCashOrdersLogs
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class ReportOrdersPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchCashOrdersLogs();
    }


    render() {
        const {
            user,
        } = this.props;

        
        return (
            <Layout
                title={
                    <div>
                        <div><FormattedMessage id="navigation.report_cash_orders_logs" /></div>
                    </div>
                }
                paper={false}
            >
                <ReportCashOrdersLogsTable
                
                />
            </Layout>
        );
    }
}
