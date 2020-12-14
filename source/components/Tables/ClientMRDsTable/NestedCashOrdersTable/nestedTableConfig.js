//Vendor
import React from 'react';
import { Link } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl';

//proj
import { FormattedDatetime } from 'components';
import book from "routes/book";


export default function columnsConfig({fetchCashOrderEntity, openPrint}) {
    
    const orderNumCol = {
        title:     'order number',
        dataIndex: 'id',
        width:     '10%',
        align: 'right',
        render:    (orderNum, mrd) => {
            return (
                // <button onClick={() => {fetchCashOrderEntity(50954); openPrint();}}>{orderNum}</button>
                // {orderNum}
                // <a onClick={() => {fetchCashOrderEntity(orderNum); openPrint();}}>{orderNum}</a>
                <a onClick={async () => {await openPrint(orderNum);}}>{orderNum}</a>
                // <Link
                //     to={`${book.order}/${mrd.orderId}`}
                // >
                //     {orderNum}
                // </Link>
            )
        },
    };

    const orderDatetimeCol = {
        title:     'date',
        dataIndex: 'datetime',
        width:     '10%',
        align: 'right',
        render:    date => (
            <FormattedDatetime datetime={ date } format={ 'DD.MM.YYYY' } />
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

    return [
        orderNumCol,
        orderDatetimeCol,
        amountCol,
    ];
}