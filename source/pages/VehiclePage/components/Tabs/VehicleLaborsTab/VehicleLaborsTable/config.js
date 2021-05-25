// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

//Proj
import book from 'routes/book';
import { Numeral, OrdersStatusesMapper } from "commons";
import { OrderStatusIcon, RepairMapIndicator, FormattedDatetime } from 'components';

//Own
import Styles from './styles.m.css';

const DEFAULT_DATETIME = 'DD.MM.YYYY HH:mm';

//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    order:               'auto',
    datetime:            '10%',
    labor:                '10%',
    storeGroupName:       '10%',
    mechanic:             '10%',
    normHours:         '10%',
    price:         '10%',
    count:         '10%',
    sum:         '10%',
    
}

const DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';

export function columnsConfig() {

    const orderCol = {
        title:     <FormattedMessage id='orders.order' />,
        width:     defWidth.order,
        dataIndex: 'orderNum',
        key:       'orderNum',
        render:    (orderNum) => (
            <>
                {orderNum}
            </>
        ),
    };

    const datetimeCol = {
        title:     <FormattedMessage id='orders.order' />,
        width:     defWidth.datetime,
        dataIndex: 'orderDatetime',
        key:       'orderDatetime',
        render:    (orderDatetime) => (
            <>
                <FormattedDatetime datetime={orderDatetime} format={DEFAULT_DATETIME}/>
            </>
        ),
    };


    const laborCol = {
        title:     <FormattedMessage id='orders.order' />,
        width:     defWidth.labor,
        dataIndex: 'serviceName',
        key:       'serviceName',
    };

    const storeGroupNameCol = {
        title:     <FormattedMessage id='orders.begin_date' />,
        width:     defWidth.begin_datetime,
        dataIndex: 'storeGroupName',
        key:       'storeGroupName',
    };

    const mechanicCol = {
        title:     <FormattedMessage id='orders.sum_without_VAT' /> ,
        width:     defWidth.mechanic,
        dataIndex: 'employeeFullName',
        key:       'employeeFullName',
    };

    const normHoursCol = {
        title:     <FormattedMessage id='orders.remaining_sum' />,
        width:     defWidth.normHours,
        dataIndex: 'hours',
        key:       'hours',
    };

    const priceCol = {
        title:     <FormattedMessage id='orders.remaining_sum' />,
        width:     defWidth.price,
        dataIndex: 'price',
        key:       'price',
    };

    const countCol = {
        title:     <FormattedMessage id='orders.remaining_sum' />,
        width:     defWidth.count,
        dataIndex: 'count',
        key:       'count',
    };

    const sumCol = {
        title:     <FormattedMessage id='orders.remaining_sum' />,
        width:     defWidth.sum,
        dataIndex: 'sum',
        key:       'sum',
    };


    return [,
        orderCol,
        datetimeCol,
        laborCol,
        storeGroupNameCol,
        mechanicCol,
        normHoursCol,
        priceCol,
        countCol,
        sumCol
    ];
}