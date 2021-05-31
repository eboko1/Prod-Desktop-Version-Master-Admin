// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

//Proj
import book from 'routes/book';
import { FormattedDatetime } from 'components';

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
        title:     <FormattedMessage id='vehicle_page.order_id' />,
        width:     defWidth.order,
        dataIndex: 'orderNum',
        key:       'orderNum',
        render:    (orderNum, recommendation) => (
            <>
                <Link to={ `${book.order}/${recommendation.orderId}` }>
                    {orderNum}
                </Link>
                
            </>
        ),
    };

    const datetimeCol = {
        title:     <FormattedMessage id='vehicle_page.order_datetime' />,
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
        title:     <FormattedMessage id='vehicle_page.order_recommendation' />,
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