//Vendor
import React from 'react';
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, Input } from 'antd';
import { v4 } from 'uuid';

//proj
import {
    selectOrders,
    selectOrdersStats,
    selectOrdersQuery,
    selectSelectedOrderId,
    selectOrdersFetching,

    setOrdersPage,
    setSelectedOrderId,
    setOrdersSearchQuery,
} from '../../redux/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    orders: selectOrders(state),
    stats: selectOrdersStats(state),
    query: selectOrdersQuery(state),
    selectedOrderId: selectSelectedOrderId(state),
    ordersFetching: selectOrdersFetching(state),
});

const mapDispatchToProps = {
    setOrdersPage,
    setSelectedOrderId,
    setOrdersSearchQuery,
}

@injectIntl
@connect( mapStateToProps, mapDispatchToProps)
export default class VehicleOrdersTable extends React.Component {
    constructor(props) {
        super(props);

        this.handleSearch = _.debounce(value => {
            this.props.setOrdersSearchQuery({query: value.replace(/[+()]/g,'')});
        }, 1000).bind(this);
    }

    onSearch = e => {
        const value = e.target.value;
        this.handleSearch(value);
    }

    render() {
        const {
            orders,
            stats,
            query,
            intl: {formatMessage},
            setOrdersPage,
            setSelectedOrderId,
            selectedOrderId,
            ordersFetching,
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "small",
            total: Math.ceil(stats.countOrders / 25) * 25,
            current: query.page,
            onChange: page => {
                setOrdersPage({page})
            },
        }

        return (
            <div className={Styles.tableCont}>
                <div className={Styles.filtersCont}>
                    <div className={Styles.textCont}><FormattedMessage id={"client_hot_operations_page.search"} />: </div>
                    <div className={Styles.inputCont}><Input onChange={this.onSearch} allowClear/></div>
                </div>

                <Table
                    className={Styles.table}
                    dataSource={orders}
                    columns={columnsConfig({formatMessage})}
                    pagination={pagination}
                    scroll={ { x: 'auto', y: '30vh' } }
                    rowClassName={(order)=>{
                        return (order.id == selectedOrderId) ? Styles.selectedRow: Styles.tableRow
                    }}
                    onRow={(order) => {
                        return {
                            onClick: (event) => setSelectedOrderId({orderId: order.id})
                        };
                    }}
                    loading={ordersFetching}
                    rowKey={() => v4()}
                />
            </div>
        );
    }
}