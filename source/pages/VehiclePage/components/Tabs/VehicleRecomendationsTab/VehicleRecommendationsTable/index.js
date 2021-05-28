//Vendor
import React from 'react';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import { v4 } from 'uuid';

//proj
import {
    selectVehicleRecommendations,

    // setPageAppurtenances
} from 'core/vehicles/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    recomendations: selectVehicleRecommendations(state),
});

const mapDispatchToProps = {
    // setPageAppurtenances,
}

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehicleAppurtenancesTable extends React.Component {

    render() {
        const {
            recomendations,
            // stats,
            // sort,
            // intl: {formatMessage},
            // setPageAppurtenances,
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "large",
            // total: Math.ceil(stats.totalRowsCount / 25) * 25,
            // current: sort.page,
            // onChange: page => {
            //     setPageAppurtenances({page})
            // },
        }

        return (
            <div className={Styles.tableCont}>
                <Table
                    rowClassName={() => Styles.tableRow}
                    className={Styles.table}
                    dataSource={recomendations}
                    pagination={pagination}
                    columns={columnsConfig()}
                    scroll={ { x: 'auto', y: '80vh' } }
                    rowKey={() => v4()}
                    bordered
                />
            </div>
        );
    }
}