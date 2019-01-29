// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Table } from 'antd';

// proj
import { Loader } from 'commons';

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

export class CashOrdersTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig({
            openPrint: props.openPrint,
            openEdit:  props.openEdit,
            // cashOrderEntity: this.state.cashOrderEntity,
        });
    }

    _setCashOrderEntity = cashOrderEntity => this.setState({ cashOrderEntity });

    render() {
        const { cashOrders, cashOrdersFetching, totalCount } = this.props;

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(this.props.totalCount / 25) * 25,
            hideOnSinglePage: true,
            current:          this.props.filters.page,
            onChange:         page => {
                this.props.setCashOrdersPage({ page });
                this.props.fetchCashOrders();
            },
        };

        return totalCount ? (
            <Table
                size='small'
                className={ Styles.table }
                columns={ this.columns }
                pagination={ pagination }
                dataSource={ cashOrders }
                loading={ cashOrdersFetching }
                locale={ {
                    emptyText: <FormattedMessage id='no_data' />,
                } }
                scroll={ { x: 1000 } }
            />
        ) : (
            <Loader loading={ !totalCount } />
        );
    }
}
