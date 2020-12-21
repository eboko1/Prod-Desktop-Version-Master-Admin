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
import {
    fetchReport,
    fetchExcelFileReport,
    setReportQuery,
    setReportOverdueOnly,
} from "core/reports/reports/duck";

import { Layout, Paper, Spinner, StyledButton, Catcher } from "commons";
import { CashReportTable } from "components";
import { isForbidden, permissions } from "utils";

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    stats: state.cash.stats,
    user: state.auth,
    report: state.reports.report,
    isFetching: state.ui.reportFetching,
});

const mapDispatchToProps = {
    fetchReport,
    fetchExcelFileReport,
    setReportQuery,
    setReportOverdueOnly
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class CashClientsDebtsPage extends Component {
    constructor(props) {
        super(props);

        this.handleReportsSearch = _.debounce(value => {
            const { fetchReport, setReportQuery } = this.props;
            setReportQuery(value);
            fetchReport();
        }, 1000);
    }

    componentDidMount() {
        this.props.fetchReport();
    }

    render() {
        const {
            isFetching,
            collapsed,
            fetchExcelFileReport,
            fetchReport,
            report,
            setReportOverdueOnly,
        } = this.props;

        
        return (
            <Layout
                title={<FormattedMessage id="navigation.clients_debts" />}
                controls={
                    <div className={Styles.buttonGroup}>
                        <StyledButton
                            type="secondary"
                            onClick={() => fetchExcelFileReport()}
                        >
                            <FormattedMessage id="cash_clients_debts_page.get_excel_file" />
                        </StyledButton>
                    </div>
                }
                paper={false}
            >
                <section
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
                </section>
                <Paper className={Styles.content}>
                    <CashReportTable 
                    totalCount={10}
                    tableData={report.tableData}
                    stats={report.stats}
                    reportFetching={isFetching}
                    />
                </Paper>
            </Layout>
        );
    }
}
