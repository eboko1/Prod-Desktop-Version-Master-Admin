// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

export function columnsConfig() {
    const id = {
        title:     <FormattedMessage id='subscription-table.name' />,
        dataIndex: 'id',
        width:     '50%',
    };
    const markup = {
        title:     <FormattedMessage id='subscription-table.start_date' />,
        dataIndex: 'markup',
        width:     '50%',
        render:    markup => <span>{ markup } %</span>,
    };

    return [ id, markup ];
}
