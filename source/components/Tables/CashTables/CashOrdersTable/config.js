// vendor
import React from 'react';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

import { FormattedDatetime } from 'components';

// own

/* eslint-disable complexity */
export function columnsConfig(props) {
    const numberCol = {
        title:     <FormattedMessage id='cash-table.cashbox_num' />,
        dataIndex: 'cashBoxId',
        width:     '10%',
        render:    (cashBoxId, { cashBoxName }) => (
            <div>
                { cashBoxId } { cashBoxName }
            </div>
        ),
    };

    const cashOrderCol = {
        title:     <FormattedMessage id='cash-table.order_num' />,
        dataIndex: 'id',
        width:     '10%',
    };

    const dateCol = {
        title:     <FormattedMessage id='cash-table.date' />,
        dataIndex: 'updatedAt',
        width:     '10%',
        render:    date => <FormattedDatetime datetime={ date } />,
    };

    const conterpartyCol = {
        title:     <FormattedMessage id='cash-table.conterparty' />,
        dataIndex: 'conterparty',
        width:     '20%',
        render:    (
            key,
            { otherCounterparty, clientId, employeeId, businessSupplierId },
        ) => <div>{ otherCounterparty }</div>,
    };

    const orderCol = {
        title:     <FormattedMessage id='cash-table.order' />,
        dataIndex: 'order',
        width:     '10%',
    };

    const activityCol = {
        title:     <FormattedMessage id='cash-table.activity' />,
        dataIndex: 'type',
        width:     '10%',
        render:    type => (
            <FormattedMessage id={ `cash-order-form.type.${type}` } />
        ),
    };

    const sumCol = {
        title:     <FormattedMessage id='cash-table.sum' />,
        dataIndex: 'sum',
        width:     '10%',
        render:    (key, { increase, decrease }) =>
            increase ? (
                <div
                    style={ { display: 'flex', justifyContent: 'space-around' } }
                >
                    + { increase }
                    <Icon type='caret-up' style={ { color: 'var(--enabled)' } } />
                </div>
            ) : (
                <div
                    style={ { display: 'flex', justifyContent: 'space-around' } }
                >
                    - { decrease }
                    <Icon
                        type='caret-down'
                        style={ { color: 'var(--disabled)' } }
                    />
                </div>
            ),
    };

    const descriptionCol = {
        title:     <FormattedMessage id='cash-table.comment' />,
        dataIndex: 'description',
        width:     '10%',
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
