// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Table } from 'antd';

// proj
import { Loader } from 'commons';

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

export class ReportOrdersTable extends Component {
    constructor(props) {
        super(props);

        const {
            setIncludeServicesDiscount,
            includeServicesDiscount,
            filterControls,
            filter,
        } = props;

        this.columns = columnsConfig({
            setIncludeServicesDiscount,
            includeServicesDiscount,
            filterControls,
            filter
        });
    }

    _setCashOrderEntity = cashOrderEntity => this.setState({ cashOrderEntity });

    render() {
        const {
            tableData,
            stats,
            filter,
            filterControls
        } = this.props;

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(stats.totalRowsCount / 25) * 25,
            hideOnSinglePage: true,
            current:          filter.page,
            onChange:         page => {
                filterControls.setReportOrdersPage(page);
                filterControls.fetchReportOrders();
            },
        };

        return (
            <Table
                size='small'
                className={ Styles.table }
                columns={ this.columns }
                pagination={ pagination }
                dataSource={ tableData }
                locale={ {
                    emptyText: <FormattedMessage id='no_data' />,
                } }
                scroll={ { x: 1000 } }
                rowKey={ record => record.id }
                bordered
            />
        );
    }
}
