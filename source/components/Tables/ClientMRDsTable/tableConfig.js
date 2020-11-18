//Vendor
import React from 'react';
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';

//proj
import { Numeral } from "commons";
import { FormattedDatetime } from 'components';
import book from "routes/book";

export default function columnsConfig() {
    
    const orderNumCol = {
        title:     <FormattedMessage id="client-mrds-table.mrd_number"/>,
        dataIndex: 'orderNum',
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

    const amountWithTaxesCol = {
        title:     <FormattedMessage id="client-mrds-table.amount"/>,
        dataIndex: 'amountWithTaxes',
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

    const dueAmountWithTaxesCol = {
        title:     <FormattedMessage id="client-mrds-table.due_amount"/>,
        dataIndex: 'dueAmountWithTaxes',
        width:     '10%',
        align: 'right',
        render: dueAmount => {
            let strVal = Number(dueAmount).toFixed(2);

            return (
                <span>
                    { dueAmount ? 
                        `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                        : 0
                    }
                </span>
            );
        },
    };

    const orderDatetimeCol = {
        title:     <FormattedMessage id="client-mrds-table.date"/>,
        dataIndex: 'orderDatetime',
        width:     '10%',
        align: 'right',
        render:    date => (
            <FormattedDatetime datetime={ date } format={ 'DD.MM.YYYY' } />
        ),
    };

    return [
        orderNumCol,
        amountWithTaxesCol,
        dueAmountWithTaxesCol,
        orderDatetimeCol
    ];
}