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

    const noCol = {
        title:     <FormattedMessage id='report-clients-table.no' />,
        width: '4%',
        render: (empty1, empty2, index) => ( <h4>{index+1}</h4>)
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
                render: (orderDatetime) => (<FormattedDatetime datetime={ orderDatetime } format={ 'DD.MM.YY HH:mm' } />)
            },
            {
                title: <FormattedMessage id='report-clients-table.appointment_date' />,
                dataIndex: 'orderBeginDatetime',
                render: (orderBeginDatetime) => (<FormattedDatetime datetime={ orderBeginDatetime } format={ 'DD.MM.YY HH:mm' } />)
            },
            {
                title: <FormattedMessage id='report-clients-table.done_date' />,
                dataIndex: 'orderSuccessDatetime',
                render: (orderSuccessDatetime) => (<FormattedDatetime datetime={ orderSuccessDatetime } format={ 'DD.MM.YY HH:mm' } />)
            },
        ]
    };
    
    const sumCol = {
        title:     <FormattedMessage id='report-clients-table.sum' />,
        children: [
            {
                title: <FormattedMessage id='report-clients-table.labors' />,
                dataIndex: 'orderServicesSum',
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
                render: (empty, elem) => ( <h3>{elem.profitServicesSum + elem.profitAppurtenanciesSum}</h3>)
            },
        ]
    };

    //percentage
    const marginCol = {
        title:     <FormattedMessage id='report-clients-table.margin' />,
        children: [
            {
                title: <FormattedMessage id='report-clients-table.labors' />,
                render: (empty, elem) => {
                    if(!elem.orderServicesSum || !elem.profitServicesSum) return "-";

                    const val = (elem.profitServicesSum * 100)/elem.orderServicesSum;
                    return  <span>
                        { val ? 
                            Number(val).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            : 0
                        }
                    </span>
                }
            },
            {
                title: <FormattedMessage id='report-clients-table.spare_parts' />,
                render: (empty, elem) => {
                    if(!elem.orderAppurtenanciesSum || !elem.profitAppurtenanciesSum) return "-";

                    const val = (elem.profitAppurtenanciesSum * 100)/elem.orderAppurtenanciesSum;
                    return  <span>
                        { val ? 
                            Number(val).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            : 0
                        }
                    </span>
                }
            },
            {
                title: <FormattedMessage id='report-clients-table.total' />,
                render: (empty, elem) => {
                    if((!elem.orderAppurtenanciesSum || !elem.profitAppurtenanciesSum) && (!elem.orderServicesSum || !elem.profitServicesSum)) return "-";

                    const val = ((elem.profitAppurtenanciesSum + elem.profitServicesSum) * 100)/(elem.orderServicesSum + elem.orderAppurtenanciesSum);
                    return <span>
                        { val ? 
                            Number(val).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            : 0
                        }
                    </span>
                }
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
        marginCol
    ];
}
