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
    setPageLabors,
    selectVehicleLaborsFetching,


    setLaborsServiceNameSearchQuery,
    setLaborsDefaultNameSearchQuery,
    setLaborsStoreGroupNameSearchQuery,
    setLaborsEmployeeFullNameSearchQuery,
    setLaborsSort,
    sortValues,
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
    setLaborsServiceNameSearchQuery,
    setLaborsDefaultNameSearchQuery,
    setLaborsStoreGroupNameSearchQuery,
    setLaborsEmployeeFullNameSearchQuery,
    setLaborsSort
}

@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehicleLaborsTable extends React.Component {

    constructor(props) {
        super(props);

        const {
            setLaborsServiceNameSearchQuery,
            setLaborsDefaultNameSearchQuery,
            setLaborsStoreGroupNameSearchQuery,
            setLaborsEmployeeFullNameSearchQuery,
        } = props;

        /** Search labors by service name(найменування) */
        this.handleServiceNameSearch = _.debounce(value => {
            setLaborsServiceNameSearchQuery({serviceNameQuery: value.replace(/[+()]/g,'')})
            // setAppurtenancesCodeSearchQuery({codeQuery: value.replace(/[+()]/g,'')});
        }, 1000).bind(this);

        /** Search labors by  default name (тип)*/
        this.handleDefaultNameSearch = _.debounce(value => {
            setLaborsDefaultNameSearchQuery({defaultNameQuery: value.replace(/[+()]/g,'')});
        }, 1000).bind(this);

        /** Search labors by store group(група товару) */
        this.handleStoreGroupNameSearch = _.debounce(value => {
            setLaborsStoreGroupNameSearchQuery({storeGroupNameQuery: value.replace(/[+()]/g,'')});
        }, 1000).bind(this);

        /** Search labors by employee full name */
        this.handleEmployeeFullNameSearch = _.debounce(value => {
            setLaborsEmployeeFullNameSearchQuery({employeeFullNameQuery: value.replace(/[+()]/g,'')});
        }, 1000).bind(this);
    }


    onAddLaborToOrder = ({labor}) => {
        const { match: {params: {id}}} = this.props;
        this.props.setModal(MODALS.ADD_LABOR_OR_DETAIL_TO_ORDER, {labors: [labor], mode: "ADD_LABOR", vehicleId: id});
    }

    /** Called when labors table is changed, used to handle sorting */
    handleTableChange = (pagination, filters, sorter) => {
        if (!sorter) return;

        const { setLaborsSort } = this.props;

        const sortField = _.get(sorter, 'columnKey', undefined);
        const sortOrder = _.get(sorter, 'order', undefined);

        // make sorting object, if no sorting, make all undefined
        const sort = {
            sortField: sortOrder? sortField: undefined,
            sortOrder: (sortOrder == 'ascend')
                           ? sortValues.asc
                           : (sortOrder == 'descend')
                    ? sortValues.desc
                    : undefined,
        };

        console.log(sort);
        setLaborsSort(sort);
    };

    render() {
        const {
            labors,
            stats,
            sort,
            setPageLabors,
            fetching
        } = this.props;


        const columns = columnsConfig({
            onServiceNameSearch: this.handleServiceNameSearch,
            onDefaultNameSearch: this.handleDefaultNameSearch,
            onStoreGroupNameSearch: this.handleStoreGroupNameSearch,
            onEmployeeFullNameSearch: this.handleEmployeeFullNameSearch,
            onAddLaborToOrder: this.onAddLaborToOrder,
        });


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
                    loading={fetching}
                    columns={columns}
                    className={Styles.table}
                    dataSource={labors}
                    pagination={pagination}
                    // columns={columnsConfig({onAddLaborToOrder: this.onAddLaborToOrder})}
                    scroll={ { x: 'auto', y: '80vh' } }
                    rowKey={() => v4()}
                    onChange={this.handleTableChange}
                    bordered
                />

                <AddLaborOrDetailToOrderModal />
            </div>
        );
    }
}