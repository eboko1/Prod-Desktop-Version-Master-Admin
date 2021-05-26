// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

//Proj
import book from 'routes/book';
import { Numeral, OrdersStatusesMapper } from "commons";
import { OrderStatusIcon, RepairMapIndicator, FormattedDatetime } from 'components';

//Own
import Styles from './styles.m.css';


//Choose width for each column
const defWidth = {
    korText:            '20%',
    itemmpText:         '25%',
    qualColText:        '15%',
    price:              '10%',
    workTime:           '15%',
    sum:                '15%',
}

export function columnsConfig() {

    const korTextCol = {
        title:     <FormattedMessage id='orders.korText' />,
        width:     defWidth.korText,
        dataIndex: 'korText',
        key:       'korText',
    };

    const itemmpTextCol = {
        title:     <FormattedMessage id='orders.itemmpText' />,
        width:     defWidth.itemmpText,
        dataIndex: 'itemmpText',
        key:       'itemmpText',
    };
    const qualColTextCol = {
        title:     <FormattedMessage id='orders.qualColText' />,
        width:     defWidth.qualColText,
        dataIndex: 'qualColText',
        key:       'qualColText',
    };
    const workTimCol = {
        title:     <FormattedMessage id='orders.workTime' />,
        width:     defWidth.workTime,
        dataIndex: 'workTime',
        key:       'workTime',
    };

    const priceCol = {
        title:     <FormattedMessage id='orders.price' />, // should be translation
        width:     defWidth.price,
        dataIndex: 'price',
        key:       'price',
    };

    const sumCol = {
        title:     <FormattedMessage id='orders.sum' />, // should be translation
        width:     defWidth.sum,
        dataIndex: 'sum',
        key:       'sum',
    };


    return [
        korTextCol,
        itemmpTextCol,
        qualColTextCol,
        priceCol,
        workTimCol,
        sumCol,
    ];
}