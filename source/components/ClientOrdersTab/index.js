// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { Table, Rate } from "antd";

// proj
import {
    fetchClientOrders,
    setClientOrdersPageFilter,
} from "core/clientOrders/duck";

import { Numeral, Loader } from "commons";
import { FormattedDatetime, OrderStatusIcon } from "components";

// own
import book from "routes/book";
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    isFetching: state.ui.clientOrdersFetching,
    ordersData: state.clientOrders.ordersData,
    filter: state.clientOrders.filter,
});

const mapDispatchToProps = {
    fetchClientOrders,
    setClientOrdersPageFilter,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class ClientOrdersTab extends Component {
    constructor(props) {
        super(props);
        const { formatMessage } = this.props.intl;

        this.columns = [
            {
                title: <FormattedMessage id="client_order_tab.date" />,
                dataIndex: "beginDatetime",
                width: "20%",
                render: record => <FormattedDatetime datetime={record} />,
            },
            {
                title: <FormattedMessage id="client_order_tab.order" />,
                width: "20%",
                render: order => (
                    <>
                        <Link
                            className={Styles.ordernLink}
                            to={`${book.order}/${order.id}`}
                        >
                            {order.num}
                        </Link>
                        <OrderStatusIcon status={order.status} />
                        {order.serviceNames && (
                            <div className={Styles.serviceNames}>
                                {[...new Set(order.serviceNames)].join(", ")}
                            </div>
                        )}
                        {order.recommendation && (
                            <div className={Styles.recommendation}>
                                {order.recommendation}
                            </div>
                        )}
                        {(order.cancelReason ||
                            order.cancelStatusReason ||
                            order.cancelStatusOwnReason) && (
                            <div className={Styles.cancelReason}>
                                {/* <div>{ order.cancelReason }</div> */}
                                <div>{order.cancelStatusReason}</div>
                                <div>{order.cancelStatusOwnReason}</div>
                            </div>
                        )}
                    </>
                ),
            },
            {
                title: <FormattedMessage id="client_order_tab.car" />,
                width: "20%",
                render: order => (
                    <>
                        {order.vehicleNumber && (
                            <>
                                <span>{order.vehicleNumber}</span>
                                <br />
                            </>
                        )}
                        <div className={Styles.clientVehicle}>
                            {`${order.vehicleMakeName ||
                                "-"} ${order.vehicleModelName ||
                                "-"} ${order.vehicleYear || "-"}`}
                        </div>
                    </>
                ),
            },
            {
                title: <FormattedMessage id="client_order_tab.amount" />,
                width: "10%",
                render: order => (
                    <Numeral
                        currency={formatMessage({ id: "currency" })}
                        nullText="0"
                    >
                        {order.servicesTotalSum + order.detailsTotalSum}
                    </Numeral>
                ),
            },
            {
                title: <FormattedMessage id="client_order_tab.raiting" />,
                dataIndex: "nps",
                width: "20%",
                render: record => this._renderRatingStars(record),
            },
        ];
    }

    componentDidMount() {
        const { clientId, filter } = this.props;
        this.props.fetchClientOrders({ clientId, filter });
    }

    _renderRatingStars = rating => {
        const value = rating / 2;
        const ratingStarts = (
            <Rate
                className={Styles.ratingStars}
                allowHalf
                disabled
                defaultValue={value}
            />
        );

        return ratingStarts;
    };

    render() {
        const {
            isFetching,
            ordersData: { stats, orders, count, statusStats },
        } = this.props;
        if (isFetching || !orders) {
            return <Loader loading={isFetching} />;
        }

        const { clientId, filter } = this.props;

        const ordersRows = orders.map((item, index) => ({
            ...item,
            index,
            key: item.id,
        }));

        const pagination = {
            pageSize: 25,
            size: "large",
            total: Math.ceil(stats.countOrders / 25) * 25,
            hideOnSinglePage: true,
            current: filter.page,
            onChange: page => {
                this.props.setClientOrdersPageFilter(page);
                this.props.fetchClientOrders({ clientId, filter });
            },
        };

        return (
            <>
                <div className={Styles.countsContainer}>
                    <h2 className={Styles.title}>
                        <FormattedMessage id="client_order_tab.count_of_orders" />
                        <span className={Styles.countNumber}>{count}</span>
                    </h2>
                    <h2 className={Styles.title}>
                        <FormattedMessage id="client_order_tab.completed_orders" />
                        <span className={Styles.countNumber}>
                            {statusStats.success}
                        </span>
                    </h2>
                </div>

                <Table
                    pagination={pagination}
                    size="small"
                    dataSource={ordersRows}
                    columns={this.columns}
                />
            </>
        );
    }
}
