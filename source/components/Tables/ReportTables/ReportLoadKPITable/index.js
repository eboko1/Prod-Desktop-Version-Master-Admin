// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Table } from 'antd';

// proj
import { Loader } from 'commons';

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

export class ReportLoadKPITable extends Component {
    constructor(props) {
        super(props);

    }

    // _setCashOrderEntity = cashOrderEntity => this.setState({ cashOrderEntity });

    render() {
        // const {
        //     setIncludeServicesDiscount,
        //     includeServicesDiscount,
        //     tableData,
        //     stats,
        //     filter,
        //     filterControls,
        //     loading,
        // } = this.props;

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            100,//Math.ceil(stats.totalRowsCount / 25) * 25,
            hideOnSinglePage: true,
            current:          0,//filter.page,
            onChange:         page => {
                // filterControls.setReportOrdersPage(page);
                // filterControls.fetchReportOrders();
            },
        };

        return (
            <div className={Styles.paper}>
                <Table
                    size='middle'
                    className={Styles.table}
                    columns={ columnsConfig() }
                    pagination={ pagination }
                    // dataSource={ tableData }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    scroll={ { x: 1800, y: '50vh' } }
                    rowKey={ record => record.id }
                    bordered
                    // loading={loading}
                />
            </div>
        );
    }
}
