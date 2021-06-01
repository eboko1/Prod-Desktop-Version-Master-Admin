//Vendor
import React from 'react';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import {Spin, Table} from 'antd';
import { v4 } from 'uuid';

//proj
import {
    selectVehicleAppurtenances,
    selectVehicleAppurtenancesStats,
    selectVehicleAppurtenancesSort,

    setPageAppurtenances, selectVehicleLaborsFetching, selectVehicleAppurtenancesFetching
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
}

@connect(
    mapStateToProps,
    mapDispatchToProps
)
@injectIntl
export default class VehicleAppurtenancesTable extends React.Component {

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
            fetching ? <Spin/> : (
                    <div className={Styles.tableCont}>
                        <Table
                            rowClassName={() => Styles.tableRow}
                            className={Styles.table}
                            dataSource={appurtenances}
                            pagination={pagination}
                            columns={columnsConfig({formatMessage})}
                            scroll={ { x: 'auto', y: '80vh' } }
                            rowKey={() => v4()}
                            bordered
                        />
                    </div>
                )
        );
    }
}