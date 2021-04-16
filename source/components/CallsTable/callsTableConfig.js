// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Icon, Button } from 'antd';
import moment from 'moment';

// proj
import { answered } from 'core/calls/config';
import book from 'routes/book';
import { StyledButton } from 'commons';

// // own
import Styles from './styles.m.css';

export function columnsConfig(formatMessage, showPhone, phones, fetchRecordingLink, callsLinksCache) {
    const date = {
        title:     <FormattedMessage id='calls-table.date' />,
        width:     95,
        dataIndex: 'datetime',
        key:       'date',
        render:    date => (
            <div className={ Styles.datetime }>
                { moment(date).format('YYYY-MM-DD HH:mm') }
            </div>
        ),
    };

    const status = {
        title:     <FormattedMessage id='calls-table.status' />,
        width:     70,
        dataIndex: 'status',
        key:       'status',
        render:    status => (
            <Icon
                style={ {
                    color: `${
                        answered.includes(status)
                            ? 'var(--secondary)'
                            : 'var(--warning)'
                    }`,
                    fontSize: 24,
                } }
                type={
                    answered.includes(status) ? 'check-circle' : 'close-circle'
                }
                // theme='outlined'
            />
        ),
    };

    const order = {
        title:     <FormattedMessage id='calls-table.order' />,
        dataIndex: 'orderId',
        key:       'orderId',
        width:     80,
        render:    orderId => (
            <Link className={ Styles.orderLink } to={ `${book.order}/${orderId}` }>
                { orderId }
            </Link>
        ),
    };

    const caller = {
        title:     <FormattedMessage id='calls-table.caller' />,
        width:     160,
        dataIndex: 'caller',
        key:       'caller',
        render:    (caller, row, index) =>
            phones.includes(index) ? (
                <a href={ `tel:${caller}` } className={ Styles.orderLink }>
                    { caller }
                </a>
            ) : (
                <Button type='primary' onClick={ () => showPhone(index) }>
                    <FormattedMessage id='show' />
                </Button>
            ),
    };

    const recipient = {
        title:     <FormattedMessage id='calls-table.recipient' />,
        width:     160,
        dataIndex: 'recipient',
        key:       'recipient',
        render:    recipient => (
            <a href={ `tel:${recipient}` } className={ Styles.orderLink }>
                { recipient }
            </a>
        ),
    };

    const waiting = {
        title:     <FormattedMessage id='calls-table.waiting' />,
        width:     140,
        dataIndex: 'waiting',
        key:       'waiting',
        render:    waiting => <div>{ waiting }</div>,
    };

    const duration = {
        title:     <FormattedMessage id='calls-table.duration' />,
        width:     140,
        dataIndex: 'duration',
        key:       'duration',
        render:    duration => <div>{ duration }</div>,
    };

    const innerRecipient = {
        title:     <FormattedMessage id='calls-table.innerRecipient' />,
        width:     140,
        dataIndex: 'innerRecipient',
        key:       'innerRecipient',
        render:    innerRecipient => (
            <a href={ `tel:${innerRecipient}` } className={ Styles.orderLink }>
                { innerRecipient }
            </a>
        ),
    };

    const record = {
        title:     <FormattedMessage id='calls-table.record' />,
        dataIndex: 'recordingLink',
        width:     'auto',
        render:    (val, call) => {
            return String(call.id) in callsLinksCache//Check if that key exists in cash memory
                ?   Boolean(callsLinksCache[call.id]) //False for empty rows(but we key exists)
                    ?   <audio controls>
                            <source src={ callsLinksCache[call.id] } />
                        </audio>
                    :   <FormattedMessage id='calls-table.no_record' />
                :   (<div>
                        <StyledButton onClick={() => fetchRecordingLink({callId: call.id})}>
                            <FormattedMessage id='calls-table.show_record' />
                        </StyledButton>
                    </div>);
        }
    };

    return [
        date,
        status,
        order,
        caller,
        recipient,
        waiting,
        duration,
        innerRecipient,
        record,
    ];
}
