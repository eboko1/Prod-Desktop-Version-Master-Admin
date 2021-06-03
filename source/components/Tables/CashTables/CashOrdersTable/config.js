// vendor
import React from 'react';
import { Icon, Popconfirm, Popover } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// proj
import { isForbidden, permissions } from "utils";
import { Numeral } from 'commons';
import { FormattedDatetime } from 'components';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

//Width of each column
const defWidth = {
    numberCol: 'auto',
    cashOrderCol: '6%',
    dateCol: '8%',
    conterpartyCol: '8%',
    orderCol: '8%',
    activityCol: '8%',
    sumCol: '5%',
    analyticsCol: '15%',
    descriptionCol: '8%',
    rstCodeCol: '5%',
    actionsCol: 'auto',

    orderAndConterpartyCol: 'auto'
}

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

    const {
        onRepeatRegistrationInCashdesk,
        openPrint,
        openEdit,
        onSendEmail,
        onSendSms,
        downloadReceipt,
        isMobile,
        user
    } = props;

    const numberCol = {
        title:     <FormattedMessage id='cash-table.cashbox_num' />,
        dataIndex: 'cashBoxId',
        width:     defWidth.numberCol,
        render:    (cashBoxId, { cashBoxName }) => (
            <div className={ Styles.breakWord }>
                <div>{ cashBoxId }</div>
                <div>{ cashBoxName }</div>
            </div>
        ),
    };

    const cashOrderCol = {
        title:     <FormattedMessage id='cash-table.order_num' />,
        dataIndex: 'id',
        width:     defWidth.cashOrderCol,
    };

    const dateCol = {
        title:     <FormattedMessage id='cash-table.date' />,
        dataIndex: 'datetime',
        width:     defWidth.dateCol,
        render:    date => (
            <FormattedDatetime datetime={ date } format={ 'DD.MM.YYYY' } />
        ),
    };

    const conterpartyCol = {
        title:     <FormattedMessage id='cash-table.conterparty' />,
        width:     defWidth.conterpartyCol,
        render:    (key, cashOrder) => renderCounterparty(cashOrder),
    };

    const orderCol = {
        title:     <FormattedMessage id='cash-table.order' />,
        width:     defWidth.orderCol,
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
        width:     defWidth.activityCol,
        render:    type => (
            <div className={ Styles.noBreak }>
                <FormattedMessage id={ `cash-order-form.type.${type}` } />
            </div>
        ),
    };

    const sumCol = {
        title:     <FormattedMessage id='cash-table.sum' />,
        dataIndex: 'sum',
        width:     defWidth.sumCol,
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
        width:     defWidth.analyticsCol,
    };

    const descriptionCol = {
        title:     <FormattedMessage id='cash-table.comment' />,
        dataIndex: 'description',
        width:     defWidth.descriptionCol,
    };

    /** RST is a special device, it has fiscal code */
    const rstCodeCol = {
        title:     'PPO',
        dataIndex: 'fiscalNumber',
        width:     defWidth.rstCodeCol,
    };

    const actionsCol = {
        key:    'actions',
        width:     defWidth.actionsCol,
        render: (key, cashOrder) => {

            const rstActionsAccess = !isForbidden(user, permissions.ACCESS_OTHER_OPERATION_RST);

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
            
            /** When cashOrder was successfully registered in cashdesk api service those are available */
            const cashOrderWithRST = (
                <span>
                    {iconWithPop({
                        popMessage: (<FormattedMessage id='cash-table.hint_send_sms' />),
                        options: {
                            type: "message",
                            className: _.join([Styles.sendSMS, rstActionsAccess? "": Styles.disabled], ' '), //Disable access if no scope
                            onClick: () => onSendSms({cashOrderId: cashOrder.id}),
                        }
                    })}
                    
                    {iconWithPop({
                        popMessage: (<FormattedMessage id='cash-table.hint_send_email' />),
                        options: {
                            type: "mail",
                            className: _.join([Styles.sendMailIcon, rstActionsAccess? "": Styles.disabled], ' '), //Disable access if no scope
                            onClick: () => onSendEmail({cashOrderId: cashOrder.id})
                        }
                    })}

                    {iconWithPop({
                        popMessage: (<FormattedMessage id='cash-table.hint_download_receipt' />),
                        options: {
                            type: "download",
                            className: _.join([Styles.downloadIcon, rstActionsAccess? "": Styles.disabled], ' '), //Disable access if no scope
                            onClick: () => downloadReceipt({cashOrderId: cashOrder.id})
                        }
                    })}
                </span>
            );
            
            /** When cashOrder was not registered in cashdesk api service those icons are visible */
            const cashOrderWithFailedRST = (<span>
                <Popconfirm
                    title={ <FormattedMessage id='cash-table.confirm' />}
                    onConfirm={() => onRepeatRegistrationInCashdesk({cashOrder})}
                    okText={ <FormattedMessage id='yes' /> }
                    cancelText={ <FormattedMessage id='no' />}
                >
                    {iconWithPop({
                        popMessage: (<FormattedMessage id='cash-table.hint_repeat_registration' />),
                        options: {
                            type: "exclamation-circle",
                            className: _.join([Styles.unregisteredIcon, rstActionsAccess? "": Styles.disabled], ' '), //Disable access if no scope
                        }
                    })}
                </Popconfirm>
            </span>);

            return (
                <div>
                    <span>
                        {iconWithPop({
                            popMessage: (<FormattedMessage id='cash-table.hint_print_cash_order' />),
                            options: {type: "printer", className: Styles.printIcon, onClick: () => openPrint(cashOrder)}
                        })}

                        {iconWithPop({
                            popMessage: (<FormattedMessage id='cash-table.hint_edit_cash_order' />),
                            options: {type: "edit", className: Styles.editIcon, onClick: () => openEdit(cashOrder)}
                        })}
                    </span>
                    {
                        (cashOrder.rst)
                            ? cashOrder.isRegisteredWithRst
                                ? cashOrderWithRST
                                : cashOrderWithFailedRST
                            : null
                    }
                </div>
            );
        },
    };

    const orderAndConterpartyCol = {
        title:     <FormattedMessage id='cash-table.order' />,
        width:     defWidth.orderAndConterpartyCol,
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

    return !isMobile ? 
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
