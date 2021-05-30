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

const DEFAULT_DATETIME = 'DD.MM.YYYY HH:mm';

//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    order:               'auto',
    datetime:            '10%',
    name:                '10%',
    brandName:             '10%',
    code:                    '10%',
    supplierName:       '10%',
    purchasePrice:         '10%',
    price:         '10%',
    count:         '10%',
    sum:         '10%',
    
}

export function columnsConfig() {

    const orderCol = {
        title:     <FormattedMessage id='orders.order' />,
        width:     defWidth.order,
        dataIndex: 'orderNum',
        key:       'orderNum',
        render:    (orderNum) => (
            <>
                {orderNum}
            </>
        ),
    };

    const datetimeCol = {
        title:     <FormattedMessage id='orders.creation_date' />,
        width:     defWidth.datetime,
        dataIndex: 'orderDatetime',
        key:       'orderDatetime',
        render:    (orderDatetime) => (
            <>
                <FormattedDatetime datetime={orderDatetime} format={DEFAULT_DATETIME}/>
            </>
        ),
    };


    const codeCol = {
        title:     <FormattedMessage id='order_form_table.product_code' />,
        width:     defWidth.code,
        dataIndex: 'code',
        key:       'code',
    };

   const brandNameCol = {
        title:     <FormattedMessage id='order_form_table.brand' />,
        width:     defWidth.brandName,
        dataIndex: 'supplierBrandName',
        key:       'supplierBrandName',
    };

    const nameCol = {
        title:     <FormattedMessage id='storage.product_name' />,
        width:     defWidth.name,
        dataIndex: 'name',
        key:       'name',
    };

    const supplierNameCol = {
        title:     <FormattedMessage id='storage.business_supplier' />,
        width:     defWidth.supplierName,
        dataIndex: 'supplierName',
        key:       'supplierName',
    };


    const purchasePriceCol = {
        title:     <FormattedMessage id='storage.purchase_price' />,
        width:     defWidth.purchasePrice,
        dataIndex: 'purchasePrice',
        key:       'purchasePrice',
    };

    const priceCol = {
        title:     <FormattedMessage id='storage.selling_price' />,
        width:     defWidth.price,
        dataIndex: 'price',
        key:       'price',
    };

    const countCol = {
        title:     <FormattedMessage id='order_form_table.count' />,
        width:     defWidth.count,
        dataIndex: 'count',
        key:       'count',
    };

    const sumCol = {
        title:     <FormattedMessage id='order_form_table.sum' />,
        width:     defWidth.sum,
        dataIndex: 'sum',
        key:       'sum',
    };


    return [,
        orderCol,
        datetimeCol,
        codeCol,
        brandNameCol,
        nameCol,
        supplierNameCol,
        purchasePriceCol,
        priceCol,
        countCol,
        sumCol
    ];
}