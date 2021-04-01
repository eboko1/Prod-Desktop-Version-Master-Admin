// vendor
import React from 'react';
import { Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { Numeral } from 'commons';

// own
import Styles from './../styles.m.css';

/* eslint-disable complexity */
export default function columnsConfig(props) {
    const productIdCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.product_id"/>,
        dataIndex: 'productId',
    };
   
    const productNameCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.product_name"/>,
        dataIndex: 'name',
    };

    const productAmountCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.product_amount"/>,
        dataIndex: 'amount',
    };
    const productPriceCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.product_price"/>,
        dataIndex: 'price',
    };
    const productCostCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.product_cost"/>,
        dataIndex: 'cost',
    };
    const productSumDiscountCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.product_sum_discount"/>,
        dataIndex: 'sumDiscount',
    };
    const productLettersCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.product_letters"/>,
        dataIndex: 'letters',
    };
    const productTaxPercentageCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.product_tax_percentage"/>,
        dataIndex: 'taxPervent',
    };
    const productExcisePercentageCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.product_excise_percentage"/>,
        dataIndex: 'excisePervent',
    };
    const productCodeCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.product_code"/>,
        dataIndex: 'code',
    };
    const productUnitCodeCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.product_unit_code"/>,
        dataIndex: 'unitCode',
    };
    const productUnitNameCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.product_unit_name"/>,
        dataIndex: 'unitName',
    };

    return [
        productIdCol,
        productNameCol,
        productAmountCol,
        productPriceCol,
        productCostCol,
        productSumDiscountCol,
        productLettersCol,
        productTaxPercentageCol,
        productExcisePercentageCol,
        productCodeCol,
        productUnitCodeCol,
        productUnitNameCol,
    ];
}