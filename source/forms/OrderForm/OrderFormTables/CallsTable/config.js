// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { StyledButton } from 'commons';
import { CallStatusIcon } from 'components';

const defWidth = {
    date: '10%',
    status: '5%',
    order: '10%',
    caller: '15%',
    recipient: '15%',
    waiting: '10%',
    duration: '10%',
    record: 'auto',
};

export function columnsConfig({fetchRecordingLink, callsLinksCache}) {
    const date = {
        title:     <FormattedMessage id='date' />,
        width:     defWidth.date,
        dataIndex: 'date',
        key:       'order-calls-date',
        render:    date => (
            <div style={ { wordBreak: 'normal' } }>
                { moment(record.date).format('DD.MM.YYYY HH:mm') }
            </div>
        ),
    };

    const status = {
        title:     <FormattedMessage id='calls-table.status' />,
        width:     defWidth.status,
        dataIndex: 'status',
        key:       'status',
        render:    status => <CallStatusIcon status={ status } />
    };

    const caller = {
        title:     <FormattedMessage id='order_form_table.calls.caller' />,
        width:     defWidth.caller,
        dataIndex: 'caller',
        key:       'caller',
        render:    phone => <a href={ `tel:${phone}` }>{ phone }</a>
    };

    const recipient = {
        title:     <FormattedMessage id='order_form_table.calls.reciever' />,
        width:     defWidth.recipient,
        dataIndex: 'recipient',
        key:       'recipient',
        render:    phone => <a href={ `tel:${phone}` }>{ phone }</a>,
    };

    const waiting = {
        title:     <FormattedMessage id='order_form_table.calls.response_time' />,
        width:     defWidth.waiting,
        dataIndex: 'waiting',
        key:       'waiting',
    };

    const duration = {
        title:     <FormattedMessage id='order_form_table.calls.talk_time' />,
        width:     defWidth.duration,
        dataIndex: 'duration',
        key:       'duration',
    };

    const record = {
        title:     <FormattedMessage id='calls-table.record' />,
        width:     defWidth.record,
        key:       'recordingLink',
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
        waiting,
        duration,
        record,
    ];
}
