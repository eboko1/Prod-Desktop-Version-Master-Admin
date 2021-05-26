//Vendor
import React from 'react';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import { v4 } from 'uuid';

//proj
import {
    selectVehicleOrders,
    selectVehicleOrdersStats,
    selectVehicleOrdersSort,

    setPageOrders,
} from 'core/vehicles/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    orders: selectVehicleOrders(state),
    stats: selectVehicleOrdersStats(state),
    sort: selectVehicleOrdersSort(state),
});

const mapDispatchToProps = {
    setPageOrders,
}

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class VehicleOrdersTable extends React.Component {

    render() {
        const {
            orders,
            stats,
            sort,
            intl: {formatMessage},
            setPageOrders,
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "large",
            total: Math.ceil(stats.countOrders / 25) * 25,
            current: sort.page,
            onChange: page => {
                setPageOrders({page})
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
                    scroll={ { x: 'auto', y: '80vh' } }
                    // loading={clientOrdersFetching}
                    rowKey={() => v4()}
                    bordered
                />
            </div>
        );
    }
}