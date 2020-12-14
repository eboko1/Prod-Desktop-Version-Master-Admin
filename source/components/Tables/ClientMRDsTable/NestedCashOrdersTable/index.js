//Vendor
import React from 'react';
import { Table } from 'antd';

//proj

//own
import columnsConfig from './nestedTableConfig';
import Style from './style.m.css';


export default function nestedCashOrdersTable(props) {
    const {
        fetchCashOrderEntity,
        nestedCashOrders,
        openPrint
    } = props;

    if(!nestedCashOrders) return <p>Nothing!!!(use formated message)</p>

    return <div className={Style.nestedTableContainer}>
        <Table
            size='small'
            columns={ columnsConfig({fetchCashOrderEntity, openPrint}) }
            dataSource={ nestedCashOrders }
            locale={ {
                emptyText: "No date(use formated message here!!!)",
            } }
            scroll={ { x: 1000 } }
            rowKey={ record => record.id }
            showHeader={false}//Hide title
            rowClassName={(record) => {
                if(record && record.documentType) {
                    const isIncome = (record.documentType.toString().toLowerCase() == "pay-p"); //logical expression
                    const styleStr = [Style.payDoc, isIncome? Style.payPDoc : Style.payMDoc].join(' ');
                    return styleStr;
                }
            }}
        />
    </div>
}