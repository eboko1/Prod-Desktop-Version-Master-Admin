// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

//Proj

//Own
import Styles from './styles.m.css';


//Choose width for each column
const defWidth = {
    korText:            '20%',
    itemmpText:         '25%',
    qualColText:        '10%',
    storeGroupName:      '18%',
    price:              '10%',
    workTime:           '7%',
    sum:                '10%',
}

export function columnsConfig() {

    const korTextCol = {
        title:     <FormattedMessage id="order_form_table.service_type" />,
        width:     defWidth.korText,
        dataIndex: 'korText',
        key:       'korText',
    };

    const itemmpTextCol = {
        title:     <FormattedMessage id='services_table.service_type' />,
        width:     defWidth.itemmpText,
        dataIndex: 'itemmpText',
        key:       'itemmpText',
    };
    const qualColTextCol = {
        title:     <FormattedMessage id='array-break-schedule.comment' />,
        width:     defWidth.qualColText,
        dataIndex: 'qualColText',
        key:       'qualColText',
    };

    const storeGroupNameCol = {
        title:     <FormattedMessage id='array-break-schedule.store_group' />,
        width:     defWidth.storeGroupName,
        dataIndex: 'storeGroupName',
        key:       'storeGroupName',
    };

    const priceCol = {
        title:     <FormattedMessage id='order_form_table.price' />,
        width:     defWidth.price,
        align:     'right',
        dataIndex: 'price',
        key:       'price',
    };
    
    const workTimCol = {
        title:     <FormattedMessage id='services_table.norm_hours' />,
        width:     defWidth.workTime,
        align:     'right',
        dataIndex: 'workTime',
        key:       'workTime',
    };

    const sumCol = {
        title:     <FormattedMessage id='orders.sum' />,
        width:     defWidth.sum,
        align:     'right',
        dataIndex: 'sum',
        key:       'sum',
    };


    return [
        korTextCol,
        itemmpTextCol,
        qualColTextCol,
        storeGroupNameCol,
        priceCol,
        workTimCol,
        sumCol,
    ];
}