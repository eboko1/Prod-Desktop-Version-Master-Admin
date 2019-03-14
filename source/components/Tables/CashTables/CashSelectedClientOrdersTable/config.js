// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { Numeral } from 'commons';
import { OrderStatusIcon } from 'components';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

/* eslint-disable complexity */
export function columnsConfig() {
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
        render:    (_, order) => (
            <Numeral
                // TODO
                // currency={ formatMessage({ id: 'currency' }) }
                nullText='0'
            >
                { order.servicesTotalSum + order.detailsTotalSum }
            </Numeral>
        ),
    };

    const remainingSumCol = {
        title:     <FormattedMessage id='orders.remaining_sum' />,
        dataIndex: 'remainingSum',
        key:       'remainingSum',
        width:     140,
        render:    remainingSum => <Numeral nullText='0'>{ remainingSum }</Numeral>,
    };

    return [
        // testCol,
        orderCol,
        beginDatetimeCol,
        clientCol,
        sumCol,
        remainingSumCol,
    ];
}
