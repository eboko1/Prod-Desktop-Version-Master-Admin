// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import { v4 } from 'uuid';
import _ from 'lodash';
import { images } from 'utils';

//Proj
import { FormattedDatetime } from 'components';

//Own
import Styles from './styles.m.css';

const DEFAULT_DATETIME = 'DD.MM.YYYY HH:mm';

//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    order:                  '10%',
    datetime:               '10%',
    labor:                  '10%',
    type:                   '10%',
    storeGroupName:         '10%',
    mechanic:               '10%',
    normHours:              '10%',
    price:                  '10%',
    count:                  '5%',
    sum:                    '10%',
    actions:                '5%',
    
}

export function columnsConfig(props) {

    const {
        onAddLaborToOrder
    } = props;

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


    const laborCol = {
        title:     <FormattedMessage id="order_form_table.detail_name" />,
        width:     defWidth.labor,
        dataIndex: 'serviceName',
        key:       'serviceName',
    };

   const typeCol = {
        title:     <FormattedMessage id="order_form_table.service_type" />,
        width:     defWidth.type,
        dataIndex: 'defaultName',
        key:       'defaultName',
    };

    const storeGroupNameCol = {
        title:     <FormattedMessage id='order_form_table.store_group' />,
        width:     defWidth.begin_datetime,
        dataIndex: 'storeGroupName',
        key:       'storeGroupName',
    };

    const mechanicCol = {
        title:     <FormattedMessage id='employee.is_mechanic' /> ,
        width:     defWidth.mechanic,
        dataIndex: 'employeeFullName',
        key:       'employeeFullName',
    };

    const normHoursCol = {
        title:     <FormattedMessage id="services_table.norm_hours" />,
        width:     defWidth.normHours,
        dataIndex: 'hours',
        key:       'hours',
    };

    const priceCol = {
        title:     <FormattedMessage id="order_form_table.price" />,
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

    const actionsCol = {
        width:     defWidth.actions,
        key:       v4(),
        render:    (labor) => (
            <Button  onClick={()=>onAddLaborToOrder({labor})}>
                <div
                    style={ {
                        width:           18,
                        height:          18,
                        backgroundColor: 'var(--text3)',
                        mask:       `url(${images.wrenchIcon}) no-repeat center / contain`,
                        WebkitMask: `url(${images.wrenchIcon}) no-repeat center / contain`,
                        transform:  'scale(-1, 1)',
                    } }
                />
            </Button>
        )
    };


    return [,
        orderCol,
        datetimeCol,
        laborCol,
        typeCol,
        storeGroupNameCol,
        mechanicCol,
        normHoursCol,
        priceCol,
        countCol,
        sumCol,
        actionsCol
    ];
}