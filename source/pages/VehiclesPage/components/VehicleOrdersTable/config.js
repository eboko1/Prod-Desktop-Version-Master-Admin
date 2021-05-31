// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

//Proj
import book from 'routes/book';
import { Numeral, OrdersStatusesMapper } from "commons";
import { OrderStatusIcon, RepairMapIndicator } from 'components';

//Own
import Styles from './styles.m.css';

//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    order:               'auto',
    order_status:        '10%',
    begin_datetime:      '10%',
    sum:                 '10%',
    remaining_sum:       '10%',
    client_vehicle:      '25%',
    responsible:         '15%'
}

const DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';

export function columnsConfig() {

    const orderCol = {
        title:     <FormattedMessage id='orders.order' />,
        width:     defWidth.order,
        dataIndex: 'num',
        key:       'num',
        render:    (val, order) => (
            <>
                <Link
                    className={ Styles.orderLink }
                    to={ `${book.order}/${order.id}` }
                >
                    { order.num }
                </Link>

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
                        <div>{ order.cancelStatusReason }</div>
                        <div>{ order.cancelStatusOwnReason }</div>
                    </div>
                ) }
                <RepairMapIndicator data={order.repairMapIndicator}/>
            </>
        ),
    };

    const orderStatusCol = {
        title:     <FormattedMessage id='orders.status' />,
        width:     defWidth.order_status,
        dataIndex: 'status',
        key:       'status',
        render:    (status) => (<OrdersStatusesMapper status={status}/>),
    };

    const beginDatetimeCol = {
        title:     <FormattedMessage id='orders.begin_date' />,
        width:     defWidth.begin_datetime,
        dataIndex: 'beginDatetime',
        key:       'beginDatetime',
        render: (val, order) => (
            <div className={ Styles.datetime }>
                { order.beginDatetime
                    ? moment(order.beginDatetime).format(DATETIME_FORMAT)
                    : '-' }
            </div>
        ),
    };

    const sumCol = {
        title:     <FormattedMessage id='orders.sum_without_VAT' /> ,
        width:     defWidth.sum,
        dataIndex: 'totalSum',
        key:       'totalSum',
        render:    (_, order) => (
            <div style={{whiteSpace: 'nowrap'}}>
                <Numeral
                    nullText='0'
                    mask='0,0.00'
                >
                    { order.servicesTotalSum + order.detailsTotalSum }
                </Numeral>
            </div>
        ),
    };

    const remainingSumCol = {
        title:     <FormattedMessage id='orders.remaining_sum' />,
        width:     defWidth.remaining_sum,
        dataIndex: 'remainingSum',
        key:       'remainingSum',
        render:    remainingSum => (
            <Numeral
                nullText='0'
                mask='0,0.00'
            >
                { remainingSum }
            </Numeral>
        ),
    };

    const clientVehicleCol = {
        title:     <FormattedMessage id='orders.vehicle' />,
        width:     defWidth.client_vehicle,
        dataIndex: 'clientVehicle',
        key:       'clientVehicle',
        render:    (val, order) => (
            <span className={ Styles.clientVehicle }>
                { `${order.vehicleMakeName ||
                    '-'} ${order.vehicleModelName ||
                    '-'} ${order.vehicleYear || '-'}` }
            </span>
        ),
    };

    const responsibleCol = {
        title:     <FormattedMessage id='orders.responsible' />,
        width:     defWidth.responsible,
        dataIndex: 'managerName',
        key:       'managerName',
        render:    (val, order) => {
            if (order.managerName) {
                return (
                    <div>
                        {order.managerName} {order.managerSurname && order.managerSurname}
                    </div>
                );
            }

            return  <div>
                        <FormattedMessage id='orders.not_assigned' />
                    </div>;
        },
    };

    return [,
        orderCol,
        orderStatusCol,
        beginDatetimeCol,
        sumCol,
        remainingSumCol,
        clientVehicleCol,
        responsibleCol
    ];
}