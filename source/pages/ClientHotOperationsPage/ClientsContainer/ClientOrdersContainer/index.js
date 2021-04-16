/*
Container used to show clients and perform basic search of them.
*/
//Vendor
import React from 'react';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import { v4 } from 'uuid';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    orders: state.clientHotOperations.clientOrdersData.orders,
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
            clientOrdersFetching,
            intl: {formatMessage}
        } = this.props;

        return (
            <div className={Styles.tableCont}>
                <Table
                    rowClassName={() => Styles.tableRow}
                    className={Styles.table}
                    dataSource={orders}
                    columns={columnsConfig({formatMessage})}
                    scroll={ { x: 1000, y: '30vh' } }
                    loading={clientOrdersFetching}
                    rowKey={() => v4()}
                    bordered
                />
            </div>
        );
    }
}