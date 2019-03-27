// vendor
import React from 'react';
import { Button, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

export function columnsConfig() {
    const nameCol = {
        title:     <FormattedMessage id='subscription-table.name' />,
        dataIndex: 'product',
        width:     '40%',
        render:    product => product[ 0 ].name,
    };
    const startDateCol = {
        title:     <FormattedMessage id='subscription-table.start_date' />,
        dataIndex: 'startDatetime',
        width:     '20%',
    };
    const endDateCol = {
        title:     <FormattedMessage id='subscription-table.end_date' />,
        dataIndex: 'endDatetime',
        width:     '20%',
    };

    const paidCol = {
        title:     <FormattedMessage id='subscription-table.paid' />,
        dataIndex: 'paid',
        width:     '20%',
        render:    paid =>
            paid ? (
                <Icon type='check-circle' />
            ) : (
                <Button type='primary'>
                    <FormattedMessage id='subscription.purchase' />
                </Button>
            ),
    };

    return [
        nameCol,
        startDateCol,
        endDateCol,
        paidCol,
    ];
}
