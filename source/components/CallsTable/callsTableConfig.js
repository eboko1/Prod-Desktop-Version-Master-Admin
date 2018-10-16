// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';
import moment from 'moment';

// proj
import book from 'routes/book';

// // own
// import Styles from './styles.m.css';

export function columnsConfig() {
    const date = {
        title:     <FormattedMessage id='calls-table.date' />,
        width:     200,
        dataIndex: 'date',
        key:       'date',
        render:    date => <div>{ moment(date).format('YYYY-MM-DD HH:mm') }</div>,
    };

    const status = {
        title:     <FormattedMessage id='calls-table.status' />,
        width:     400,
        dataIndex: 'status',
        key:       'status',
        render:    status => <div>{ status } icon</div>,
    };

    const order = {
        title:     <FormattedMessage id='calls-table.order' />,
        dataIndex: 'order',
        key:       'order',
        width:     '150',
        render:    order => <Link to={ `${book.order}/${order}` }>order</Link>,
    };

    const caller = {
        title:     <FormattedMessage id='calls-table.caller' />,
        width:     100,
        dataIndex: 'caller',
        key:       'caller',
        render:    caller => {
            <div>{ caller } phonetoggle</div>;
        },
    };

    const recipient = {
        title:     <FormattedMessage id='calls-table.recipient' />,
        width:     300,
        dataIndex: 'recipient',
        key:       'recipient',
        render:    recipient => <div>{ recipient }</div>,
    };

    const waiting = {
        title:     <FormattedMessage id='calls-table.waiting' />,
        width:     80,
        dataIndex: 'waiting',
        key:       'waiting',
        render:    waiting => <div>{ waiting }</div>,
    };

    const duration = {
        title:     <FormattedMessage id='calls-table.duration' />,
        width:     80,
        dataIndex: 'duration',
        key:       'duration',
        render:    duration => <div>{ duration }</div>,
    };

    const innerRecipient = {
        title:     <FormattedMessage id='calls-table.innerRecipient' />,
        width:     80,
        dataIndex: 'innerRecipient',
        key:       'innerRecipient',
        render:    innerRecipient => <div>{ innerRecipient }</div>,
    };

    const record = {
        title:     <FormattedMessage id='calls-table.record' />,
        dataIndex: 'recordingLink',
        width:     'auto',
        key:       'recordingLink',
        render:    recordingLink =>
            recordingLink ? (
                <audio controls>
                    <source src={ recordingLink } />
                </audio>
            ) : (
                <FormattedMessage id='calls-table.no_record' />
            ),
    };

    return [ date, status, order, caller, recipient, waiting, duration, innerRecipient, record ];
}
