// vendor
// import React from 'react';
// import { FormattedMessage } from 'react-intl';

// own

/* eslint-disable complexity */
export function columnsConfig() {
    const numberCol = {
        title:     '№',
        dataIndex: 'id',
        width:     '5%',
    };
    const nameCol = {
        title:     'Название кассы',
        dataIndex: 'name',
        width:     '45%',
    };

    const sumCol = {
        title:     'Сумма',
        dataIndex: 'sum',
        width:     '25%',
    };

    return [ numberCol, nameCol, sumCol ];
}
