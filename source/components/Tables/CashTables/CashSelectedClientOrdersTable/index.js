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
    // selectClientFilteredOrders,
    setOrderSearchFilters,
    fetchSearchOrder,
    onOrderSelect,
} from "core/forms/cashOrderForm/duck";
import { Loader } from "commons";

// own
import { columnsConfig } from "./config";
import Styles from "./styles.m.css";

const mapDispatchToProps = {
    setSelectedClientOrdersFilters,
    fetchSelectedClientOrders,
    onOrderSelect,
    setOrderSearchFilters,
    fetchSearchOrder,
};

@connect(
    null,
    mapDispatchToProps,
)
@injectIntl
export class CashSelectedClientOrdersTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig({
            formatMessage: props.intl.formatMessage,
        });

        //    this.pagination = {
        //        pageSize: 25,
        //        size: "large",
        //        total: Math.ceil(_.get(props, "clientOrders.count", 0) / 25) * 25,
        //        hideOnSinglePage: true,
        //        current: _.get(props, "filters.page", 1),
        //        onChange: page => {
        //            this.props.setSelectedClientOrdersFilters({ page });
        //            this.props.fetchSelectedClientOrders();
        //        },
        //    };
    }

    componentDidMount() {
        this.props.fetchSelectedClientOrders();
    }

    _onRowClick = order => this.props.selectOrder(order);

    _setPage = page => {
        if (this.props.type === "client") {
            this.props.setSelectedClientOrdersFilters({ page });
            this.props.fetchSelectedClientOrders();
        }

        if (this.props.type === "order") {
            this.props.setOrderSearchFilters({ page });
            this.props.fetchSearchOrder();
        }
    };

    render() {
        // const { clientOrders, filters, orders } = this.props;
        const {
            searching,
            selectedClient,
            clientFilteredOrders,
            searchOrdersResult,
        } = this.props;
        // console.log("→ this.props.selectedClient", this.props.selectedClient);
        // console.log("→ searchOrdersResult", searchOrdersResult);
        // console.log("→ orders", orders);
        // console.log("→ filters", filters);
        // console.log("→ filteredOrders", filteredOrders);
        // console.log("→ this.props.type", this.props.type);
        console.log(
            "→ _.get(selectedClient",
            _.get(selectedClient, "clientOrders.count"),
        );
        console.log("→ searchOrdersResult", _.get(searchOrdersResult, "count"));
        console.log(
            "→ searchOrdersResult",
            _.get(searchOrdersResult, "filters.page"),
        );

        const pagination = {
            pageSize: 25,
            size: "large",
            total:
                Math.ceil(
                    this.props.type === "client"
                        ? _.get(selectedClient, "clientOrders.count", 1) / 25
                        : _.get(searchOrdersResult, "count", 1) / 25,
                ) * 25,
            hideOnSinglePage: true,
            current:
                this.props.type === "client"
                    ? _.get(selectedClient, "filters.page", 1)
                    : _.get(searchOrdersResult, "filters.page", 1),
            onChange: page => this._setPage(page),
        };
        //  console.log("→ filteredOrders", clientFilteredOrders);
        //    console.log("→ searchOrdersResult", searchOrdersResult);
        return (
            <Table
                size="small"
                columns={this.columns}
                pagination={pagination}
                loading={searching}
                dataSource={
                    this.props.type === "client"
                        ? clientFilteredOrders
                        : searchOrdersResult.orders
                }
                onRow={order => ({
                    onClick: () => this._onRowClick(order),
                })}
                rowClassName={() => Styles.linkRow}
                locale={{
                    emptyText: <FormattedMessage id="no_data" />,
                }}
                scroll={{ x: 720 }}
            />
        );
    }
}
