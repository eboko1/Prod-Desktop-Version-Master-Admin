/*
Container used to show clients and perform basic search of them.
*/
//Vendor
import React from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, Input } from 'antd';
import { v4 } from 'uuid';

//Proj
import {
    fetchVehicles,
    selectVehicles,
    selectVehiclesStats,
    selectSort,
    setPage,
} from 'core/vehicles/duck';


//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user:                state.auth,
    vehicles:            selectVehicles(state),
    stats:               selectVehiclesStats(state),
    sort:                selectSort(state),
    // clients:             state.clientHotOperations.clients,
    // stats:               state.clientHotOperations.stats,
    // clientsFetching:     state.clientHotOperations.clientsFetching,
    // sort:                state.clientHotOperations.sort,
    // expandedClientRow:   state.clientHotOperations.expandedClientRow,
    // searchQuery:         state.clientHotOperations.filters.query
});

const mapDispatchToProps = {
    fetchVehicles,
    setPage
}

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class VehiclesTable extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.props.fetchVehicles();
    }

    render() {
        const {
            clients,
            stats,
            setPage,
            clientsFetching,
            sort,
            setSortPage,
            fetchClientOrders,
            setClientRowKey,
            expandedClientRow,
            user,
            vehicles
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
                {/* <div className={Styles.filtersCont}>
                    <div className={Styles.textCont}><FormattedMessage id={"client_hot_operations_page.search"} />: </div>
                    <div className={Styles.inputCont}><Input defaultValue={this.initialSearchQuery} onChange={this.onSearch} allowClear/></div>
                    
                </div> */}
                
                <div>
                    <Table
                        className={Styles.table}
                        // dataSource={clients}
                        dataSource={vehicles}
                        columns={columnsConfig({user})}
                        scroll={ { x: 1000, y: '70vh' } }
                        // loading={clientsFetching}
                        pagination={pagination}
                        rowKey={() => v4()}
                        // expandedRowKeys={[expandedClientRow]} //Only one row can be expanded at the time
                        // expandedRowRender={() => (<ClientOrdersContainer />)}
                        // onExpand={(expanded, client) => {
                        //     expanded && fetchClientOrders({clientId: client.clientId})
                        //     expanded && setClientRowKey(`${client.clientId}`)
                        //     !expanded && setClientRowKey("")
                        // }}
                        bordered
                    />
                </div>
            </div>
        );
    }
}