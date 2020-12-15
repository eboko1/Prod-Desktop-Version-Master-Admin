// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Icon, Tooltip, Button, Popconfirm } from 'antd';
import classNames from 'classnames/bind';
import moment from 'moment';
import _ from 'lodash';

// proj
import { Numeral } from 'commons';
import { OrderStatusIcon } from 'components';
import { permissions, isForbidden } from 'utils';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

/* eslint-disable complexity */
const INCOME = 'INCOME',
      EXPENSE = 'EXPENSE',
      RESERVE = 'RESERVE',
      SUPPLIER = 'SUPPLIER',
      CLIENT = 'CLIENT',
      INVENTORY = 'INVENTORY',
      OWN_CONSUMPTION = 'OWN_CONSUMPTION',
      TRANSFER = 'TRANSFER',
      ADJUSTMENT = 'ADJUSTMENT',
      ORDERINCOME = 'ORDERINCOME',
      ORDER = 'ORDER',
      NEW = 'NEW',
      DONE = 'DONE';

const INC = 'INC',
      CRT = 'CRT',
      STP = 'STP',
      OUT = 'OUT',
      SRT = 'SRT',
      CST = 'CST',
      STM = 'STM',
      TSF = 'TSF',
      RES = 'RES',
      ORD = 'ORD',
      BOR = 'BOR',
      COM = 'COM';


