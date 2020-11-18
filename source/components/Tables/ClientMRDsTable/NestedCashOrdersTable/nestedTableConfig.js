//Vendor
import React from 'react';
import { Link } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl';

//proj
import { FormattedDatetime } from 'components';
import book from "routes/book";


export default function columnsConfig() {
    
    const orderNumCol = {
        title:     'order number',
        dataIndex: 'id',
        width:     '10%',
        align: 'right',
        render:    (orderNum, mrd) => (
            <Link
                to={`${book.order}/${mrd.orderId}`}
            >
                {orderNum}
            </Link>
        ),
    };

    const amountCol = {
        title:     'amount',
        dataIndex: 'amount',
        width:     '10%',
        align: 'right',
        render: amount => {
            let strVal = Number(amount).toFixed(2);

            return (
                <span>
                    { amount ? 
                        `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                        : 0
                    }
                </span>
            );
        },
    };

    const orderDatetimeCol = {
        title:     'date',
        dataIndex: 'datetime',
        width:     '10%',
        align: 'right',
        render:    date => (
            <FormattedDatetime datetime={ date } format={ 'DD.MM.YYYY HH:mm:ss' } />
        ),
    };

    return [
        orderNumCol,
        amountCol,
        orderDatetimeCol
    ];
}