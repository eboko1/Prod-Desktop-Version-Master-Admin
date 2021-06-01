//Vendor
import React from 'react';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import { v4 } from 'uuid';

//proj
import {
    selectOrders,
    selectOrdersStats,
    selectOrdersQuery,

    setOrdersPage,
    setSelectedOrderId,
} from '../../redux/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    orders: selectOrders(state),
    stats: selectOrdersStats(state),
    query: selectOrdersQuery(state),
});

const mapDispatchToProps = {
    setOrdersPage,
    setSelectedOrderId,
}

@connect( mapStateToProps, mapDispatchToProps)
@injectIntl
export default class VehicleOrdersTable extends React.Component {

    render() {
        const {
            orders,
            stats,
            query,
            intl: {formatMessage},
            setOrdersPage,
            setSelectedOrderId,
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "small",
            total: Math.ceil(stats.countOrders / 25) * 25,
            current: query.page,
            onChange: page => {
                setOrdersPage({page})
            },
        }

        return (
            <div className={Styles.tableCont}>
                <Table
                    rowClassName={() => Styles.tableRow}
                    className={Styles.table}
                    dataSource={orders}
                    columns={columnsConfig({formatMessage})}
                    pagination={pagination}
                    scroll={ { x: 'auto', y: '30vh' } }
                    rowSelection={{
                        onSelect: (record) => {
                            setSelectedOrderId({orderId: record.id});
                        }
                    }}
                    // loading={clientOrdersFetching}
                    rowKey={() => v4()}
                    bordered
                />
            </div>
        );
    }
}