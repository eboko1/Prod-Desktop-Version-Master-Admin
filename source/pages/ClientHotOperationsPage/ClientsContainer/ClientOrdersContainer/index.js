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
import { setFiltersSearchQuery, setSortPage } from 'core/clientHotOperations/duck';

//Own
import { columnsConfig } from './config';

const mapStateToProps = state => ({
    user: state.auth,
    orders: state.clientHotOperations.clientOrdersData.orders,
    stats: state.clientHotOperations.clientOrdersData.stats,
    clientOrdersFetching: state.clientHotOperations.clientOrdersFetching
});

@connect(
    mapStateToProps,
    void 0,
)
@injectIntl
export default class ClientOrdersContainer extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const {
            orders,
            stats,
            clientOrdersFetching,
            intl: {formatMessage}
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "large",
            total: Math.ceil(stats.countOrders / 25) * 25,
            hideOnSinglePage: true,
        };

        console.log("Orders: ", orders);

        return (
            <div>
                <div>
                    <Table
                        dataSource={orders}
                        columns={columnsConfig({formatMessage})}
                        scroll={ { x: 1000, y: '30vh' } }
                        loading={clientOrdersFetching}
                        pagination={pagination}
                        rowKey={() => v4()}
                        bordered
                    />
                </div>
            </div>
        );
    }
}