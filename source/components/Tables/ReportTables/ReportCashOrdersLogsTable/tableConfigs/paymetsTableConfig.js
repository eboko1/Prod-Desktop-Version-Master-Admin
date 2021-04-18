// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

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