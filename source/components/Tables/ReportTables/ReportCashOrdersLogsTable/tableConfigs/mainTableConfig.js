// vendor
import React from 'react';
import { Input, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { Numeral } from 'commons';

// own
import Styles from './../styles.m.css';

//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    no: '4%',
    client_name: 'auto',
    order_num: '10%',
    status: '10%',

    date_created: '6%',
    date_appointment: '6%',
    date_done: '6%',

    sum_labors: '5%',
    sum_parts: '5%',
    sum_total: '5%',

    profit_labors: '5%',
    profit_parts: '5%',
    profit_total: '5%',

    margin_labors: '5%',
    margin_parts: '5%',
    margin_total: '5%'
}

/* eslint-disable complexity */
export default function columnsConfig(props) {

    const {fetchCashOrdersLogsReceipt} = props;

    const col1 = {
        title:     'logId',
        dataIndex: 'logId',
    };
   
    const col2 = {
        title:     'operationType',
        dataIndex: 'operationType',
    };

    const col3 = {
        title:     'cashdeskDecumentId',
        dataIndex: 'cashdeskDecumentId',
        render: (val) => (<a onClick={()=> {fetchCashOrdersLogsReceipt({receiptId: val})}}>
            {val}
        </a>)
    };
    const col4 = {
        title:     'totalSum',
        dataIndex: 'totalSum',
    };
    const col5 = {
        title:     'cashInBox',
        dataIndex: 'cashInBox',
    };
    const col6 = {
        title:     'serviceInput',
        dataIndex: 'serviceInput',
    };
    const col7 = {
        title:     'serviceOutput',
        dataIndex: 'serviceOutput',
    };
    const col8 = {
        title:     'cashOrderId',
        dataIndex: 'cashOrderId',
    };
    const col9 = {
        title:     'fiscalNumber',
        dataIndex: 'fiscalNumber',
    };
    const col10 = {
        title:     'isDeposit',
        dataIndex: 'isDeposit',
    };

    return [
        col1,
        col2,
        col3,
        col4,
        col5,
        col6,
        col7,
        col8,
        col9,
        col10,
    ];
}