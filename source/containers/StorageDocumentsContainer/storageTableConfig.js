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
export function columnsConfig(
    activeRoute,
    listType,
    formatMessage,
    deleteAction,
) {

    var documentTag; 
    
    switch (listType) {
        case 'ORDER':
            documentTag = 'ORD';
            break;
    
        case 'INCOME':
            documentTag = 'INS';
            break;
    
        case 'EXPENSE':
            documentTag = 'OUT';
            break;
    
        case 'TRANSFER':
            documentTag = 'TSF';
            break;
    
        default:
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
        render: (key)=>key+1,
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
            {document.orderId && listType == 'EXPENSE' ? 
            <Link
                to={ `/order/${document.orderId}` }
            >
                {documentTag + document.orderNum.slice(3)}
            </Link> :
            <Link
                to={ `/storage-document/${document.id}` }
            >
                {`${documentTag}-${document.businessId}-${(document.supplierDocNumber || "").padStart(7, '0')}`}
            </Link>
            }
                
            </>
        ),
    };

    const datetimeCol = {
        title:     <FormattedMessage id='orders.creation_date' />,
        dataIndex: 'createdDatetime',
        key:       'createdDatetime',
        sorter:    (a, b) => moment(a.createdDatetime).isAfter(b.createdDatetime) ? 1 : (moment(b.createdDatetime).isAfter(a.createdDatetime) ? -1 : 0),
        width:     80,
        render:    (_, document) => (
            <div>
                {document.createdDatetime ?
                moment(document.createdDatetime).format('DD.MM.YYYY HH:mm') :
                listType == 'EXPENSE' ?
                moment(document.orderDatetime).format('DD.MM.YYYY HH:mm') :
                <FormattedMessage id='long_dash'/>}
            </div>
        ),
    };;

    const counterpartyCol = {
        title:     <FormattedMessage id='storage_document.counterparty' />,
        dataIndex: 'businessSupplier',
        key:       'businessSupplier',
        width:     80,
        render:    (_, document) => (
            <div>
                {document.businessSupplier ?
                document.businessSupplier.name :
                document.clientName ||
                <FormattedMessage id='long_dash'/>}
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
                {document.counterpartBusinessSupplierId ? <FormattedMessage id='storage_document.supplier'/> :
                document.counterpartClientId || document.clientId ? <FormattedMessage id='storage_document.client'/> :
                document.counterpartEmployeeId ? <FormattedMessage id='storage_document.own_consumption'/> :
                document.warehouseId && document.type == 'EXPENSE' ? <FormattedMessage id='storage_document.inventory'/> :
                <FormattedMessage id='long_dash'/>}
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
                mask ='0,0.00'
            >
                { document.sum  }
            </Numeral>
        ),
    };

    const documentTypeCol = {
        title:     <FormattedMessage id='storage_document.document_type' />,
        dataIndex: 'type',
        key:       'type',
        width:     80,
        render:    (_, document) => (
            <div>
                {document.type == 'INCOME' ? 
                <FormattedMessage id='storage_document.income'/> : 
                document.type == 'EXPENSE' ?
                <FormattedMessage id='storage_document.return'/> : 
                <FormattedMessage id='long_dash'/>}
            </div>
        ),
    };

    const documentStatusCol = {
        title:     <FormattedMessage id='storage_document.document_status' />,
        dataIndex: 'status',
        key:       'status',
        width:     80,
        render:    (_, document) => (
            <div>
                {document.status == 'DONE' ?
                <><FormattedMessage id='storage_document.status_confirmed'/> <Icon type='check-circle' theme='filled' style={{color: 'var(--green)'}}/></>:
                <><FormattedMessage id='storage_document.status_created'/> <Icon type='clock-circle' theme='filled' style={{color: 'var(--orange)'}}/></>}
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
                {listType == 'EXPENSE' && ( document.warehouseName || <FormattedMessage id='long_dash'/> )}
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
                {listType == 'INCOME' && ( document.warehouseName || <FormattedMessage id='long_dash'/> )}
            </div>
        ),
    };

    const deleteActionCol = {
        key:       'delete',
        width:     20,
        render:    (_, document) => (
            <div>
                <Popconfirm
                    type='danger'
                    title={formatMessage({ id: 'add_order_form.delete_confirm' })}
                    onConfirm={()=>{
                        deleteAction();
                    }}
                >
                    <Icon
                        className={document.status == 'DONE' ? Styles.disabledDeleteDocumentIcon : Styles.deleteDocumentIcon}
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
                counterpartyTypeCol,
                sumCol,
                documentTypeCol,
                documentStatusCol,
                documentStorageExpensesCol,
                documentStorageIncomeCol,
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
