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
    setStoreDocSearchFilters,
    fetchSearchOrder,
    fetchSearchStoreDoc,
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
    setStoreDocSearchFilters,
    fetchSearchOrder,
    fetchSearchStoreDoc,
};

@connect(null, mapDispatchToProps)
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
        this.props.fetchSearchStoreDoc();
    }

    _onRowClick = (row) => {
        if (this.props.type === "order") {
            this.props.selectOrder(row)
        } else if (this.props.type === "storeDoc") {
            this.props.selectStoreDoc(row)
        }
    };

    _setPage = page => {
        if (this.props.type === "client") {
            this.props.setSelectedClientOrdersFilters({ page });
            this.props.fetchSelectedClientOrders();
        }

        if (this.props.type === "order") {
            this.props.setOrderSearchFilters({ page });
            this.props.fetchSearchOrder();
        }

        if (this.props.type === "storeDoc") {
            this.props.setStoreDocSearchFilters({ page });
            this.props.fetchSearchStoreDoc();
        }
    };

    render() {
        const {
            searching,
            selectedClient,
            clientFilteredOrders,
            searchOrdersResult,
            searchStoreDocsResult,
            type,
            intl: {formatMessage},
        } = this.props;

        const columns = columnsConfig({
            formatMessage: formatMessage,
            type: type,
        });

        const pagination = {
            pageSize: 25,
            size: "large",
            total:
                Math.ceil(
                    this.props.type === "client"
                        ? _.get(selectedClient, "clientOrders.count", 1) / 25 :
                    this.props.type === "order"  
                        ? _.get(searchOrdersResult, "count", 1) / 25
                        : _.get(searchStoreDocsResult, "count", 1) / 25,
                ) * 25,
            hideOnSinglePage: true,
            current:
                this.props.type === "client"
                    ? _.get(selectedClient, "filters.page", 1) :
                this.props.type === "order" 
                    ? _.get(searchOrdersResult, "filters.page", 1)
                    : _.get(searchStoreDocsResult, "filters.page", 1),
            onChange: page => this._setPage(page),
        };

        return (
            <Table
                size="small"
                columns={columns}
                pagination={pagination}
                loading={searching}
                dataSource={
                    this.props.type === "client"
                        ? _.get(selectedClient, "clientOrders.orders", [])
                        : this.props.type === "order" 
                        ? _.get(searchOrdersResult, "orders", [])
                        : _.get(searchStoreDocsResult, "storeDocs", [])
                }
                onRow={row => ({
                    onClick: () => this._onRowClick(row),
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
