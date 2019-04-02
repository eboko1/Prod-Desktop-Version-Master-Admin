// vendor
import React from 'react';
import { Button, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { paymentTypes } from 'forms/SubscribeForm/config';

// own
import Styles from './styles.m.css';

export function columnsConfig() {
    const nameCol = {
        title:     <FormattedMessage id='subscription-table.name' />,
        dataIndex: 'product',
        width:     '35%',
        render:    product => product.name,
    };
    const startDateCol = {
        title:     <FormattedMessage id='subscription-table.start_date' />,
        dataIndex: 'startDatetime',
        width:     '20%',
        render:    date => moment(date).format('YYYY-MM-DD'),
    };
    const endDateCol = {
        title:     <FormattedMessage id='subscription-table.end_date' />,
        dataIndex: 'endDatetime',
        width:     '20%',
        render:    date => moment(date).format('YYYY-MM-DD'),
    };

    const paidCol = {
        title:     <FormattedMessage id='subscription-table.paid' />,
        dataIndex: 'paid',
        width:     '25%',
        render:    (paid, subscription) => {
            if (!paid && subscription.paymentType === paymentTypes.CASHLESS) {
                return (
                    <span className={ Styles.inProgress }>
                        <Icon type='clock-circle' />
                        &nbsp;
                        <FormattedMessage id='subscription-table.in_progress' />
                    </span>
                );
            }

            if (!paid && subscription.paymentType === paymentTypes.PORTMONE) {
                return (
                    <Button type='primary'>
                        <FormattedMessage id='subscription.purchase' />
                    </Button>
                );
            }

            if (paid) {
                return (
                    <span className={ Styles.paid }>
                        <Icon type='check-circle' />
                        <FormattedMessage id='subscription-table.paid' />
                    </span>
                );
            }
        },
    };

    return [
        nameCol,
        startDateCol,
        endDateCol,
        paidCol, 
    ];
}
