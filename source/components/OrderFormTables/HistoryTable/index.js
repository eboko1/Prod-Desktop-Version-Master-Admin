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

// own
// import Styles from './styles.m.css';

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
                width:     '30%',
                render:    (text, record) => (
                    <Link to={ `${book.order}/${record.id}` }>
                        { text }
                        <OrderStatusIcon status={ record.status } />
                    </Link>
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.vehicle' />,
                dataIndex: 'vehicleMakeName',
                key:       'history-vehicle',
                width:     '30%',
                render:    (text, record) => <div>{ text }</div>,
            },
            {
                title:     <FormattedMessage id='order_form_table.order_sum' />,
                dataIndex: 'servicesTotalSum',
                key:       'history-sum',
                width:     '30%',
                render:    (text, record) => (
                    <div>
                        { record.detailsTotalSum + record.servicesTotalSum }
                    </div>
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
