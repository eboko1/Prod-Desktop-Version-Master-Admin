// vendor
import React from 'react';
import { Icon, Popconfirm, Popover } from 'antd';
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
        width:  'auto',
        render:    (cashBoxId, { cashBoxName }) => (
            <div className={ Styles.breakWord }>
                { cashBoxId } { cashBoxName }
            </div>
        ),
    };

    const cashOrderCol = {
        title:     <FormattedMessage id='cash-table.order_num' />,
        dataIndex: 'id',
        width:  'auto',
    };

    const dateCol = {
        title:     <FormattedMessage id='cash-table.date' />,
        dataIndex: 'datetime',
        width:  'auto',
        render:    date => (
            <FormattedDatetime datetime={ date } format={ 'DD.MM.YYYY' } />
        ),
    };

    const conterpartyCol = {
        title:     <FormattedMessage id='cash-table.conterparty' />,
        width:  'auto',
        render:    (key, cashOrder) => renderCounterparty(cashOrder),
    };

    const orderCol = {
        title:     <FormattedMessage id='cash-table.order' />,
        width:  'auto',
        render:    ({orderId, storeDocId, orderNum, documentNumber}) => {
            return orderId ? (
                <Link
                    to={ `${book.order}/${orderId}` }
                    style={ { color: 'var(--link' } }
                >
                    { orderNum }
                </Link>
            ) : (
                <Link
                    to={ `${book.storageDocument}/${storeDocId}` }
                    style={ { color: 'var(--link' } }
                >
                    { documentNumber }
                </Link>
            )
        },
    };

    const activityCol = {
        title:     <FormattedMessage id='cash-table.activity' />,
        dataIndex: 'type',
        width:  'auto',
        render:    type => (
            <div className={ Styles.noBreak }>
                <FormattedMessage id={ `cash-order-form.type.${type}` } />
            </div>
        ),
    };

    const sumCol = {
        title:     <FormattedMessage id='cash-table.sum' />,
        dataIndex: 'sum',
        width:  'auto',
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

    const analyticsCol = {
        title:     <FormattedMessage id='cash-table.analytics' />,
        dataIndex: 'analyticsName',
        width:  'auto',
    };

    const descriptionCol = {
        title:     <FormattedMessage id='cash-table.comment' />,
        dataIndex: 'description',
        width:  'auto',
    };

    const rstCodeCol = {
        title:     'PPO',
        dataIndex: 'fiscalNumber',
        width:  'auto',
    };

    const actionsCol = {
        key:    'actions',
        width:  'auto',
        render: (key, cashOrder) => {

            /** Creates an icon with styles and popup.
             * @param popMessage - popup hint when hovered
             * @param options - Icon options (type, className ...)
             */
            const iconWithPop = ({popMessage, options}) => {
                return (
                    <Popover content={popMessage}>
                        <Icon {...options}/>
                    </Popover>
                );
            }
            
            /** When cashOrder was successfully registered in cashdesk api service */
            const cashOrderWithRST = (
                <div>
                    {iconWithPop({
                        popMessage: (<FormattedMessage id='cash-table.hint_send_sms' />),
                        options: {type: "message", className: Styles.sendSMS}
                    })}
                    
                    {iconWithPop({
                        popMessage: (<FormattedMessage id='cash-table.hint_send_email' />),
                        options: {type: "mail", className: Styles.sendMail}
                    })}
                </div>
            );
            
            /** When cashOrder was not registered in cashdesk api service */
            const cashOrderWithFailedRST = (<div>
                <Popconfirm
                    title={ <FormattedMessage id='cash-table.confirm' />}
                    onConfirm={() => props.onRegisterInCashdesk(cashOrder.id)}
                    okText={ <FormattedMessage id='yes' /> }
                    cancelText={ <FormattedMessage id='no' />}
                >
                    {iconWithPop({
                        popMessage: (<FormattedMessage id='cash-table.hint_repeat_registration' />),
                        options: {type: "exclamation-circle", className: Styles.unregisteredIcon}
                    })}
                </Popconfirm>
            </div>);

            return (
                <>
                    {
                        (cashOrder.rst)
                            ? cashOrder.isRegisteredWithRst
                                ? cashOrderWithRST
                                : cashOrderWithFailedRST
                            : null
                    }
                    <Icon
                        type='printer'
                        onClick={ () => props.openPrint(cashOrder) }
                        className={ Styles.printIcon }
                    />
                    <Icon
                        type='edit'
                        onClick={ () => props.openEdit(cashOrder) }
                        className={ Styles.editIcon }
                    />
                </>
            );
        },
    };

    const orderAndConterpartyCol = {
        title:     <FormattedMessage id='cash-table.order' />,
        width:  'auto',
        render:    (cashOrder) => {
            const conterparty = renderCounterparty(cashOrder)
            return cashOrder.orderId ? (
                <div>
                    <Link
                        to={ `${book.order}/${cashOrder.orderId}` }
                        style={ { color: 'var(--link' } }
                    >
                        { cashOrder.orderNum }
                    </Link>
                    <div>{conterparty}</div>
                </div>
            ) : (
                <div>
                    <Link
                        to={ `${book.storageDocument}/${cashOrder.storeDocId}` }
                        style={ { color: 'var(--link' } }
                    >
                        { cashOrder.documentNumber }
                    </Link>
                    <div>{conterparty}</div>
                </div>
            )
        },
    };

    return !props.isMobile ? 
    [
        numberCol,
        cashOrderCol,
        dateCol,
        conterpartyCol,
        orderCol,
        activityCol,
        sumCol,
        analyticsCol,
        descriptionCol,
        rstCodeCol,
        actionsCol,
    ] : [
        dateCol,
        orderAndConterpartyCol,
        sumCol
    ];
}
