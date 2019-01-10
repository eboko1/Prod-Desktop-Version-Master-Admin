// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Table } from 'antd';

// own
import { columnsConfig } from './config';

export class CashOrdersTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig({
            // deleteCashbox: props.deleteCashbox,
            // formatMessage: props.intl.formatMessage,
        });

        this.pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(props.totalCount / 25) * 25,
            hideOnSinglePage: true,
            current:          props.page,
            onChange:         page => {
                props.setCashOrdersFilters({ page });
                props.fetchCashOrders();
            },
        };
    }

    render() {
        const { cashOrders, cashOrdersFetching } = this.props;

        return (
            <Table
                size='small'
                columns={ this.columns }
                pagination={ this.pagination }
                dataSource={ cashOrders }
                loading={ cashOrdersFetching }
                locale={ {
                    emptyText: <FormattedMessage id='no_data' />,
                } }
                scroll={ { x: 1000 } }
            />
        );
    }
}
