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
    const col1 = {
        title:     'productId',
        dataIndex: 'productId',
    };
   
    const col2 = {
        title:     'name',
        dataIndex: 'name',
    };

    const col3 = {
        title:     'amount',
        dataIndex: 'amount',
    };
    const col4 = {
        title:     'price',
        dataIndex: 'price',
    };
    const col5 = {
        title:     'cost',
        dataIndex: 'cost',
    };
    const col6 = {
        title:     'sumDiscount',
        dataIndex: 'sumDiscount',
    };
    const col7 = {
        title:     'letters',
        dataIndex: 'letters',
    };
    const col8 = {
        title:     'taxPervent',
        dataIndex: 'taxPervent',
    };
    const col9 = {
        title:     'excisePervent',
        dataIndex: 'excisePervent',
    };
    const col10 = {
        title:     'code',
        dataIndex: 'code',
    };
    const col11 = {
        title:     'unitCode',
        dataIndex: 'unitCode',
    };
    const col12 = {
        title:     'unitName',
        dataIndex: 'unitName',
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
        col11,
        col12,
    ];
}