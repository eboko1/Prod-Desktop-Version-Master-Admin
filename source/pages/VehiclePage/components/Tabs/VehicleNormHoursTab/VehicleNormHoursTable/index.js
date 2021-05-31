//Vendor
import React from 'react';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Table, Spin } from 'antd';
import { v4 } from 'uuid';

//proj
import {
    selectVehicleNormHours,
    selectVehicleNormHoursStats,
    selectVehicleNormHoursSort,

    setPageNormHours, selectVehicleNormHoursFetching,
} from 'core/vehicles/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    normHours: selectVehicleNormHours(state),
    stats: selectVehicleNormHoursStats(state),
    sort: selectVehicleNormHoursSort(state),
    fetching: selectVehicleNormHoursFetching(state)
});

const mapDispatchToProps = {
    setPageNormHours,
}

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class VehicleNormHoursTable extends React.Component {

    render() {
        const {
            normHours,
            stats,
            sort,
            intl: {formatMessage},
            setPageNormHours,
            fetching
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "large",
            total: Math.ceil(stats.totalRowsCount / 25) * 25,
            current: sort.page,
            onChange: page => {
                setPageNormHours({page})
            },
        }

        return (

            fetching ? <Spin/> :
                         (<div className={Styles.tableCont}>
                             <Table
                                 rowClassName={() => Styles.tableRow}
                                 className={Styles.table}
                                 dataSource={normHours}
                                 pagination={pagination}
                                 columns={columnsConfig({formatMessage})}
                                 scroll={{x: 'auto', y: '80vh'}}
                                 rowKey={() => v4()}
                                 bordered
                             />
                         </div>)

        );
    }
}