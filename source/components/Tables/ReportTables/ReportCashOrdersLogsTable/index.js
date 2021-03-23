// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table } from 'antd';

// proj

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';
import _ from 'lodash';

@injectIntl
export class ReportCashOrdersLogsTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // const {
        //     // tableData,
        //     // stats,
        //     // loading,
        // } = this.props;

        //We need to upade props (needed for child components)
        this.columns = columnsConfig();

        const pagination = {
            pageSize:         25,
            size:             'large',
            // total:            Math.ceil(stats.totalRowsCount / 25) * 25,
            total:            100,
            hideOnSinglePage: true,
            // current:          filter.page,
            current:          1,
            // onChange:         page => {
            //     filterControls.setReportOrdersPage(page);
            //     filterControls.fetchReportOrders();
            // },
        };

        const testData = [];

        for(let i = 0; i < 10; i++) {
            testData.push({
                id: 15342,
                cashOrderNumber: '123',
                orderNumber: 'MRD-1234-1234',

                data: '12.10.2020',
                sum: 100,
                fiscal: 1234567890
            });
        }

        return (
            <div className={Styles.paper}>
                <Table
                    size='middle'
                    className={Styles.table}
                    columns={ this.columns }
                    pagination={ pagination }
                    dataSource={ testData }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    scroll={ { x: 1800, y: '50vh' } }
                    rowKey={ record => record.orderId }
                    bordered
                />
            </div>
        );
    }
}
