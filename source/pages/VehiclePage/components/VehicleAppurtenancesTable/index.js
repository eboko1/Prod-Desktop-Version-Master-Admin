//Vendor
import React from 'react';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import { v4 } from 'uuid';

//proj
import {
    selectVehicleAppurtenances,
} from 'core/vehicles/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    appurtenances: selectVehicleAppurtenances(state),
});

@connect(
    mapStateToProps,
    void 0,
)
@injectIntl
export default class VehicleAppurtenancesTable extends React.Component {

    render() {
        const {
            appurtenances,
            intl: {formatMessage},
        } = this.props;

        console.log("appurtenances: ", appurtenances);


        return (
            <div className={Styles.tableCont}>
                <Table
                    rowClassName={() => Styles.tableRow}
                    className={Styles.table}
                    dataSource={appurtenances}
                    columns={columnsConfig({formatMessage})}
                    scroll={ { x: 'auto', y: '80vh' } }
                    rowKey={() => v4()}
                    bordered
                />
            </div>
        );
    }
}