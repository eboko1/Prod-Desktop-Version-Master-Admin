import React, { Component } from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';

import Styles from './styles.m.css';

class OrdersTable extends Component {
    state = {
        loading: false,
    };

    render() {
        const { columns, data, loading, pagination } = this.props;

        return (
            <Table
                className={ Styles.ordersTable }
                columns={ columns }
                dataSource={ data }
                scroll={ { x: 1500 } }
                loading={ loading }
                locale={ {
                    emptyText: <FormattedMessage id='orders-table.no_data' />,
                } }
                pagination={ pagination }
            />
        );
    }
}

export default OrdersTable;
