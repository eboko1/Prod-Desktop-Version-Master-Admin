//Vendor
import React from 'react';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import {Spin, Table} from 'antd';
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

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class VehicleLaborsTable extends React.Component {

    onAddLaborOrDetailToOrder = () => {
        this.props.setModal(MODALS.ADD_LABOR_OR_DETAIL_TO_ORDER);
    }

    render() {
        const {
            labors,
            stats,
            sort,
            intl: {formatMessage},
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
            fetching ? <Spin/> : (
                    <div className={Styles.tableCont}>
                        <button onClick={() => this.onAddLaborOrDetailToOrder()}>Open modal</button>
                        <Table
                            rowClassName={() => Styles.tableRow}
                            className={Styles.table}
                            dataSource={labors}
                            pagination={pagination}
                            columns={columnsConfig({formatMessage})}
                            scroll={ { x: 'auto', y: '80vh' } }
                            rowKey={() => v4()}
                            bordered
                        />

                        <AddLaborOrDetailToOrderModal />
                    </div>
                )
        );
    }
}