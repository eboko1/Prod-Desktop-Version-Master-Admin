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
    name:                '10%',
    supplierName:       '10%',
    purchasePrice:         '10%',
    price:         '10%',
    count:         '10%',
    sum:         '10%',
    
}

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


    const nameCol = {
        title:     <FormattedMessage id='orders.order' />,
        width:     defWidth.name,
        dataIndex: 'serviceName',
        key:       'serviceName',
    };

    const supplierNameCol = {
        title:     <FormattedMessage id='orders.begin_date' />,
        width:     defWidth.supplierName,
        dataIndex: 'supplierName',
        key:       'supplierName',
    };


    const purchasePriceCol = {
        title:     <FormattedMessage id='orders.remaining_sum' />,
        width:     defWidth.purchasePrice,
        dataIndex: 'purchasePrice',
        key:       'purchasePrice',
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
        nameCol,
        supplierNameCol,
        purchasePriceCol,
        priceCol,
        countCol,
        sumCol
    ];
}