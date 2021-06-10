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
    sortValues,
    selectVehicleAppurtenances,
    selectVehicleAppurtenancesStats,
    selectVehicleAppurtenancesSort,
    selectVehicleAppurtenancesFetching,

    setPageAppurtenances,
    setAppurtenancesCodeSearchQuery,
    setAppurtenancesBrandSearchQuery,
    setAppurtenancesNameSearchQuery,
    setAppurtenancesSupplierSearchQuery,
    setAppurtenancesSort,

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
    setAppurtenancesCodeSearchQuery,
    setAppurtenancesBrandSearchQuery,
    setAppurtenancesNameSearchQuery,
    setAppurtenancesSupplierSearchQuery,
    setAppurtenancesSort,
}

@withRouter
@injectIntl
@connect( mapStateToProps, mapDispatchToProps)
export default class VehicleAppurtenancesTable extends React.Component {
    constructor(props) {
        super(props);

        const {
            setAppurtenancesCodeSearchQuery,
            setAppurtenancesBrandSearchQuery,
            setAppurtenancesNameSearchQuery,
            setAppurtenancesSupplierSearchQuery,
        } = props;

        /** Search appurtenances by code */
        this.handleCodeSearch = _.debounce(value => {
            setAppurtenancesCodeSearchQuery({codeQuery: value.replace(/[+()]/g,'')});
        }, 1000).bind(this);

        /** Search appurtenances by brand */
        this.handleBrandSearch = _.debounce(value => {
            setAppurtenancesBrandSearchQuery({brandQuery: value.replace(/[+()]/g,'')});
        }, 1000).bind(this);

        /** Search appurtenances by name */
        this.handleNameSearch = _.debounce(value => {
            setAppurtenancesNameSearchQuery({nameQuery: value.replace(/[+()]/g,'')});
        }, 1000).bind(this);

        /** Search appurtenances by supplier */
        this.handleSupplierSearch = _.debounce(value => {
            setAppurtenancesSupplierSearchQuery({supplierQuery: value.replace(/[+()]/g,'')});
        }, 1000).bind(this);
    }

    onAddDetailToOrder = ({detail}) => {
        const { match: {params: {id}}} = this.props;
        this.props.setModal(MODALS.ADD_LABOR_OR_DETAIL_TO_ORDER, {details: [detail], mode: "ADD_DETAIL", vehicleId: id});
    }

    /** Called when table is changed, used to handle sorting */
    handleTableChange = (pagination, filters, sorter) => {
        if (!sorter) return;

        const { setAppurtenancesSort } = this.props;

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
        setAppurtenancesSort(sort);
    };

    render() {
        const {
            appurtenances,
            stats,
            sort,
            setPageAppurtenances,
            fetching,
        } = this.props;

        const columns = columnsConfig({
            onAddDetailToOrder: this.onAddDetailToOrder,
            onCodeSearch: this.handleCodeSearch,
            onBrandSearch: this.handleBrandSearch,
            onNameSearch: this.handleNameSearch,
            onSupplierSearch: this.handleSupplierSearch,
        });

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
                    columns={columns}
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