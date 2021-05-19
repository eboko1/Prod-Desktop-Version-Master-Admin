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
} from 'core/vehicles/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    orders: selectVehicleOrders(state),
});

@connect(
    mapStateToProps,
    void 0,
)
@injectIntl
export default class VehicleOrdersTable extends React.Component {

    render() {
        const {
            orders,
            intl: {formatMessage},
        } = this.props;


        return (
            <div className={Styles.tableCont}>
                <Table
                    rowClassName={() => Styles.tableRow}
                    className={Styles.table}
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