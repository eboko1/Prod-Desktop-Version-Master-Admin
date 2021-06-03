//Vendor
import React from 'react';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { Table} from 'antd';
import { v4 } from 'uuid';

//proj
import { MODALS, setModal } from 'core/modals/duck';
import { AddLaborOrDetailToOrderModal } from 'modals';
import {
    selectVehicleLabors,
    selectVehicleLaborsStats,
    selectVehicleLaborsSort,
    setPageLabors, selectVehicleLaborsFetching,
} from 'core/vehicles/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    labors: selectVehicleLabors(state),
    stats: selectVehicleLaborsStats(state),
    sort: selectVehicleLaborsSort(state),
    fetching: selectVehicleLaborsFetching(state),
});

const mapDispatchToProps = {
    setPageLabors,
    setModal,
}

@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehicleLaborsTable extends React.Component {

    onAddLaborToOrder = ({labor}) => {
        const { match: {params: {id}}} = this.props;
        this.props.setModal(MODALS.ADD_LABOR_OR_DETAIL_TO_ORDER, {labors: [labor], mode: "ADD_LABOR", vehicleId: id});
    }

    render() {
        const {
            labors,
            stats,
            sort,
            setPageLabors,
            fetching
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "large",
            total: Math.ceil(stats.totalRowsCount / 25) * 25,
            current: sort.page,
            onChange: page => {
                setPageLabors({ page })
            },
        }

        console.log("Labors: ", labors);

        return (
            <div className={Styles.tableCont}>
                <Table
                    rowClassName={() => Styles.tableRow}
                    loading={fetching}
                    className={Styles.table}
                    dataSource={labors}
                    pagination={pagination}
                    columns={columnsConfig({onAddLaborToOrder: this.onAddLaborToOrder})}
                    scroll={ { x: 'auto', y: '80vh' } }
                    rowKey={() => v4()}
                    bordered
                />

                <AddLaborOrDetailToOrderModal />
            </div>
        );
    }
}