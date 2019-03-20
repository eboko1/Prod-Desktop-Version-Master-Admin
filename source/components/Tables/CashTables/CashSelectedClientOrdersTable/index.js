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
        const {
            searching,
            selectedClient,
            clientFilteredOrders,
            searchOrdersResult,
        } = this.props;

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

        return (
            <Table
                size="small"
                columns={this.columns}
                pagination={pagination}
                loading={searching}
                dataSource={
                    this.props.type === "client"
                        ? _.get(selectedClient, "clientOrders.orders", [])
                        : _.get(searchOrdersResult, "orders", [])
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
