// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table } from 'antd';

// proj

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

@injectIntl
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
            filterControls,
            loading,
        } = this.props;

        //We need to upade props (needed for child components)
        this.columns = columnsConfig({
            setIncludeServicesDiscount,
            includeServicesDiscount,
            filterControls,
            filter: filter,
            formatMessage: this.props.intl.formatMessage
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
                    className={Styles.table}
                    columns={ this.columns }
                    pagination={ pagination }
                    dataSource={ tableData }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    scroll={ { x: 1800, y: '50vh' } }
                    rowKey={ record => record.orderId }
                    bordered
                    loading={loading}
                />
            </div>
        );
    }
}
