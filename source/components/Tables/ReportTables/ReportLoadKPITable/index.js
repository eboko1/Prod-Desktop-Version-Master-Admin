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

    render() {
        const {
            filter,
            onPageChange,
            tableData,
            stats,
            isFetching,
        } = this.props;
        let rowKeyCounter = 0;

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(stats.totalRowsCount / 25) * 25,
            hideOnSinglePage: true,
            current:          filter.page,
            onChange:         onPageChange,
        };

        return (
            <div className={Styles.paper}>
                <Table
                    size='middle'
                    className={Styles.table}
                    columns={ columnsConfig() }
                    pagination={ pagination }
                    dataSource={ tableData }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    scroll={ { x: 1800, y: '50vh' } }
                    rowKey={ record =>  rowKeyCounter++}
                    bordered
                    loading={isFetching}
                />
            </div>
        );
    }
}
