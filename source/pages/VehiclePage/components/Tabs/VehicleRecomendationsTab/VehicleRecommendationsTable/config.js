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
    order:               '25%',
    datetime:            '15%',
    recommendation:       'auto',
    
}

export function columnsConfig() {

    const orderCol = {
        title:     "Test",//<FormattedMessage id='orders.order' />,
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
        title:     "Test",//<FormattedMessage id='orders.datetime' />,
        width:     defWidth.datetime,
        dataIndex: 'orderDatetime',
        key:       'orderDatetime',
        render:    (orderDatetime) => (
            <>
                <FormattedDatetime datetime={orderDatetime} format={DEFAULT_DATETIME}/>
            </>
        ),
    };


    const recommendationCol = {
        title:     "Test",//<FormattedMessage id='appurtenance.code' />,
        width:     defWidth.recommendation,
        dataIndex: 'recommendation',
        key:       'recommendation',
    };

    return [,
        orderCol,
        datetimeCol,
        recommendationCol,
    ];
}