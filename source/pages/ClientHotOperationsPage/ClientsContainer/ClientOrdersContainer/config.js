// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames/bind';
import { Button } from 'antd';
import _ from 'lodash';
import { v4 } from "uuid";
import moment from 'moment';

//Proj
import book from 'routes/book';
import {Numeral} from 'commons';
import { OrderStatusIcon, RepairMapIndicator } from 'components';

//Own
import Styles from './styles.m.css';

//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    no: '4%',
    client_vehicle: '10%',
    client_name: 'auto',

    order_planner: '6%',
    order_labors_plan: '6%',
    order_labors_actual: '6%',
    order_breaks: '6%',
    
    location_internal_parking: '6%',
    location_external_parking: '6%',
    location_department: '6%',
    location_test_drive: '6%',
    location_total: '6%',

    efficiency_plan: '6%',
    efficiency_department: '6%',
    efficiency_station: '6%'
}

const DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';

/* eslint-disable complexity */
export function columnsConfig() {

    const orderCol = {
        title:     <FormattedMessage id='orders.order' />,
        width:     'auto',
        dataIndex: 'num',
        key:       'num',
        render:    (val, order) => (
            <>
                <Link
                    className={ Styles.ordernLink }
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
        dataIndex: 'datetime',
        key:       v4(),
        width:     'auto',
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
        dataIndex: 'beginDatetime',
        key:       'beginDatetime',
        width:     'auto',
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
        dataIndex: 'deliveryDatetime',
        key:       'deliveryDatetime',
        width:     'auto',
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
        dataIndex: 'successDatetime',
        key:       'successDatetime',
        width:     'auto',
        render:    (val, order) => (
            <div className={ Styles.datetime }>
                { order.successDatetime
                    ? moment(order.successDatetime).format(DATETIME_FORMAT)
                    : '-' }
            </div>
        ),
    };

    const clientCol = {
        title:     <FormattedMessage id='orders.client' />,
        dataIndex: 'clientFullName',
        key:       'clientFullName',
        width:     'auto',
        render:    (val, order) => (
            <div className={ Styles.client }>
                <span className={ Styles.clientFullname }>
                    { `${order.clientName || '-'} ${order.clientSurname || ''}` }
                </span>
                <span className={ Styles.clientVehicle }>
                    { `${order.vehicleMakeName ||
                        '-'} ${order.vehicleModelName ||
                        '-'} ${order.vehicleYear || '-'}` }
                </span>
            </div>
        ),
    };

    const responsibleCol = {
        title:     <FormattedMessage id='orders.responsible' />,
        dataIndex: 'managerName',
        key:       'managerName',
        width:     'auto',
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
        clientCol,
        responsibleCol
    ];
}