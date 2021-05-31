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
    stats:  selectVehicleOrdersStats(state),
    sort:   selectVehicleOrdersSort(state),
});

const mapDispatchToProps = {
    setPageOrders,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehicleOrdersTable extends React.Component {

    render() {
        const {
            orders,
            stats,
            setPageOrders,
            sort,
            intl: {formatMessage},
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "small",
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
                    pagination={pagination}
                    dataSource={orders}
                    columns={columnsConfig({formatMessage})}
                    scroll={ { x: 1000, y: '30vh' } }
                    // loading={clientOrdersFetching}
                    rowKey={() => v4()}
                    bordered
                />
            </div>
        );
    }
}