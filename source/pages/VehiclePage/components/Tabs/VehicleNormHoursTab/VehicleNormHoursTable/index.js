//Vendor
import React from 'react';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import { v4 } from 'uuid';

//proj
import {
    // TODO get selectors
    // selectVehicleLabors,
    // selectVehicleLaborsStats,
    selectVehicleNormHours,
    selectVehicleNormHoursStats,
} from 'core/vehicles/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    normHours: selectVehicleNormHours(state),
});

@connect(
    mapStateToProps,
    void 0,
)
@injectIntl
export default class VehicleNormHoursTable extends React.Component {

    render() {
        const {
            normHours,
            intl: {formatMessage},
        } = this.props;


        return (
            <div className={Styles.tableCont}>
                <Table
                    rowClassName={() => Styles.tableRow}
                    className={Styles.table}
                    dataSource={normHours}
                    columns={columnsConfig({formatMessage})}
                    scroll={ { x: 'auto', y: '80vh' } }
                    rowKey={() => v4()}
                    bordered
                />
            </div>
        );
    }
}