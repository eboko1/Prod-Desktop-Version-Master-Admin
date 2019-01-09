// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// own

/* eslint-disable complexity */
export function columnsConfig() {
    const numberCol = {
        title:     '№',
        dataIndex: 'id',
        width:     '5%',
    };
    const nameCol = {
        title:     <FormattedMessage id='cash-table.name' />,
        dataIndex: 'name',
        width:     '45%',
    };

    const sumCol = {
        title:     <FormattedMessage id='cash-table.sum' />,
        dataIndex: 'balance',
        width:     '25%',
    };

    return [ numberCol, nameCol, sumCol ];
}
