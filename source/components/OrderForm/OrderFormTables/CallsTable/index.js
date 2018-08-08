// vendor
import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { Catcher } from 'commons';
import { CallStatusIcon } from 'components';

class CallsTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     'Дата',
                dateIndex: 'date',
                key:       'order-calls-date',
                width:     '10%',
                render:    (text, record) => (
                    <div style={ { wordBreak: 'normal' } }>
                        { moment(record.datetime).format('DD.MM.YYYY HH:mm') }
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
                dataIndex: 'record',
                width:     '15%',
                key:       'order-calls-record',
                render:    (text, record) => {
                    <div>
                        <Icon type='play-circle-o' />
                        <Icon type='download' />
                    </div>;
                },
            },
        ];
    }

    render() {
        const { orderCalls } = this.props;
        const columns = this.columns;

        return (
            <Catcher>
                <Table
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

export default CallsTable;
