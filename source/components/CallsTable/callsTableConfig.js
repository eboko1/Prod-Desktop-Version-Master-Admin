// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import moment from 'moment';
import { v4 } from 'uuid';

// proj
import { answered } from 'core/calls/config';
import { StyledButton } from 'commons';
import book from 'routes/book';

// // own
import Styles from './styles.m.css';

const defWidth = {
    date: '10%',
    status: '5%',
    order: '10%',
    caller: '10%',
    recipient: '10%',
    client: 'auto',
    waiting: '5%',
    duration: '5%',
    innerRecipient: '5%',
    record: '20%',
};

export function columnsConfig({fetchRecordingLink, callsLinksCache}) {
    const date = {
        title:     <FormattedMessage id='calls-table.date' />,
        width:     defWidth.date,
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
        width:     defWidth.status,
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
            />
        ),
    };

    const caller = {
        title:     <FormattedMessage id='calls-table.caller' />,
        width:     defWidth.caller,
        dataIndex: 'caller',
        key:       'caller',
        render:    (caller) =>
            (
                <a href={ `tel:${caller}` } className={ Styles.orderLink }>
                    { caller }
                </a>
            ),
    };

    const recipient = {
        title:     <FormattedMessage id='calls-table.recipient' />,
        width:     defWidth.recipient,
        dataIndex: 'recipient',
        key:       'recipient',
        render:    recipient => (
            <a href={ `tel:${recipient}` } className={ Styles.orderLink }>
                { recipient }
            </a>
        ),
    };

    const client = {
        title:     <FormattedMessage id='calls-table.client' />,
        width:     defWidth.client,
        dataIndex: 'clients',
        key:       'clients',
        render:    clients => {
            if(!clients) return "";
            
            return clients.map((client) => {
                return (
                    <div className={ Styles.client } key={v4()}>
                        <Link
                            to={{
                                pathname: `${book.client}/${client.clientId}`,
                            }}
                        >
                            {client.fullName}
                        </Link>
                    </div>
                )
            });
        },
    };

    const waiting = {
        title:     <FormattedMessage id='calls-table.waiting' />,
        width:     defWidth.waiting,
        dataIndex: 'waiting',
        key:       'waiting',
        render:    waiting => <div>{ waiting }</div>,
    };

    const duration = {
        title:     <FormattedMessage id='calls-table.duration' />,
        width:     defWidth.duration,
        dataIndex: 'duration',
        key:       'duration',
        render:    duration => <div>{ duration }</div>,
    };

    const innerRecipient = {
        title:     <FormattedMessage id='calls-table.innerRecipient' />,
        width:     defWidth.innerRecipient,
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
        width:     defWidth.record,
        dataIndex: 'recordingLink',
        render:    (val, call) => {
            return String(call.id) in callsLinksCache//Check if that key exists in cash memory
                ?   Boolean(callsLinksCache[call.id]) //False for empty rows(but we key exists)
                    ?   <audio controls>
                            <source src={ callsLinksCache[call.id] } />
                        </audio>
                    :   <FormattedMessage id='calls-table.no_record' />
                :   (<div>
                        <StyledButton type="primary" onClick={() => fetchRecordingLink({callId: call.id})}>
                            <FormattedMessage id='calls-table.show_record' />
                        </StyledButton>
                    </div>);
        }
    };

    return [
        date,
        status,
        caller,
        recipient,
        client,
        waiting,
        duration,
        innerRecipient,
        record,
    ];
}
