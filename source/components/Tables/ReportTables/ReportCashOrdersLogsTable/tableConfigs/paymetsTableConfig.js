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

    const paymentIdCol = {
        title: <FormattedMessage id="report_cash_orders_logs_page.payment_id"/>,
        dataIndex: 'paymentId'
    }
   
    const paymentCodeCol = {
        title: <FormattedMessage id="report_cash_orders_logs_page.payment_code"/>,
        dataIndex: 'code'
    }

    const paymentNameCol = {
        title: <FormattedMessage id="report_cash_orders_logs_page.payment_name"/>,
        dataIndex: 'name'
    }

    const paymentSumCol = {
        title: <FormattedMessage id="report_cash_orders_logs_page.payment_sum"/>,
        dataIndex: 'sum'
    }

    const paymentProvidedSumCol = {
        title: <FormattedMessage id="report_cash_orders_logs_page.payment_provided_sum"/>,
        dataIndex: 'providedSum'
    }
    return [
        paymentIdCol,
        paymentCodeCol,
        paymentNameCol,
        paymentSumCol,
        paymentProvidedSumCol
    ];
}