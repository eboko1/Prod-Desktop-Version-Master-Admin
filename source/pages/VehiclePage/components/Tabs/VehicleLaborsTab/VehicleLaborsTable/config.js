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
    type:                  '10%',
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
        title:     <FormattedMessage id='orders.datetime' />,
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
        title:     <FormattedMessage id='labor.name' />,
        width:     defWidth.labor,
        dataIndex: 'serviceName',
        key:       'serviceName',
    };

   const typeCol = {
        title:     <FormattedMessage id='labors.type' />,
        width:     defWidth.type,
        dataIndex: 'defaultName',
        key:       'defaultName',
    };

    const storeGroupNameCol = {
        title:     <FormattedMessage id='store_group.name' />,
        width:     defWidth.begin_datetime,
        dataIndex: 'storeGroupName',
        key:       'storeGroupName',
    };

    const mechanicCol = {
        title:     <FormattedMessage id='employee.mechanic' /> ,
        width:     defWidth.mechanic,
        dataIndex: 'employeeFullName',
        key:       'employeeFullName',
    };

    const normHoursCol = {
        title:     <FormattedMessage id='labor.norm_hours' />,
        width:     defWidth.normHours,
        dataIndex: 'hours',
        key:       'hours',
    };

    const priceCol = {
        title:     <FormattedMessage id='labors.price' />,
        width:     defWidth.price,
        dataIndex: 'price',
        key:       'price',
    };

    const countCol = {
        title:     <FormattedMessage id='labors.count' />,
        width:     defWidth.count,
        dataIndex: 'count',
        key:       'count',
    };

    const sumCol = {
        title:     <FormattedMessage id='labors.sum' />,
        width:     defWidth.sum,
        dataIndex: 'sum',
        key:       'sum',
    };


    return [,
        orderCol,
        datetimeCol,
        laborCol,
        typeCol,
        storeGroupNameCol,
        mechanicCol,
        normHoursCol,
        priceCol,
        countCol,
        sumCol
    ];
}