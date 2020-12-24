/*
This module shows Load KPI report. It has some subcomponents.
*/
// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {Input, Button} from 'antd';
import _ from "lodash";

// proj
import {
    fetchReportLoadKPI,
    setReportLoadKPIPage
} from 'core/reports/reportLoadKPI/duck';

import { Layout, Numeral } from "commons";
import {ReportLoadKPITable, ReportLoadKPIFilter} from 'components';

// own
import Styles from "./styles.m.css";
import Stats from './Stats';

const mapStateToProps = state => ({
    tableData: state.reportLoadKPI.tableData,
    filter: state.reportLoadKPI.filter,
    stats: state.reportLoadKPI.stats,
});

const mapDispatchToProps = {
    fetchReportLoadKPI,
    setReportLoadKPIPage
};


@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class ReportLoadKPIPage extends Component {
    constructor(props) {
        super(props);

        this.onTablePage = this.onTablePage.bind(this);
    }

    componentDidMount() {
        this.props.fetchReportLoadKPI();
    }

    onTablePage(page) {
        const {fetchReportLoadKPI, setReportLoadKPIPage} = this.props;
        setReportLoadKPIPage(page);
        fetchReportLoadKPI();
    }

    render() {
        const {
            filter,
            tableData,
            stats
        } = this.props;

        
        return (
            <Layout
                title={<FormattedMessage id="navigation.report_load_kpi" />}
                paper={false}
            >
                <div className={Styles.mainCont}>
                    <div className={Styles.header}>
                        <div className={Styles.filterCont}>
                            <ReportLoadKPIFilter />
                        </div>
                        <div className={Styles.statsCont}>
                            <Stats
                                stats={stats}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <Button onClick={() => this.props.fetchReportLoadKPI()}>
                        Reload
                    </Button>
                </div>

                <ReportLoadKPITable
                    filter={filter}
                    onPageChange={this.onTablePage}
                    tableData={tableData}
                    stats={stats}
                />
            </Layout>
        );
    }
}
