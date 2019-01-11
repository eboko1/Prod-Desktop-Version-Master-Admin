// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Numeral } from 'commons';

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
        width:     '35%',
    };

    const increaseCol = {
        title:     <FormattedMessage id='cash-table.increase' />,
        dataIndex: 'increase',
        width:     '20%',
        render:    key => <Numeral>{ key }</Numeral>,
    };
    const decreaseCol = {
        title:     <FormattedMessage id='cash-table.decrease' />,
        dataIndex: 'decrease',
        width:     '20%',
        render:    key => <Numeral>{ key }</Numeral>,
    };
    const balanceCol = {
        title:     <FormattedMessage id='cash-table.sum' />,
        dataIndex: 'balance',
        width:     '20%',
        render:    key => <Numeral>{ key }</Numeral>,
    };

    return [
        numberCol,
        nameCol,
        increaseCol,
        decreaseCol,
        balanceCol,
    ];
}
