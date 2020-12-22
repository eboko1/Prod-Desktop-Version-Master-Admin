// vendor
import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { Table } from 'antd';

// proj
import { fetchReport, setReportPage } from 'core/reports/reports/duck';

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    currentPage: state.reports.filter.page,
});

const mapDispatchToProps = {
    fetchReport,
    setReportPage,
};

@connect(mapStateToProps, mapDispatchToProps)
export class CashReportTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig();
    }

    render() {
        const { tableData, reportFetching, fetchReport, setReportPage, stats, currentPage } = this.props;
        
        const totalReportsCount = (!stats || !stats.totalReportsCount)? 25 : stats.totalReportsCount;

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            totalReportsCount,
            current:          currentPage,
            showQuickJumper: true,
            onChange:         page => {
                setReportPage(page);
                fetchReport();
            },
        };

        return (
            <Table
                size='small'
                className={ Styles.table }
                columns={ this.columns }
                pagination={ pagination }
                dataSource={ tableData }
                loading={reportFetching}
                locale={ {
                    emptyText: <FormattedMessage id='no_data' />,
                } }
                scroll={ { x: 1000, y: '50vh' } }
                rowKey={ record => record.id }
            />
        );
    }
}
