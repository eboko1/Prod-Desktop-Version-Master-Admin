// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Popconfirm } from 'antd';

// own

/* eslint-disable complexity */
export function columnsConfig(props) {
    const numberCol = {
        title:     <FormattedMessage id='cash-table.cashbox_num' />,
        dataIndex: 'id',
        width:     'auto',
    };
    const cashOrderCol = {
        title:     <FormattedMessage id='cash-table.order_num' />,
        dataIndex: 'name',
        width:     '10%',
    };

    const dateCol = {
        title:     <FormattedMessage id='cash-table.date' />,
        dataIndex: 'date',
        width:     '10%',
    };

    const conterpartyCol = {
        title:     <FormattedMessage id='cash-table.conterparty' />,
        dataIndex: 'conterparty',
        width:     '20%',
    };

    const orderCol = {
        title:     <FormattedMessage id='cash-table.order' />,
        dataIndex: 'order',
        width:     '10%',
    };

    const activityCol = {
        title:     <FormattedMessage id='cash-table.activity' />,
        dataIndex: 'type',
        width:     '20%',
    };

    const sumCol = {
        title:     <FormattedMessage id='cash-table.sum' />,
        dataIndex: 'sum',
        width:     '10%',
    };

    const descriptionCol = {
        title:     <FormattedMessage id='cash-table.comment' />,
        dataIndex: 'description',
        width:     '15%',
    };

    return [
        numberCol,
        cashOrderCol,
        dateCol,
        conterpartyCol,
        orderCol,
        activityCol,
        sumCol,
        descriptionCol,
    ];
}
