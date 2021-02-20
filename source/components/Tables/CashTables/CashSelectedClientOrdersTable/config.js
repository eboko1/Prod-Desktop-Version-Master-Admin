// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Icon } from "antd";

// proj
import { Numeral } from 'commons';
import { OrderStatusIcon } from 'components';
import book from 'routes/book';
import { ProductTableData } from '../../StorageTables/ProductTableData';

// own
import Styles from './styles.m.css';

/* eslint-disable complexity */
export function columnsConfig({formatMessage, type}) {
    const orderCol = {
        title:     <FormattedMessage id='orders.order' />,
        width:     220,
        dataIndex: 'num',
        key:       'num',
        // fiDeviceLightEvent
        render:    (_, order) => (
            <div>
                <a
                    className={ Styles.orderLink }
                    target='_blank'
                    rel='noopener noreferrer'
                    href={ `${__APP_URL__}${book.order}/${order.id}` }
                >
                    { order.num }
                </a>
                <OrderStatusIcon status={ order.status } />
                { order.serviceNames && (
                    <div className={ Styles.serviceNames }>
                        { [ ...new Set(order.serviceNames) ].join(', ') }
                    </div>
                ) }
                { order.recommendation && (
                    <div className={ Styles.recommendation }>
                        { order.recommendation }
                    </div>
                ) }
                { (order.cancelReason ||
                    order.cancelStatusReason ||
                    order.cancelStatusOwnReason) && (
                    <div className={ Styles.cancelReason }>
                        { /* <div>{ order.cancelReason }</div> */ }
                        <div>{ order.cancelStatusReason }</div>
                        <div>{ order.cancelStatusOwnReason }</div>
                    </div>
                ) }
            </div>
        ),
    };

    const beginDatetimeCol = {
        title:     <FormattedMessage id='orders.begin_date' />,
        dataIndex: 'beginDatetime',
        key:       'beginDatetime',
        width:     160,
        render:    (_, order) => (
            <div className={ Styles.datetime }>
                { order.beginDatetime
                    ? moment(order.beginDatetime).format('DD.MM.YYYY HH:mm')
                    : '-' }
            </div>
        ),
    };

    const clientCol = {
        title:     <FormattedMessage id='orders.client' />,
        dataIndex: 'clientFullName',
        key:       'clientFullName',
        width:     220,
        render:    (_, order) => (
            <div className={ Styles.client }>
                <span className={ Styles.clientVehicle }>
                    { `${order.vehicleMakeName ||
                        '-'} ${order.vehicleModelName ||
                        '-'} ${order.vehicleYear || '-'}` }
                </span>
                <a
                    className={ Styles.clientPhone }
                    href={ `tel:${order.clientPhone}` }
                >
                    { order.clientPhone || '-' }
                </a>
            </div>
        ),
    };

    const sumCol = {
        title:     <FormattedMessage id='orders.sum' />,
        dataIndex: 'totalSum',
        key:       'totalSum',
        width:     140,
        render:    (_, order) => {
            console.log(order);
            const sum = order.isTaxPayer ? order.totalSumWithTax : order.servicesTotalSum + order.detailsTotalSum
            return (
                    <Numeral
                        // TODO
                        // currency={ formatMessage({ id: 'currency' }) }
                        nullText='0'
                    >
                        { sum }
                    </Numeral>
            )
        }
    };

    const remainingSumCol = {
        title:     <FormattedMessage id='orders.remaining_sum' />,
        dataIndex: 'remainingSum',
        key:       'remainingSum',
        width:     140,
        render:    remainingSum => <Numeral nullText='0'>{ remainingSum }</Numeral>,
    };


    const documentNumber = {
        title:     <FormattedMessage id='storage_document.document' />,
        dataIndex: 'documentNumber',
        key:       'documentNumber',
        width:     'auto',
    };

    const datetimeCol = {
        title:     <FormattedMessage id='orders.creation_date' />,
        dataIndex: 'createdDatetime',
        key:       'createdDatetime',
        width:     'auto',
        sorter:    (a, b) =>
            moment(a.createdDatetime).isAfter(b.createdDatetime)
                ? 1
                : moment(b.createdDatetime).isAfter(a.createdDatetime)
                    ? -1
                    : 0,
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
        width:     'auto',
        render:    (_, document) => (
            <div>
                {
                    document.counterpartClientName ||
                    <FormattedMessage id='long_dash' />
                }
            </div>
        ),
    };

    const documentSumCol = {
        title:     <FormattedMessage id='orders.sum' />,
        dataIndex: 'sellingSum',
        key:       'sellingSum',
        width:     'auto',
        sorter:    (a, b) => Math.abs(a.sellingSum) - Math.abs(b.sellingSum),
        render:    (_, document) => (
            <Numeral
                // TODO
                currency={ formatMessage({ id: 'currency' }) }
                nullText='0'
                mask='0,0.00'
            >
                { Math.abs(document.sellingSum) }
            </Numeral>
        ),
    };

    const documentStatusCol = {
        title:     <FormattedMessage id='storage_document.document_status' />,
        dataIndex: 'status',
        key:       'status',
        width:     'auto',
        render:    (_, document) => (
            <div>
                { document.status == "DONE" ? (
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

    return type == "storeDoc" ?
    [
        documentNumber,
        datetimeCol,
        counterpartyCol,
        documentSumCol,
        documentStatusCol,
    ] : [
        orderCol,
        beginDatetimeCol,
        clientCol,
        sumCol,
        remainingSumCol,
    ];
}
