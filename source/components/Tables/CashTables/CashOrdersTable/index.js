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
            openPrint: props.openPrint,
            openEdit:  props.openEdit,
            // cashOrderEntity: this.state.cashOrderEntity,
        });
        console.log('→ props.totalCount', props.totalCount);
        this.pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(props.totalCount / 25) * 25,
            hideOnSinglePage: false,
            current:          props.page,
            onChange:         page => {
                props.setCashOrdersFilters({ page });
                props.fetchCashOrders();
            },
        };
    }

    _setCashOrderEntity = cashOrderEntity => this.setState({ cashOrderEntity });

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
