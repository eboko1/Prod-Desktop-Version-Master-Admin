// vendor
import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { FormattedDatetime } from 'components';
import book from 'routes/book';
// own

function renderCounterparty(cashOrder) {
    switch (true) {
        case Boolean(cashOrder.clientId):
            return (
                <Link to={ `${book.client}/${cashOrder.clientId}` }>
                    { cashOrder.clientName } { cashOrder.clientSurname }
                </Link>
            );

        case Boolean(cashOrder.employeeId):
            return (
                <Link to={ `${book.editEmployee}/${cashOrder.employeeId}` }>
                    { cashOrder.employeeName } { cashOrder.employeeSurname }
                </Link>
            );

        case Boolean(cashOrder.businessSupplierId):
            return (
                <Link to={ `${book.suppliersPage}` }>
                    { cashOrder.businessSupplierName }
                </Link>
            );

        case Boolean(cashOrder.otherCounterparty):
            return <div>{ cashOrder.otherCounterparty }</div>;

        default:
            return <FormattedMessage id='no_data' />;
    }
}

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
        width:     '10%',
        render:    (key, cashOrder) => renderCounterparty(cashOrder),
    };

    const orderCol = {
        title:     <FormattedMessage id='cash-table.order' />,
        dataIndex: 'orderId',
        width:     '10%',
        render:    orderId => (
            <Link
                to={ `${book.order}/${orderId}` }
                style={ { color: 'var(--link' } }
            >
                { orderId }
            </Link>
        ),
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
