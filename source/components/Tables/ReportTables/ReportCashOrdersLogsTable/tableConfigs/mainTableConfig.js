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

    const {
        fetchCashOrdersLogsReceipt,
    } = props;

    const logIdCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.log_id"/>,
        dataIndex: 'logId',
    };
   
    const operationTypeCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.operation_type"/>,
        dataIndex: 'operationType',
    };

    const CashdeskDocumentIdCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.cashdesk_document_id"/>,
        dataIndex: 'cashdeskDecumentId',
        render: (val) => (<a onClick={()=> {fetchCashOrdersLogsReceipt({receiptId: val})}}>
            {val}
        </a>)
    };
    const totalSumCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.total_sum"/>,
        dataIndex: 'totalSum',
    };
    const cashInBoxCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.cash_in_box"/>,
        dataIndex: 'cashInBox',
    };
    const serviceInputCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.service_input"/>,
        dataIndex: 'serviceInput',
    };
    const serviceOutputCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.service_output"/>,
        dataIndex: 'serviceOutput',
    };
    const cashOrderIdCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.cash_order_id"/>,
        dataIndex: 'cashOrderId',
    };
    const fiscalNumberCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.fiscal_number"/>,
        dataIndex: 'fiscalNumber',
    };
    const isDepositCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.is_deposit"/>,
        dataIndex: 'isDeposit',
    };

    return [
        logIdCol,
        operationTypeCol,
        CashdeskDocumentIdCol,
        totalSumCol,
        cashInBoxCol,
        serviceInputCol,
        serviceOutputCol,
        cashOrderIdCol,
        fiscalNumberCol,
        isDepositCol,
    ];
}