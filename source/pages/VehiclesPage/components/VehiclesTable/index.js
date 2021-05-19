//Vendor
import React from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, Input } from 'antd';
import { v4 } from 'uuid';

//Proj
import VehicleOrdersTable from '../VehicleOrdersTable';
import {
    fetchVehicles,

    selectVehicles,
    selectVehiclesStats,
    selectExpandedVehicleId,
    selectSort,

    setPage,
    setSearchQuery,
    setExpandedVehicleId,
} from 'core/vehicles/duck';


//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user:                 state.auth,
    vehicles:             selectVehicles(state),
    stats:                selectVehiclesStats(state),
    sort:                 selectSort(state),
    expandedVehicleId:    selectExpandedVehicleId(state),
});

const mapDispatchToProps = {
    fetchVehicles,
    setPage,
    setSearchQuery,
    setExpandedVehicleId
}

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class VehiclesTable extends React.Component {
    constructor(props) {
        super(props);

        this.handleSearch = _.debounce(value => {
            this.props.setSearchQuery({
                query: _.toLower(value.replace(/[+()]/g,''))
            });
        }, 1000).bind(this);

    }

    onSearch = e => {
        const value = e.target.value;
        this.handleSearch(value);
    }

    componentDidMount() {
        this.props.fetchVehicles();
    }

    render() {
        const {
            stats,
            setPage,
            sort,
            expandedVehicleId,
            user,
            vehicles,
            setExpandedVehicleId
        } = this.props;

        console.log("Vehicles: ", vehicles);
        console.log("Stats: ", stats);

        const pagination = {
            pageSize: 25,
            size: "large",
            total: Math.ceil(stats.totalRowsCount / 25) * 25,
            tital: 100,
            current: sort.page,
            onChange: page => {
                setPage({page});
            },
        };

        return (
            <div>
                <div className={Styles.filtersCont}>
                    <div className={Styles.textCont}>Search: </div>
                    <div className={Styles.inputCont}><Input onChange={this.onSearch} allowClear/></div>
                    
                </div>
                
                <div>
                    <Table
                        className={Styles.table}
                        // dataSource={clients}
                        dataSource={vehicles}
                        columns={columnsConfig({user})}
                        scroll={ { x: 1000, y: '70vh' } }
                        // loading={clientsFetching}
                        pagination={pagination}
                        rowKey={vehicle => vehicle.clientVehicleId}
                        expandedRowKeys={[expandedVehicleId]} //Only one row can be expanded at the time
                        expandedRowRender={() => (<VehicleOrdersTable />)}
                        onExpand={(expanded, vehicle) => {
                            console.log("Expanding: ", vehicle.clientVehicleId, expanded);
                            setExpandedVehicleId({
                                vehicleId: expanded ? vehicle.clientVehicleId: undefined
                            })
                        }}
                        bordered
                    />
                </div>
            </div>
        );
    }
}