// vendor
import React from 'react';
import { Input, Icon, Checkbox, Menu, Dropdown, Button } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// proj
import { Numeral } from 'commons';
import { FormattedDatetime, DateRangePicker } from 'components';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

const DEF_DATE_FORMAT = 'YYYY/MM/DD';

const statuses = {
    required: 'transfer_required',
    reserve: 'transfer_reserve',
    not_complete: 'transfer_not_complete',
    approve: 'transfer_approve',
    progress: 'transfer_progress',
    success: 'transfer_success',
}

//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    no: '4%',
    client_vehicle: '10%',
    client_name: 'auto',

    order_planner: '6%',
    order_labors_plan: '6%',
    order_labors_actual: '6%',
    order_breaks: '6%',
    
    location_internal_parking: '6%',
    location_external_parking: '6%',
    location_department: '6%',
    location_test_drive: '6%',
    location_total: '6%',

    efficiency_plan: '6%',
    efficiency_department: '6%',
    efficiency_station: '6%'
}

/* eslint-disable complexity */
export function columnsConfig() {

    const noCol = {
        children: [
            {
                title:     <FormattedMessage id='report_load_kpi_page.no' />,
                align: 'left',
                key: 'no',
                width: defWidth.no,
            }
        ]
    };

    const clientVehicleCol = {
        children: [
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id='report_load_kpi_page.vehicle' />
                        </div>
                    )
                },
                align: 'left',
                key: 'client_vehicle',
                width: defWidth.client_vehicle,
                dataIndex: 'orderNum',
                
            }
        ]
    };
    
    const clientNameCol = {
        children: [
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id='report_load_kpi_page.client_name' />
                        </div>
                    )
                },
                align: 'left',
                key: 'client_name',
                width: defWidth.client_name,
                dataIndex: 'clientName',
                
            }
        ]
    };

    const orderCol = {
        title:     <FormattedMessage id='report_load_kpi_page.order' />,
        key: 'date',
        children: [
            {
                title: () => {
                    return (
                        <FormattedMessage id={'report_load_kpi_page.planner'} />
                    )
                },
                align: 'left',
                key: 'order_planner',
                width: defWidth.order_planner,
                dataIndex: 'orderStatus',
            },
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id={'report_load_kpi_page.labors_plan'} />
                        </div>
                    )
                },
                align: 'right',
                key: 'order_labors_plan',
                width: defWidth.order_labors_plan,
                dataIndex: 'orderDatetime',
            },
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id={'report_load_kpi_page.labors_actial'} />
                        </div>
                    )
                },
                align: 'right',
                key: 'order_labors_actual',
                width: defWidth.order_labors_actual,
                dataIndex: 'orderBeginDatetime',
            },
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id={'report_load_kpi_page.breaks'} />
                        </div>
                    )
                },
                align: 'right',
                key: 'order_breaks',
                width: defWidth.order_breaks,
                dataIndex: 'orderSuccessDatetime',
            },
        ]
    };
    
    const locationsCol = {
        title:     <FormattedMessage id='report_load_kpi_page.location' />,
        key: 'sum',
        children: [
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id={'report_load_kpi_page.internal_parking'} />
                        </div>
                    )
                },
                align: 'right',
                key: 'location_internal_parking',
                width: defWidth.location_internal_parking,
                dataIndex: 'orderServicesSum',
            },
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id={'report_load_kpi_page.external_parking'} />
                        </div>
                    )
                },
                align: 'right',
                key: 'location_external_parking',
                width: defWidth.location_external_parking,
                dataIndex: 'orderAppurtenanciesSum',
            },
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id={'report_load_kpi_page.department'} />
                        </div>
                    )
                },
                align: 'right',
                key: 'location_department',
                width: defWidth.location_department,
            },
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id={'report_load_kpi_page.test_drive'} />
                        </div>
                    )
                },
                align: 'right',
                key: 'location_test_drive',
                width: defWidth.location_test_drive,
            },
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id={'report_load_kpi_page.total'} />
                        </div>
                    )
                },
                align: 'right',
                key: 'location_total',
                width: defWidth.location_total,
            },
        ]
    };

    const efficiencyCol = {
        title:     <FormattedMessage id={'report_load_kpi_page.efficiency'} />,
        key: 'profit',
        children: [
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id={'report_load_kpi_page.plan'} />
                        </div>
                    )
                },
                align: 'right',
                key: 'efficiency_plan',
                width: defWidth.efficiency_plan,
                dataIndex: 'profitServicesSum',
            },
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id={'report_load_kpi_page.department'} />
                        </div>
                    )
                },
                align: 'right',
                key: 'efficiency_department',
                width: defWidth.efficiency_department,
                dataIndex: 'profitAppurtenanciesSum',
            },
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id={'report_load_kpi_page.station'} />
                        </div>
                    )
                },
                align: 'right',
                key: 'efficiency_station',
                width: defWidth.efficiency_station,
            },
        ]
    };
    return [
        noCol,
        clientVehicleCol,
        clientNameCol,
        orderCol,
        locationsCol,
        efficiencyCol,
        
    ];
}