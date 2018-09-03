// vendor
import React, { Component } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { Catcher } from 'commons';
import { OrderStatusIcon } from 'components';
import book from 'routes/book';

class HistoryTable extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title:     <FormattedMessage id='date' />,
                dateIndex: 'datetime',
                key:       'history-date',
                width:     '10%',
                render:    (text, record) => (
                    <div style={ { wordBreak: 'normal' } }>
                        { moment(record.datetime).format('DD.MM.YYYY HH:mm') }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='order' />,
                dataIndex: 'num',
                key:       'history-num',
                width:     '15%',
                render:    (text, record) => (
                    <Link
                        to={ `${book.order}/${record.id}` }
                        onClick={ () => {
                            props.fetchOrderForm(record.id);
                            props.fetchOrderTask(record.id);
                        } }
                    >
                        { text }
                        <OrderStatusIcon status={ record.status } />
                    </Link>
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.vehicle' />,
                dataIndex: 'vehicleMakeName',
                key:       'history-vehicle',
                width:     '20%',
                render:    text => <div>{ text }</div>,
            },
            {
                title:     <FormattedMessage id='order_form_table.order_sum' />,
                dataIndex: 'servicesTotalSum',
                key:       'history-sum',
                width:     '15%',
                render:    (text, record) => (
                    <div>
                        { record.detailsTotalSum + record.servicesTotalSum }
                    </div>
                ),
            },
            {
                title: (
                    <FormattedMessage id='order_form_table.recommendation' />
                ),
                dataIndex: 'servicesTotalSum',
                key:       'history-recommendation',
                width:     '20%',
                render:    (text, record) => <div>{ record.recommendation }</div>,
            },
            {
                title:     <FormattedMessage id='order_form_table.cancel_reason' />,
                dataIndex: 'servicesTotalSum',
                key:       'history-cancel-reason',
                width:     '20%',
                render:    (text, record) => (
                    <div>{ record.cancelStatusReason }</div>
                ),
            },
        ];
    }

    render() {
        const { orderHistory } = this.props;
        const columns = this.columns;
        const dataSource = orderHistory.orders;

        return (
            <Catcher>
                <Table
                    dataSource={ dataSource }
                    columns={ columns }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }
}

export default HistoryTable;
