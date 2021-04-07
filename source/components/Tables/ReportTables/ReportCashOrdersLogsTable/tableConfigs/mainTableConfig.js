// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';


//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    logIdCol: '4%',
    operationTypeCol: '15%',
    cashdeskDocumentIdCol: 'auto',
    totalSumCol: '8%',

    cashInBoxCol: '8%',
    serviceInputCol: '8%',
    serviceOutputCol: '8%',

    cashOrderIdCol: '8%',
    fiscalNumberCol: '10%',
    isDepositCol: '6%',
}


export default function columnsConfig(props) {

    const {
        fetchCashOrdersLogsReceipt,
    } = props;

    const logIdCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.log_id"/>,
        dataIndex: 'logId',
        width: defWidth.logIdCol,
    };
   
    const operationTypeCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.operation_type"/>,
        dataIndex: 'operationType',
        width: defWidth.operationTypeCol,
    };

    const cashdeskDocumentIdCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.cashdesk_document_id"/>,
        dataIndex: 'cashdeskDecumentId',
        render: (val) => (<a onClick={()=> {fetchCashOrdersLogsReceipt({receiptId: val})}}> {val} </a>),
        width: defWidth.cashdeskDocumentIdCol,
    };
    const totalSumCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.total_sum"/>,
        dataIndex: 'totalSum',
        width: defWidth.totalSumCol,
    };
    const cashInBoxCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.cash_in_box"/>,
        dataIndex: 'cashInBox',
        width: defWidth.cashInBoxCol,
    };
    const serviceInputCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.service_input"/>,
        dataIndex: 'serviceInput',
        width: defWidth.serviceInputCol,
    };
    const serviceOutputCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.service_output"/>,
        dataIndex: 'serviceOutput',
        width: defWidth.serviceOutputCol,
    };
    const cashOrderIdCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.cash_order_id"/>,
        dataIndex: 'cashOrderId',
        width: defWidth.cashOrderIdCol,
    };
    const fiscalNumberCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.fiscal_number"/>,
        dataIndex: 'fiscalNumber',
        width: defWidth.fiscalNumberCol,
    };
    const isDepositCol = {
        title:     <FormattedMessage id="report_cash_orders_logs_page.is_deposit"/>,
        dataIndex: 'isDeposit',
        width: defWidth.isDepositCol,
    };

    return [
        logIdCol,
        operationTypeCol,
        cashdeskDocumentIdCol,
        totalSumCol,
        cashInBoxCol,
        serviceInputCol,
        serviceOutputCol,
        cashOrderIdCol,
        fiscalNumberCol,
        isDepositCol,
    ];
}