export function columnsConfig(
    activeRoute,
    listType,
    formatMessage,
    deleteAction,
) {
    var isOrder = false,
        isTransfer = false,
        isIncomes = false,
        isExpense = false;

    switch (activeRoute) {
        case '/storage-orders':
            isOrder = true;
            break
        case '/storage-incomes':
            isIncomes = true;
            break;
        case '/storage-expenses':
            isExpense = true;
            break;
        case '/storage-transfers':
            isTransfer = true;
            break;
        case '/supplier/:id':
            isOrder = true;
            break;
    }

    const sortOptions = {
        asc:  'ascend',
        desc: 'descend',
    };

    const indexCol = {
        title:     '№',
        width:     20,
        dataIndex: 'key',
        key:       'key',
        render:    key => key + 1,
        // fixed:     'left',
    };

    const orderCol = {
        title:     <FormattedMessage id='storage_document.document' />,
        width:     100,
        dataIndex: 'supplierDocNumber',
        key:       'supplierDocNumber',
        // fixed:     'left',
        render:    (_, document) => (
            <>
                <Link to={ `${book.storageDocument}/${document.id}` }>
                    { document.documentNumber }
                </Link>
            </>
        ),
    };

    const datetimeCol = {
        title:     <FormattedMessage id='orders.creation_date' />,
        dataIndex: 'createdDatetime',
        key:       'createdDatetime',
        sorter:    (a, b) =>
            moment(a.createdDatetime).isAfter(b.createdDatetime)
                ? 1
                : moment(b.createdDatetime).isAfter(a.createdDatetime)
                    ? -1
                    : 0,
        width:  80,
        render: (_, document) => (
            <div>
                { document.createdDatetime ? 
                    moment(document.createdDatetime).format('DD.MM.YYYY HH:mm')
                    : (
                        <FormattedMessage id='long_dash' />
                    ) }
            </div>
        ),
    };

    const counterpartyCol = {
        title:     <FormattedMessage id='storage_document.counterparty' />,
        key:       'businessSupplier',
        width:     80,
        render:    (_, document) => (
            <div>
                {
                    document.counterpartEmployeeName ||
                    document.counterpartBusinessSupplierName ||
                    document.counterpartClientName ||
                    <FormattedMessage id='long_dash' />
                }
            </div>
        ),
    };

    const counterpartyTypeCol = {
        title:     <FormattedMessage id='storage_document.counterparty_type' />,
        dataIndex: 'counterpartBusinessSupplierId',
        key:       'counterpartBusinessSupplierId',
        width:     80,
        render:    (_, document) => (
            <div>
                { document.counterpartBusinessSupplierId ? (
                    <FormattedMessage id='storage_document.supplier' />
                ) : document.counterpartClientId || document.clientId ? (
                    <FormattedMessage id='storage_document.client' />
                ) : document.counterpartEmployeeId ? (
                    <FormattedMessage id='storage_document.own_consumpty' />
                ) : document.counterpartWarehouseId && document.type == EXPENSE ? (
                    <FormattedMessage id='storage_document.inventory' />
                ) : (
                    <FormattedMessage id='long_dash' />
                ) }
            </div>
        ),
    };

    const sumCol = {
        title:     <FormattedMessage id='orders.sum' />,
        dataIndex: 'sum',
        key:       'sum',
        sorter:    (a, b) => a.sum - b.sum,
        width:     60,
        render:    (_, document) => (
            <Numeral
                // TODO
                currency={ formatMessage({ id: 'currency' }) }
                nullText='0'
                mask='0,0.00'
            >
                { document.sum }
            </Numeral>
        ),
    };

    const documentTypeCol = {
        title:     <FormattedMessage id='storage_document.document_type' />,
        dataIndex: 'type',
        key:       'type',
        width:     80,
        render:    (_, document) => {
            return (
                <div>
                    <FormattedMessage id={`storage_document.docType.${isOrder ? ORDER : document.type}.${isOrder && document.type == EXPENSE && document.documentType == SUPPLIER ? ORDERINCOME : document.documentType}`}/>
                </div>
            )
        }
    };

    const documentStatusCol = {
        title:     <FormattedMessage id='storage_document.document_status' />,
        dataIndex: 'status',
        key:       'status',
        width:     80,
        render:    (_, document) => (
            <div>
                { document.status == DONE ? (
                    <>
                        <FormattedMessage id='storage_document.status_confirmed' />{ ' ' }
                        <Icon
                            type='check-circle'
                            theme='filled'
                            style={ { color: 'var(--green)' } }
                        />
                    </>
                ) : (
                    <>
                        <FormattedMessage id='storage_document.status_created' />{ ' ' }
                        <Icon
                            type='clock-circle'
                            theme='filled'
                            style={ { color: 'var(--orange)' } }
                        />
                    </>
                ) }
            </div>
        ),
    };

    const documentStorageExpensesCol = {
        title:     <FormattedMessage id='storage_document.storage_expenses' />,
        dataIndex: 'expense',
        key:       'expense',
        width:     80,
        render:    (_, document) => (
            <div>
                { isTransfer || isExpense ?
                    (document.warehouseName || document.counterpartWarehouseName) :
                    <FormattedMessage id='long_dash' />
                }
            </div>
        ),
    };

    const documentStorageIncomeCol = {
        title:     <FormattedMessage id='storage_document.storage_income' />,
        dataIndex: 'income',
        key:       'income',
        width:     80,
        render:    (_, document) => (
            <div>
                { isTransfer || isIncomes ?
                    (document.counterpartWarehouseName || document.warehouseName) :
                    <FormattedMessage id='long_dash' />
                }
            </div>
        ),
    };

    const deleteActionCol = {
        key:    'delete',
        width:  20,
        render: (_, document) => (
            <div>
                <Popconfirm
                    type='danger'
                    title={ formatMessage({
                        id: 'add_order_form.delete_confirm',
                    }) }
                    onConfirm={ () => {
                        let token = localStorage.getItem('_my.carbook.pro_token');
                        let url = __API_URL__ + `/store_docs/${document.id}`;
                        fetch(url, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': token,
                            },
                        })
                        .then(function (response) {
                            if (response.status !== 200) {
                            return Promise.reject(new Error(response.statusText))
                            }
                            return Promise.resolve(response)
                        })
                        .then(function (response) {
                            return response.json()
                        })
                        .then(function (data) {
                            window.location.reload();
                        })
                        .catch(function (error) {
                            console.log('error', error);
                        });
                    } }
                >
                    <Icon
                        className={
                            document.status == DONE
                                ? Styles.disabledDeleteDocumentIcon
                                : Styles.deleteDocumentIcon
                        }
                        type='delete'
                    />
                </Popconfirm>
            </div>
        ),
    };

    switch (activeRoute) {
        case '/storage-orders':
            return [
                indexCol,
                orderCol,
                datetimeCol,
                counterpartyCol,
                sumCol,
                documentTypeCol,
                documentStatusCol,
                deleteActionCol,
            ];

        case '/storage-incomes':
            return [
                indexCol,
                orderCol,
                datetimeCol,
                counterpartyCol,
                counterpartyTypeCol,
                sumCol,
                documentTypeCol,
                documentStatusCol,
                //documentStorageExpensesCol,
                documentStorageIncomeCol,
                deleteActionCol,
            ];

        case '/storage-expenses':
            return [
                indexCol,
                orderCol,
                datetimeCol,
                counterpartyCol,
                counterpartyTypeCol,
                sumCol,
                documentTypeCol,
                documentStatusCol,
                documentStorageExpensesCol,
                //documentStorageIncomeCol,
                deleteActionCol,
            ];

        case '/storage-transfers':
            return [
                indexCol,
                orderCol,
                datetimeCol,
                sumCol,
                documentStatusCol,
                documentStorageExpensesCol,
                documentStorageIncomeCol,
                deleteActionCol,
            ];

        case '/supplier/:id':
            return [
                indexCol,
                orderCol,
                datetimeCol,
                counterpartyCol,
                sumCol,
                documentTypeCol,
                documentStatusCol,
            ];

        default:
            return [
                indexCol,
                orderCol,
                datetimeCol,
                sumCol,
            ];
    }
}

export function rowsConfig(
    activeRoute,
    selectedRowKeys,
    onChange,
    getCheckboxProps,
) {
    if (activeRoute === '/orders/success' || activeRoute === '/orders/cancel') {
        return {
            selectedRowKeys,
            onChange,
            getCheckboxProps,
        };
    }

    return null;
}

export function scrollConfig(activeRoute) {
    switch (activeRoute) {
        case '/orders/appointments':
            return { x: 1500, y: '50vh' }; //1600 - 80 -
        case '/orders/approve':
            return { x: 1340, y: '50vh' };
        case '/orders/progress':
            return { x: 1340, y: '50vh' }; //1440 - 80 - 20
        case '/orders/success':
            return { x: 1860, y: '50vh' }; //1820
        case '/orders/reviews':
            return { x: 1520, y: '50vh' }; //1620
        case '/orders/invitations':
            return { x: 1260, y: '50vh' }; //1400
        case 'orders/cancel':
            return { x: 1400, y: '50vh' }; //1640 // -160 second date
        default:
            return { x: 1540, y: '50vh' }; //1640
    }
}
