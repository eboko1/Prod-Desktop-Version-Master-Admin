// vendor
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { injectIntl, FormattedMessage } from "react-intl";
import { Table } from "antd";
import moment from "moment";
import { v4 } from "uuid";

// proj
import { Catcher, Numeral } from "commons";
import { OrderStatusIcon } from "components";
import book from "routes/book";
import { permissions, isForbidden } from "utils";

@injectIntl
export default class HistoryTable extends Component {
    constructor(props) {
        super(props);

        const viewTasks = !isForbidden(props.user, permissions.GET_TASKS);

        this.columns = [
            {
                title: <FormattedMessage id="date" />,
                dateIndex: "datetime",
                key: "history-date",
                width: "auto",
                render: (text, record) => (
                    <div style={{ wordBreak: "normal" }}>
                        {record.beginDatetime
                            ? moment(record.beginDatetime).format(
                                  "DD.MM.YYYY HH:mm",
                              )
                            : null}
                    </div>
                ),
            },
            {
                title: <FormattedMessage id="order" />,
                dataIndex: "num",
                key: "history-num",
                width: "auto",
                render: (text, record) => (
                    <>
                        <Link
                            to={`${book.order}/${record.id}`}
                            // onClick={() => {
                            //     props.fetchOrderForm(record.id);
                            //     if (viewTasks) {
                            //         props.fetchOrderTask(record.id);
                            //     }
                            // }}
                        >
                            {text}
                            <OrderStatusIcon status={record.status} />
                        </Link>
                        <div>
                            {record.serviceNames
                                .map(serviceName => serviceName)
                                .join(", ")}
                        </div>
                    </>
                ),
            },
            {
                title: <FormattedMessage id="order_form_table.vehicle" />,
                dataIndex: "vehicleMakeName",
                key: "history-vehicle",
                width: "auto",
                render: text => <div>{text}</div>,
            },
            {
                title: <FormattedMessage id="orders.sum_without_VAT" />,
                // dataIndex: 'servicesTotalSum',
                key: "history-sum",
                width: "auto",
                render: (text, record) => (
                    <Numeral
                        currency={this.props.intl.formatMessage({
                            id: "currency",
                        })}
                    >
                        {record.detailsTotalSum + record.servicesTotalSum}
                    </Numeral>
                ),
            },
        ];
    }

    shouldComponentUpdate(nextProps) {
        return this.props.orderHistory !== nextProps.orderHistory;
    }

    render() {
        const { orderHistory, isMobile } = this.props;
        const columns = !isMobile ? this.columns : this.columns.filter(({key})=>key!="history-vehicle");
        const dataSource = orderHistory.orders;

        return (
            <Catcher>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    locale={{
                        emptyText: <FormattedMessage id="no_data" />,
                    }}
                    rowKey={record => {
                        return v4();
                    }}
                />
            </Catcher>
        );
    }
}
