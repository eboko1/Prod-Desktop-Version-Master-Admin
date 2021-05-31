//Vendor
import React from 'react';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import {Spin, Table} from 'antd';
import { v4 } from 'uuid';

//proj
import {
    selectVehicleAppurtenancesFetching,
    selectVehicleRecommendations, selectVehicleRecommendationsFetching,
    selectVehicleRecommendationsQuery,
    selectVehicleRecommendationsStats,

    setPageRecommendations,
} from 'core/vehicles/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    recomendations: selectVehicleRecommendations(state),
    stats:          selectVehicleRecommendationsStats(state),
    query:          selectVehicleRecommendationsQuery(state),
    fetching:       selectVehicleRecommendationsFetching(state),
});

const mapDispatchToProps = {
    setPageRecommendations,
}

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehicleRecommendationsTable extends React.Component {

    render() {
        const {
            recomendations,
            stats,
            query,
            setPageRecommendations,
            fetching,
        } = this.props;

        console.log("In props: ", fetching)

        const pagination = {
            pageSize: 25,
            size: "large",
            total: Math.ceil(stats.totalRowsCount / 25) * 25,
            current: query.page,
            onChange: page => {
                setPageRecommendations({page})
            },
        }

        return (
            fetching ? <Spin/> : (
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
                )
        );
    }
}