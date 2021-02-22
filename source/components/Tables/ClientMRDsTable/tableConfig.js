//Vendor
import React from 'react';
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';

//proj
import { Numeral } from "commons";
import { FormattedDatetime } from 'components';
import book from "routes/book";

export default function columnsConfig(props) {
    
    const orderNumCol = {
        title:     <FormattedMessage id="client-mrds-table.mrd_number"/>,
        dataIndex: 'orderNum',
        width:     'auto',
        align: 'right',
        render:    (orderNum, mrd) => (
            <Link
                to={`${book.order}/${mrd.orderId}`}
            >
                {orderNum}
            </Link>
        ),
    };

    const orderDatetimeCol = {
        title:     <FormattedMessage id="client-mrds-table.date"/>,
        dataIndex: 'orderDatetime',
        width:     'auto',
        align: 'right',
        render:    date => (
            <FormattedDatetime datetime={ date } format={ 'DD.MM.YYYY' } />
        ),
    };

    const amountWithTaxesCol = {
        title:     <FormattedMessage id="client-mrds-table.amount"/>,
        dataIndex: 'amountWithTaxes',
        width:     'auto',
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
        width:     'auto',
        align: 'right',
        render: (dueAmount, row) => {
            let strVal = Number(dueAmount).toFixed(2);

            return (
                <>
                    {Boolean(dueAmount) && 
                        <Icon
                            type='dollar'
                            onClick={()=>{
                                props.showCashOrderModal(row);
                            }}
                            className={'dollar-icon'}
                        />
                    }
                    <span>
                        { dueAmount ? 
                            `${strVal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            : 0
                        }
                    </span>
                </>
            );
        },
    };

    return [
        orderNumCol,
        orderDatetimeCol,
        amountWithTaxesCol,
        dueAmountWithTaxesCol,
    ];
}