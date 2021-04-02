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

const mapDispatchToProps = {
    fetchCashOrdersLogs
};

@connect(
    void 0,
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
        
        return (
            <Layout
                title={
                    <div>
                        <div><FormattedMessage id="navigation.report_cash_orders_logs" /></div>
                    </div>
                }
                paper={false}
            >
                <ReportCashOrdersLogsTable/>
            </Layout>
        );
    }
}
