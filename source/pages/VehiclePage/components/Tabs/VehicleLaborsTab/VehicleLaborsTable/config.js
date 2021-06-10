// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {Button, Input, Popover} from 'antd';
import { v4 } from 'uuid';
import _ from 'lodash';
import { images } from 'utils';

//Proj
import { FormattedDatetime } from 'components';
import { Numeral } from 'commons';
import { laborsSortFields } from "core/vehicles/duck";

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
        // onAddDetailToOrder,
        onServiceNameSearch,
        onDefaultNameSearch,
        onStoreGroupNameSearch,
        onEmployeeFullNameSearch,
    } = props;

    const {
        onAddLaborToOrder
    } = props;

    const orderCol = {
        title:     <FormattedMessage id='orders.order' />,
        width:     defWidth.order,
        dataIndex: 'orderNum',
        key:       laborsSortFields.orderId,
        sorter:    true,
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
        key:       laborsSortFields.datetime,
        sorter:    true,
        render:    (orderDatetime) => (
            <>
                <FormattedDatetime datetime={orderDatetime} format={DEFAULT_DATETIME}/>
            </>
        ),
    };


    const laborCol = {
        title:     () => {
            return (
                <div>
                    <FormattedMessage id="order_form_table.detail_name" />
                    <Input
                        onClick={(e) => e.stopPropagation()} //Stop trigering parent's onClick event
                        onChange={(e) => onServiceNameSearch(_.get(e, 'target.value'))}
                    />
                </div>
                )
        },
        width:     defWidth.labor,
        dataIndex: 'serviceName',
        key:       laborsSortFields.serviceName,
        sorter:    true,
    };

   const typeCol = {
        title:     () => {
            return (
                <div>
                    <FormattedMessage id="order_form_table.service_type" />
                    <Input
                        onClick={(e) => e.stopPropagation()} //Stop trigering parent's onClick event
                        onChange={(e) => onDefaultNameSearch(_.get(e, 'target.value'))}
                    />
                </div>
            )
        },
        width:     defWidth.type,
        dataIndex: 'defaultName',
        key:       laborsSortFields.defaultName,
        sorter:    true,
   };

    const storeGroupNameCol = {
        title:     () => {
            return (
                <div>
                    <FormattedMessage id='order_form_table.store_group' />
                    <Input
                        onClick={(e) => e.stopPropagation()} //Stop trigering parent's onClick event
                        onChange={(e) => onStoreGroupNameSearch(_.get(e, 'target.value'))}
                    />
                </div>
            )
        },
        width:     defWidth.begin_datetime,
        dataIndex: 'storeGroupName',
        key:       laborsSortFields.storeGroupName,
        sorter:    true,
    };

    const mechanicCol = {
        title:     () => {
            return (
                <div>
                    <FormattedMessage id='employee.is_mechanic' /> 
                    <Input
                        onClick={(e) => e.stopPropagation()} //Stop trigering parent's onClick event
                        onChange={(e) => onEmployeeFullNameSearch(_.get(e, 'target.value'))}
                    />
                </div>
            )
        },
        width:     defWidth.mechanic,
        dataIndex: 'employeeFullName',
        key:       laborsSortFields.employeeFullName,
        sorter:    true,
    };

    const normHoursCol = {
        title:     <FormattedMessage id="services_table.norm_hours" />,
        width:     defWidth.normHours,
        align:     'right',
        dataIndex: 'hours',
        key:       laborsSortFields.hours,
        sorter:    true,
    };

    const priceCol = {
        title:     <FormattedMessage id="order_form_table.price" />,
        width:     defWidth.price,
        align:     'right',
        dataIndex: 'price',
        key:       laborsSortFields.price,
        sorter:    true,
        render: (price) => {
            return (<Numeral mask={"0,00.00"}>{price}</Numeral>);
        }
    };

    const countCol = {
        title:     <FormattedMessage id='order_form_table.count' />,
        width:     defWidth.count,
        align:     'right',
        dataIndex: 'count',
        key:       laborsSortFields.count,
        sorter:    true,
    };

    const sumCol = {
        title:     <FormattedMessage id='order_form_table.sum' />,
        width:     defWidth.sum,
        align:     'right',
        dataIndex: 'sum',
        key:       laborsSortFields.sum,
        sorter:    true,
        render: (sum) => {
            return (<Numeral mask={"0,00.00"}>{sum}</Numeral>);
        }
    };

    const actionsCol = {
        width:     defWidth.actions,
        key:       v4(),
        render:    (labor) => (
            <Popover content={<FormattedMessage id="vehicle_page.hint_add_labor_to_order"/>}>
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
            </Popover>
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