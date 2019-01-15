// vendor
import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// proj
import { Numeral } from 'commons';
import { FormattedDatetime } from 'components';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

function renderCounterparty(cashOrder) {
    switch (true) {
        case Boolean(cashOrder.clientId):
            return (
                <Link
                    to={ `${book.client}/${cashOrder.clientId}` }
                    className={ Styles.breakWord }
                >
                    { cashOrder.clientName } { cashOrder.clientSurname }
                </Link>
            );

        case Boolean(cashOrder.employeeId):
            return (
                <Link
                    to={ `${book.employeesPage}/${cashOrder.employeeId}` }
                    className={ Styles.breakWord }
                >
                    { cashOrder.employeeName } { cashOrder.employeeSurname }
                </Link>
            );

        case Boolean(cashOrder.businessSupplierId):
            return (
                <Link to={ `${book.suppliersPage}` } className={ Styles.breakWord }>
                    { cashOrder.businessSupplierName }
                </Link>
            );

        case Boolean(cashOrder.otherCounterparty):
            return (
                <div className={ Styles.breakWord }>
                    { cashOrder.otherCounterparty }
                </div>
            );

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
            <div className={ Styles.breakWord }>
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
        dataIndex: 'datetime',
        width:     '10%',
        render:    date => (
            <FormattedDatetime datetime={ date } format={ 'DD.MM.YYYY' } />
        ),
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
        width:     '15%',
        render:    type => (
            <div className={ Styles.noBreak }>
                <FormattedMessage id={ `cash-order-form.type.${type}` } />
            </div>
        ),
    };

    const sumCol = {
        title:     <FormattedMessage id='cash-table.sum' />,
        dataIndex: 'sum',
        width:     '10%',
        render:    (key, { increase, decrease }) =>
            increase ? (
                <div
                    style={ {
                        display:        'flex',
                        justifyContent: 'space-around',
                        alignItems:     'center',
                    } }
                >
                    + <Numeral>{ increase }</Numeral>
                    <Icon type='caret-up' style={ { color: 'var(--enabled)' } } />
                </div>
            ) : (
                <div
                    style={ {
                        display:        'flex',
                        justifyContent: 'space-around',
                        alignItems:     'center',
                    } }
                >
                    - <Numeral>{ decrease }</Numeral>
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

    const actionsCol = {
        dataIndex: 'actions',
        width:     'auto',
        render:    (key, cashOrder) => 
            <>
                <Icon
                    type='printer'
                    onClick={ () => props.openPrint(cashOrder) }
                    className={ Styles.printIcon }
                />
                {props.openEdit ? (
                    <Icon
                        type='edit'
                        onClick={ () => props.openEdit(cashOrder) }
                        className={ Styles.editIcon }
                    />
                ) : null}
            </>
        ,
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
        actionsCol,
    ];
}
