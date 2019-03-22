// vendor
import React from 'react';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

export function columnsConfig() {
    const nameCol = {
        title:     <FormattedMessage id='subscription-table.name' />,
        dataIndex: 'name',
        width:     '40%',
    };
    const startDateCol = {
        title:     <FormattedMessage id='subscription-table.start_date' />,
        dataIndex: 'startDate',
        width:     '20%',
    };
    const endDateCol = {
        title:     <FormattedMessage id='subscription-table.end_date' />,
        dataIndex: 'endDate',
        width:     '20%',
    };

    const paidCol = {
        title:     <FormattedMessage id='subscription-table.paid' />,
        dataIndex: 'paid',
        width:     '20%',
        render:    paid => paid ? <Icon type='check-circle' /> : 'paid',
    };

    return [
        nameCol,
        startDateCol,
        endDateCol,
        paidCol,
    ];
}
