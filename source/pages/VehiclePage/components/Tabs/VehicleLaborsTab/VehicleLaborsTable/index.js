//Vendor
import React from 'react';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import { v4 } from 'uuid';

//proj
import {
    selectVehicleLabors,
    selectVehicleLaborsStats,
    selectVehicleLaborsSort,
    setPageLabors,
} from 'core/vehicles/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    labors: selectVehicleLabors(state),
    stats: selectVehicleLaborsStats(state),
    sort: selectVehicleLaborsSort(state)
});

const mapDispatchToProps = {
    setPageLabors,
}

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class VehicleLaborsTable extends React.Component {

    render() {
        const {
            labors,
            stats,
            sort,
            intl: {formatMessage},
            setPageLabors,
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

        return (
            <div className={Styles.tableCont}>
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
            </div>
        );
    }
}