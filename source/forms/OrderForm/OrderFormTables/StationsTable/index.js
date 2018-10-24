// vendor
import React, { Component } from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { Catcher } from 'commons';
import { CallStatusIcon } from 'components';

// own
// import Styles from './styles.m.css';

export default class StationsTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     <FormattedMessage id='date' />,
                dateIndex: 'date',
                key:       'order-calls-date',
                width:     '10%',
                render:    (text, record) => (
                    <div style={ { wordBreak: 'normal' } }>
                        { moment(record.date).format('DD.MM.YYYY HH:mm') }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='status' />,
                dataIndex: 'status',
                key:       'order-calls-status',
                width:     '10%',
                render:    status => <CallStatusIcon status={ status } />,
            },
            {
                title:     <FormattedMessage id='order_form_table.calls.caller' />,
                dataIndex: 'caller',
                key:       'order-calls-caller',
                width:     '15%',
                render:    phone => <a href={ `tel:${phone}` }>{ phone }</a>,
            },
            {
                title: (
                    <FormattedMessage id='order_form_table.calls.reciever' />
                ),
                dataIndex: 'recipient',
                key:       'order-calls-reciever',
                width:     '15%',
                render:    phone => <a href={ `tel:${phone}` }>{ phone }</a>,
            },
            {
                title: (
                    <FormattedMessage id='order_form_table.calls.response_time' />
                ),
                dataIndex: 'waiting',
                key:       'order-calls-waiting',
                width:     '15%',
            },
            {
                title: (
                    <FormattedMessage id='order_form_table.calls.talk_time' />
                ),
                dataIndex: 'duration',
                key:       'order-calls-duration',
                width:     '15%',
            },
            {
                title:     <FormattedMessage id='order_form_table.calls.record' />,
                dataIndex: 'recordingLink',
                width:     'auto',
                key:       'order-calls-record',
                render:    recordingLink =>
                    recordingLink ? (
                        <audio controls>
                            <source src={ recordingLink } />
                        </audio>
                    ) : (
                        <FormattedMessage id='order_form_table.calls.no_record' />
                    ),
            },
        ];
    }

    render() {
        const { orderCalls } = this.props;
        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    // className={ Styles.callsTable }
                    dataSource={ orderCalls }
                    columns={ columns }
                    pagination={ false }
                    size='small'
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }
}
