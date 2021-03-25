// vendor
import React from 'react';
import { Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { Numeral } from 'commons';

// own
import Styles from './styles.m.css';

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
export function columnsConfig(props) {

    let count = 0;


    const noCol = {
        title:     <FormattedMessage id='report-orders-table.no' />,
        align: 'left',
        key: 'no',
        width: defWidth.no,
        render: () => count++
        // render: (empty1, empty2, index) => ( <h4>{index+1+((filter.page-1)*25)}</h4>)
    };

    const col1 = {
        title:     'ID',
        dataIndex: 'id',
    };

    const col2 = {
        title:     'Cash order number',
        dataIndex: 'cashOrderNumber',
    };

    const col22 = {
        title: 'Order number',
        dataIndex: 'orderNumber'
    }

    const col3 = {
        title:     'Data',
        dataIndex: 'data',
    };

    const col4 = {
        title:     'Sum',
        dataIndex: 'sum',
    };

    const col5 = {
        title:     'Fiscal',
        dataIndex: 'fiscal',
    };
   
    return [
        noCol,
        col1,
        col2,
        col22,
        col3,
        col4,
        col5
    ];
}