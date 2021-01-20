// vendor
import React from 'react';
import { Input, Icon, Checkbox, Menu, Dropdown, Button } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import _ from 'lodash';

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

//This formats number to make it appearance better
const formatNumber = (number, precision = 0) => {
    return (
        number
        ? Number(number).toFixed(precision).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        : Number(0).toFixed(precision)
    )
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
                render: (text, record, index) => {
                    return <div>{index+1}</div>;
                }
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
                dataIndex: 'vehicles',
                render: (vehicles) => {
                    return <div>
                        {vehicles
                            ? vehicles.map((elem) => {
                                const {vehicleNumber, vehicleMake, vehicleModel, vehicleModification, vehicleYear} = elem;
                                return (<div className={ Styles.clientVehicle }>                                    
                                    <span className={ Styles.vehicleNum }>
                                        {
                                            vehicleNumber
                                            ? `${vehicleNumber} -`
                                            : '-'
                                        }
                                    </span>
                                    <span>
                                        { vehicleMake } { vehicleModel }{ ' ' }
                                        { vehicleModification } ({ vehicleYear })
                                    </span>
                                </div>)
                            })
                            : "-"
                        }
                    </div>;
                }
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
                render: (clientName, record) => {
                    const {clientPhones, clientId} = record;
                    return <div className={ Styles.clientName }>
                        <div>
                            <Link
                                className={ Styles.clientName }
                                to={`${book.client}/${clientId}`}
                            > {clientName} </Link>
                        </div>
                        <div>
                        {clientPhones
                            ? clientPhones.map((elem) => {
                                return (<div>
                                    <div>
                                        <a  className={ Styles.clientPhone } href={ `tel:${elem}` }>
                                            {elem}
                                        </a>
                                    </div>
                                </div>)
                            })
                            : "-"
                        }
                    </div>
                    </div>;
                }
            }
        ]
    };

    const orderCol = {
        title:     <FormattedMessage id='report_load_kpi_page.order' />,
        children: [
            {
                title: () => {
                    return (
                        <FormattedMessage id={'report_load_kpi_page.planner'} />
                    )
                },
                align: 'right',
                key: 'order_planner',
                width: defWidth.order_planner,
                dataIndex: 'totalDuration',
                render: (totalDuration) => {
                    return <div>{formatNumber(totalDuration, 1)}</div>
                }
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
                dataIndex: 'laborsPlan',
                render: (laborsPlan) => {
                    return <div>{formatNumber(laborsPlan, 1)}</div>
                }
            },
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id={'report_load_kpi_page.labors_actual'} />
                        </div>
                    )
                },
                align: 'right',
                key: 'order_labors_actual',
                width: defWidth.order_labors_actual,
                dataIndex: 'workingTime',
                render: (workingTime) => {
                    return <div>{formatNumber(workingTime, 1)}</div>
                }
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
                dataIndex: 'stoppedTime',
                render: (stoppedTime) => {
                    return <div>{formatNumber(stoppedTime, 1)}</div>;
                }
            },
        ]
    };
    
    const locationsCol = {
        title:     <FormattedMessage id='report_load_kpi_page.location' />,
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
                dataIndex: 'internalParkingDuration',
                render: (internalParkingDuration) => {
                    return <div>{formatNumber(internalParkingDuration, 1)}</div>;
                }
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
                dataIndex: 'externalParkingDuration',
                render: (externalParkingDuration) => {
                    return <div>{formatNumber(externalParkingDuration, 1)}</div>;
                }
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
                dataIndex: 'workPostParkingDuration',
                render: (workPostParkingDuration) => {
                    return <div>{formatNumber(workPostParkingDuration, 1)}</div>;
                }
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
                dataIndex: 'otherParkingDuration',
                render: (otherParkingDuration) => {
                    return <div>{formatNumber(otherParkingDuration, 1)}</div>;
                }
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
                render: (text, record) => {
                    const {
                        internalParkingDuration,
                        externalParkingDuration,
                        workPostParkingDuration,
                        otherParkingDuration
                    } = record;
                    const val = _.sum([internalParkingDuration, externalParkingDuration, workPostParkingDuration, otherParkingDuration]);
                    return <div>{formatNumber(val, 1)}</div>;
                }
            },
        ]
    };

    const efficiencyCol = {
        title:     <FormattedMessage id={'report_load_kpi_page.efficiency'} />,
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
                render: (item, record) => {
                    const {
                        laborsPlan,
                        workingTime
                    } = record;
                    const val = workingTime? (laborsPlan/workingTime): undefined;//Remove dividing by zero
                    return <div>{val? formatNumber(val, 2): "-"}</div>
                }
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
                render: (item, record) => {
                    const {
                        workingTime,
                        stoppedTime
                    } = record;
                    const val = workingTime/(workingTime+stoppedTime);
                    return <div>{val? formatNumber(val, 2): "-"}</div>
                }
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
                dataIndex: 'profitAppurtenanciesSum',
                render: (item, record) => {
                    const {
                        internalParkingDuration,
                        externalParkingDuration,
                        workPostParkingDuration,
                        otherParkingDuration,
                        workingTime
                    } = record;
                    const val = workingTime/_.sum([internalParkingDuration, externalParkingDuration, workPostParkingDuration, otherParkingDuration]);
                    return <div>{val? formatNumber(val, 2): "-"}</div>
                }
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