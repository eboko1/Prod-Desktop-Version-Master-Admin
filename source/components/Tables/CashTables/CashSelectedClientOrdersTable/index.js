// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Table } from "antd";
import _ from "lodash";

// proj
import {
    setSelectedClientOrdersFilters,
    fetchSelectedClientOrders,
    selectClientOrders,
    selectClientOrdersFilters,
    onOrderSelect,
} from "core/forms/cashOrderForm/duck";

// own
import { columnsConfig } from "./config";
import Styles from "./styles.m.css";

const mapStateToProps = state => {
    return {
        clientOrders: selectClientOrders(state),
        filters: selectClientOrdersFilters(state),
        // orders:       _.get(selectClientOrders(state), 'orders'),
    };
};

const mapDispatchToProps = {
    setSelectedClientOrdersFilters,
    fetchSelectedClientOrders,
    onOrderSelect,
};

@connect(
    mapStateToProps,
    // null,
    mapDispatchToProps,
)
@injectIntl
export class CashSelectedClientOrdersTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig({
            formatMessage: props.intl.formatMessage,
        });
    }

    componentDidMount() {
        this.props.fetchSelectedClientOrders();
    }

    _onRowClick = order => this.props.selectOrder(order);

    render() {
        const {
            clientOrders,

            filters,
            orders,
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "large",
            total: Math.ceil(clientOrders.count / 25) * 25,
            hideOnSinglePage: true,
            current: filters.page,
            onChange: page => {
                this.props.setSelectedClientOrdersFilters({ page });
                this.props.fetchSelectedClientOrders();
            },
        };

        return orders ? (
            <Table
                size="small"
                columns={this.columns}
                pagination={pagination}
                dataSource={orders.filter(
                    ({ remainingSum }) => remainingSum !== 0,
                )}
                onRow={order => ({
                    onClick: () => this._onRowClick(order),
                })}
                rowClassName={() => Styles.linkRow}
                locale={{
                    emptyText: <FormattedMessage id="no_data" />,
                }}
                scroll={{ x: 720 }}
            />
        ) : null;
    }
}
