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
    }

    _setCashOrderEntity = cashOrderEntity => this.setState({ cashOrderEntity });

    render() {
        const {
            setIncludeServicesDiscount,
            includeServicesDiscount,
            tableData,
            stats,
            filter,
            filterControls
        } = this.props;

        //We need to upade props (needed for child components)
        this.columns = columnsConfig({
            setIncludeServicesDiscount,
            includeServicesDiscount,
            filterControls,
            filter: filter
        });

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
            <div className={Styles.paper}>
                <Table
                    size='middle'
                    columns={ this.columns }
                    pagination={ pagination }
                    dataSource={ tableData }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    scroll={ { y: '50vh' } }
                    rowKey={ record => record.id }
                    bordered
                />
            </div>
        );
    }
}
