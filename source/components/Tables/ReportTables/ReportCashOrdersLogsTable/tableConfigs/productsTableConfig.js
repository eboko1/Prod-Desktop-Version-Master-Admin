// vendor
import React from 'react';
import { Input } from 'antd';
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

    let count = 0;


    const noCol = {
        title:     <FormattedMessage id='report-orders-table.no' />,
        align: 'left',
        key: 'no',
        width: defWidth.no,
        render: () => count++
        // render: (empty1, empty2, index) => ( <h4>{index+1+((filter.page-1)*25)}</h4>)
    };
   
    return [
        noCol
    ];
}