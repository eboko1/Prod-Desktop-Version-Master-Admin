// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { v4 } from "uuid";
import moment from 'moment';

//Proj
import book from 'routes/book';
import { OrderStatusIcon, RepairMapIndicator } from 'components';

//Own
import Styles from './styles.m.css';

//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    order:               'auto',
    datetime:            '10%',
    begin_datetime:      '10%',
    delivery_datetime:   '10%',
    success_datetime:    '10%',
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
                        { /* <div>{ order.cancelReason }</div> */ }
                        <div>{ order.cancelStatusReason }</div>
                        <div>{ order.cancelStatusOwnReason }</div>
                    </div>
                ) }
                <RepairMapIndicator data={order.repairMapIndicator}/>
            </>
        ),
    };

    const datetimeCol = {
        title:     <FormattedMessage id='orders.creation_date' />,
        width:     defWidth.datetime,
        dataIndex: 'datetime',
        key:       v4(),
        render:    (val, order) => (
            <div className={ Styles.datetime }>
                { order.datetime
                    ? moment(order.datetime).format(DATETIME_FORMAT)
                    : '-' }
            </div>
        ),
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

    const deliveryDatetimeCol = {
        title:     <FormattedMessage id='orders.delivery_date' />,
        width:     defWidth.delivery_datetime,
        dataIndex: 'deliveryDatetime',
        key:       'deliveryDatetime',
        render: (val, order) => (
            <div className={ Styles.datetime }>
                { order.deliveryDatetime
                    ? moment(order.deliveryDatetime).format(DATETIME_FORMAT)
                    : '-' }
            </div>
        ),
    };

    const successDatetimeCol = {
        title:     <FormattedMessage id='orders.success_date' />,
        width:     defWidth.success_datetime,
        dataIndex: 'successDatetime',
        key:       'successDatetime',
        render:    (val, order) => (
            <div className={ Styles.datetime }>
                { order.successDatetime
                    ? moment(order.successDatetime).format(DATETIME_FORMAT)
                    : '-' }
            </div>
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

    return [
        orderCol,
        datetimeCol,
        beginDatetimeCol,
        deliveryDatetimeCol,
        successDatetimeCol,
        clientVehicleCol,
        responsibleCol
    ];
}