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
    selectVehicleAppurtenances,
    selectVehicleAppurtenancesStats,
    selectVehicleAppurtenancesSort,
    selectVehicleAppurtenancesFetching,

    setPageAppurtenances,
} from 'core/vehicles/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    appurtenances: selectVehicleAppurtenances(state),
    stats: selectVehicleAppurtenancesStats(state),
    sort: selectVehicleAppurtenancesSort(state),
    fetching: selectVehicleAppurtenancesFetching(state)
});

const mapDispatchToProps = {
    setPageAppurtenances,
    setModal,
}

@withRouter
@injectIntl
@connect( mapStateToProps, mapDispatchToProps)
export default class VehicleAppurtenancesTable extends React.Component {

    onAddDetailToOrder = ({detail}) => {
        const { match: {params: {id}}} = this.props;
        this.props.setModal(MODALS.ADD_LABOR_OR_DETAIL_TO_ORDER, {details: [detail], mode: "ADD_DETAIL", vehicleId: id});
    }

    render() {
        const {
            appurtenances,
            stats,
            sort,
            intl: {formatMessage},
            setPageAppurtenances,
            fetching,
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "large",
            total: Math.ceil(stats.totalRowsCount / 25) * 25,
            current: sort.page,
            onChange: page => {
                setPageAppurtenances({page})
            },
        }

        console.log("Details: ", appurtenances);

        return (
            <div className={Styles.tableCont}>
                <Table
                    rowClassName={() => Styles.tableRow}
                    loading={fetching}
                    className={Styles.table}
                    dataSource={appurtenances}
                    pagination={pagination}
                    columns={columnsConfig({onAddDetailToOrder: this.onAddDetailToOrder})}
                    scroll={ { x: 'auto', y: '80vh' } }
                    rowKey={() => v4()}
                    bordered
                />

                <AddLaborOrDetailToOrderModal />
            </div>
        );
    }
}