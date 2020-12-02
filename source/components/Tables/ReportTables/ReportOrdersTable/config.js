// vendor
import React from 'react';
import { Icon, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// proj
import { Numeral } from 'commons';
import { FormattedDatetime } from 'components';
import book from 'routes/book';

// own
import Styles from './styles.m.css';


/* eslint-disable complexity */
export function columnsConfig(props) {

    const {
        setIncludeServicesDiscount,
        includeServicesDiscount
    } = props;

    const noCol = {
        title:     <FormattedMessage id='report-clients-table.no' />,
        // dataIndex: 'orderNum',
        render: (empty1, empty2, index) => ( <h3>{index}</h3>)
    };

    const orderNumCol = {
        title:     <FormattedMessage id='report-clients-table.order_num' />,
        dataIndex: 'orderNum',
        render: (orderNum) => ( <h3>{orderNum}</h3>)
    };
    
    const clientNameCol = {
        title:     <FormattedMessage id='report-clients-table.client_name' />,
        dataIndex: 'clientName',
        render: (clientName) => ( <h3>{clientName}</h3>)
    };
    
    const statusCol = {
        title:     <FormattedMessage id='report-clients-table.status' />,
        dataIndex: 'orderStatus',
        render: (orderStatus) => ( <h3>{orderStatus}</h3>)
    };

    const dateCol = {
        title:     <FormattedMessage id='report-clients-table.date' />,
        children: [
            {
                title: <FormattedMessage id='report-clients-table.creation_date' />,
                dataIndex: 'orderDatetime',
                render: (orderDatetime) => ( <h3>{orderDatetime}</h3>)
            },
            {
                title: <FormattedMessage id='report-clients-table.appointment_date' />,
                dataIndex: 'orderBeginDatetime',
                render: (orderBeginDatetime) => ( <h3>{orderBeginDatetime}</h3>)
            },
            {
                title: <FormattedMessage id='report-clients-table.done_date' />,
                dataIndex: 'orderSuccessDatetime',
                render: (orderSuccessDatetime) => ( <h3>{orderSuccessDatetime}</h3>)
            },
        ]
    };
    
    const sumCol = {
        title:     <FormattedMessage id='report-clients-table.sum' />,
        children: [
            {
                // title: <FormattedMessage id='report-clients-table.labors' />,
                title: () => {
                    return <div>
                        <div><FormattedMessage id='report-clients-table.labors' /></div>
                        <div><Checkbox defaultChecked={includeServicesDiscount} onChange={(e) => setIncludeServicesDiscount(e.target.checked)}/></div>
                    </div>
                },
                dataIndex: 'orderServicesSum',
                //setIncludeServicesDiscount, Checkbox
                render: (orderServicesSum) => ( <h3>{orderServicesSum}</h3>)
            },
            {
                title: <FormattedMessage id='report-clients-table.spare_parts' />,
                dataIndex: 'orderAppurtenanciesSum',
                render: (orderAppurtenanciesSum) => ( <h3>{orderAppurtenanciesSum}</h3>)
            },
            {
                title: <FormattedMessage id='report-clients-table.total' />,
                // dataIndex: 'orderServicesSum',
                render: (empty, elem) => ( <h3>{elem.orderServicesSum + elem.orderAppurtenanciesSum}</h3>)
            },
        ]
    };

    const profitCol = {
        title:     <FormattedMessage id='report-clients-table.profit' />,
        children: [
            {
                title: <FormattedMessage id='report-clients-table.labors' />,
                dataIndex: 'profitServicesSum',
                render: (profitServicesSum) => ( <h3>{profitServicesSum}</h3>)
            },
            {
                title: <FormattedMessage id='report-clients-table.spare_parts' />,
                dataIndex: 'profitAppurtenanciesSum',
                render: (profitAppurtenanciesSum) => ( <h3>{profitAppurtenanciesSum}</h3>)
            },
            {
                title: <FormattedMessage id='report-clients-table.total' />,
                // dataIndex: 'unknown',
                render: (empty, elem) => ( <h3>{elem.profitServicesSum + elem.profitAppurtenanciesSum}</h3>)
            },
        ]
    };

   
    return [
        noCol,
        orderNumCol,
        clientNameCol,
        statusCol,
        dateCol,
        sumCol,
        profitCol,
    ];
}
