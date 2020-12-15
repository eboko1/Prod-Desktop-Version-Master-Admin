// vendor
import React from 'react';
import { Input, Icon, Checkbox, DatePicker, Menu, Dropdown, Button } from 'antd';
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
const DEF_UI_DATE_FORMAT = 'DD/MM/YYYY';

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
    client_name: 'auto',
    order_num: '10%',
    status: '8%',

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
export function columnsConfig(props) {

    const {
        filterControls,
        filter,
    } = props;

    const {
        fetchReportOrders,

        setReportOrdersIncludeServicesDiscount,
        setReportOrdersIncludeAppurtenanciesDiscount,
        includeServicesDiscount,
        includeAppurtenanciesDiscount,

        setReportOrdersQuery,
        setReportOrdersStatus,
        setReportOrdersCreationFromDate,
        setReportOrdersCreationToDate,
        setReportOrdersAppointmentFromDate,
        setReportOrdersAppointmentToDate,
        setReportOrdersDoneFromDate,
        setReportOrdersDoneToDate,
    } = filterControls;

    

    //Handlers---------------------------------------------------------------
    function onIncludeLaborsDiscountChanged(e) {
        setReportOrdersIncludeServicesDiscount(e.target.checked);
        fetchReportOrders();
    }

    function onIncludeAppurtenanciesDiscountChanged(e) {
        setReportOrdersIncludeAppurtenanciesDiscount(e.target.checked);
        fetchReportOrders();
    }

    function onSearchInput(e) {
        setReportOrdersQuery(e.target.value.toLowerCase().trim());
        fetchReportOrders();
    }

    function onCreationFromDateChanged(date) {
        setReportOrdersCreationFromDate(date? date.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    }

    function onCreationToDateChanged(date) {
        setReportOrdersCreationToDate(date? date.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    }

    function onAppointmentFromDateChanged(date) {
        setReportOrdersAppointmentFromDate(date? date.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    }

    function onAppointmentToDateChanged(date) {
        setReportOrdersAppointmentToDate(date? date.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    }

    function onDoneFromDateChanged(date) {
        setReportOrdersDoneFromDate(date? date.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    }

    function onDoneToDateChanged(date) {
        setReportOrdersDoneToDate(date? date.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    }

    const setCreationDaterange = daterange => {
        const [ startDate, endDate ] = daterange;
        setReportOrdersCreationFromDate(startDate? startDate.format(DEF_DATE_FORMAT): undefined);
        setReportOrdersCreationToDate(endDate? endDate.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    };

    const setAppointmentDaterange = daterange => {
        const [ startDate, endDate ] = daterange;
        setReportOrdersAppointmentFromDate(startDate? startDate.format(DEF_DATE_FORMAT): undefined);
        setReportOrdersAppointmentToDate(endDate? endDate.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    };

    const setDoneDaterange = daterange => {
        const [ startDate, endDate ] = daterange;
        setReportOrdersDoneFromDate(startDate? startDate.format(DEF_DATE_FORMAT): undefined);
        setReportOrdersDoneToDate(endDate? endDate.format(DEF_DATE_FORMAT): undefined);
        fetchReportOrders();
    };

    const onSelectStatus = e => {
        setReportOrdersStatus((e.key != 'reset')? e.key: undefined);
        fetchReportOrders();
    }

    const onClearDateCreatedFilter = () => {
        setCreationDaterange([undefined, undefined]);
    }

    const onClearDateAppointmentFilter = () => {
        setAppointmentDaterange([undefined, undefined]);
    }

    const onClearDateDoneFilter = () => {
        setDoneDaterange([undefined, undefined]);
    }

    //-----------------------------------------------------------------------

    const activeCreationDateFilter = (filter.creationFromDate || filter.creationToDate); //Check if filter has value
    const activeAppointmentDateFilter = (filter.appointmentFromDate || filter.appointmentToDate); //Check if filter has value
    const activeDoneDateFilter = (filter.doneFromDate || filter.doneToDate); //Check if filter has value

    //Get corresponging status value
    const statusLangMapper = status => {
        switch(status.toLowerCase()) {
            case 'required': return <FormattedMessage id={statuses.required} />;
            case 'reserve': return <FormattedMessage id={statuses.reserve} />;
            case 'not_complete': return <FormattedMessage id={statuses.not_complete} />;
            case 'approve': return <FormattedMessage id={statuses.approve} />;
            case 'progress': return <FormattedMessage id={statuses.progress} />;
            case 'success': return <FormattedMessage id={statuses.success} />;
            case 'reset': return <FormattedMessage id='report-orders-table.reset' />;
            default: return <FormattedMessage id="report-orders-table.unknown_status" />;
        }
    }

    const menu = (
        <Menu onClick={onSelectStatus}>
            <Menu.Item key="required">
                {statusLangMapper('required')}
            </Menu.Item>
            <Menu.Item key="reserve">
                {statusLangMapper('reserve')}
            </Menu.Item>
            <Menu.Item key="not_complete">
                {statusLangMapper('not_complete')}
            </Menu.Item>
            <Menu.Item key="approve">
                {statusLangMapper('approve')}
            </Menu.Item>
            <Menu.Item key="progress">
                {statusLangMapper('progress')}
            </Menu.Item>
            <Menu.Item key="success">
                {statusLangMapper('success')}
            </Menu.Item>
            <Menu.Item key="reset">
                {statusLangMapper('reset')}
            </Menu.Item>
        </Menu>
      );


    const noCol = {
        children: [
            {
                title:     <FormattedMessage id='report-orders-table.no' />,
                align: 'left',
                key: 'no',
                width: defWidth.no,
                render: (empty1, empty2, index) => ( <h4>{index+1+((filter.page-1)*25)}</h4>)
            }
        ]
    };

    const orderNumCol = {
        children: [
            {
                title:     <FormattedMessage id='report-orders-table.order_num' />,
                align: 'left',
                key: 'order_num',
                width: defWidth.order_num,
                dataIndex: 'orderNum',
                render: (orderNum, elem) => ( <h3>
                    <Link
                        to={ `${book.order}/${elem.orderId}` }
                    >
                        {orderNum}
                    </Link>
                    
                </h3>)
            }
        ]
    };
    
    const clientNameCol = {
        children: [
            {
                title:  <div className={Styles.filterColumnHeaderWrap}>
                            <FormattedMessage id='report-orders-table.client_name' />
                            <Input onChange={onSearchInput} placeholder="Search"/>
                        </div>,
                align: 'left',
                // width: '20%',
                key: 'client_name',
                width: defWidth.client_name,
                dataIndex: 'clientName',
                render: (clientName, elem) => (
                    <div>
                        <div className={ Styles.clientName }>
                            <Link
                                className={ Styles.clientName }
                                to={`${book.client}/${elem.orderClientId}`}
                            > {clientName} </Link>
                        </div>
                        <div className={ Styles.clientVehicle }>
                            { `${elem.vehicleMake ||
                                '-'} ${elem.vehicleModel ||
                                '-'} ${elem.vehicleYear || '-'}` }
                        </div>
                        <a
                            className={ Styles.clientPhone }
                            href={ `tel:${elem.clientPhone}` }
                        >
                            { elem.clientPhone || '-' }
                        </a>
                    </div>
                    
                )
            }
        ]
    };
    
    const statusCol = {
        children: [
            {
                title: <div className={Styles.filterColumnHeaderWrap}>
                    <FormattedMessage id='report-orders-table.status' />
                    <br />
                    <Dropdown className={Styles.statusDropdown} overlay={menu}>
                        <Button>
                            {statusLangMapper(filter.status ? filter.status: "reset")} <Icon type="down" /> 
                        </Button>
                    </Dropdown>
                </div>,
                align: 'left',
                key: 'status',
                width: defWidth.status,
                dataIndex: 'orderStatus',
                render: (orderStatus) => ( <h3>{statusLangMapper(orderStatus)}</h3>)
            }
        ]
    };

    const dateCol = {
        title:     <FormattedMessage id='report-orders-table.date' />,
        key: 'date',
        children: [
            {
                title: <div  className={Styles.filterColumnHeaderWrap}>
                    <FormattedMessage id='report-orders-table.creation_date' />
                    <br />
                    <div className={Styles.storageDateFilter}>
                        <DateRangePicker
                            minimize
                            style={{margin: 0}}//prevent default space
                            dateRange={[moment(filter.creationFromDate), moment(filter.creationToDate)]}
                            onDateChange={ setCreationDaterange }
                        />
                        {activeCreationDateFilter
                            && <div className={Styles.clearIconCont}>
                                <Icon onClick={onClearDateCreatedFilter} className={Styles.clearIcon} type="close-circle" />
                            </div>
                        }
                    </div>
                </div>,
                align: 'right',
                key: 'creation_date',
                width: defWidth.date_created,
                dataIndex: 'orderDatetime',
                render: (orderDatetime) => (<FormattedDatetime datetime={ orderDatetime } format={ 'DD.MM.YY HH:mm' } />)
            },
            {
                title: <div  className={Styles.filterColumnHeaderWrap}>
                    <FormattedMessage id='report-orders-table.appointment_date' />
                    <br />
                    <div className={Styles.storageDateFilter}>
                        <DateRangePicker
                            minimize
                            style={{margin: 0}}//prevent default space
                            dateRange={[moment(filter.appointmentFromDate), moment(filter.appointmentToDate)]}
                            onDateChange={ setAppointmentDaterange }
                        />
                        {activeAppointmentDateFilter
                            && <div className={Styles.clearIconCont}>
                                <Icon onClick={onClearDateAppointmentFilter} className={Styles.clearIcon} type="close-circle" />
                            </div>
                        }
                    </div>
                </div>,
                align: 'right',
                key: 'appointment_date',
                width: defWidth.date_appointment,
                dataIndex: 'orderBeginDatetime',
                render: (orderBeginDatetime) => (<FormattedDatetime datetime={ orderBeginDatetime } format={ 'DD.MM.YY HH:mm' } />)
            },
            {
                title: <div  className={Styles.filterColumnHeaderWrap}>
                    <FormattedMessage id='report-orders-table.done_date' />
                    <br />
                    <div className={Styles.storageDateFilter}>
                        <DateRangePicker
                            minimize
                            style={{margin: 0}}//prevent default space
                            dateRange={[moment(filter.doneFromDate), moment(filter.doneToDate)]}
                            onDateChange={ setDoneDaterange }
                        />
                        {activeDoneDateFilter
                            && <div className={Styles.clearIconCont}>
                                <Icon onClick={onClearDateDoneFilter} className={Styles.clearIcon} type="close-circle" />
                            </div>
                        }
                    </div>
                </div>,
                align: 'right',
                key: 'done_date',
                width: defWidth.date_done,
                dataIndex: 'orderSuccessDatetime',
                render: (orderSuccessDatetime) => (<FormattedDatetime datetime={ orderSuccessDatetime } format={ 'DD.MM.YY HH:mm' } />)
            },
        ]
    };
    
    const sumCol = {
        title:     <FormattedMessage id='report-orders-table.sum' />,
        key: 'sum',
        children: [
            {
                title: <div  className={Styles.filterColumnHeaderWrap}>
                    <FormattedMessage id='report-orders-table.labors' />
                    <br />
                    <Checkbox defaultChecked={includeServicesDiscount} onChange={onIncludeLaborsDiscountChanged} />
                </div>,
                align: 'right',
                key: 'labors',
                width: defWidth.sum_labors,
                dataIndex: 'orderServicesSum',
                render: (orderServicesSum) => ( <Numeral>{orderServicesSum}</Numeral>)
            },
            {
                title: <div  className={Styles.filterColumnHeaderWrap}>
                    <FormattedMessage id='report-orders-table.spare_parts' />
                    <br />
                    <Checkbox defaultChecked={includeAppurtenanciesDiscount} onChange={onIncludeAppurtenanciesDiscountChanged}/>
                </div>,
                align: 'right',
                key: 'spare_parts',
                width: defWidth.sum_parts,
                dataIndex: 'orderAppurtenanciesSum',
                render: (orderAppurtenanciesSum) => ( <Numeral>{orderAppurtenanciesSum}</Numeral>)
            },
            {
                title: <div  className={Styles.filterColumnHeaderWrap}>
                    <FormattedMessage id='report-orders-table.total' />
                    <br />
                    <div className={Styles.filterColumnText}><FormattedMessage id='report-orders-table.discount_filter' /></div>
                </div>,
                align: 'right',
                key: 'total',
                width: defWidth.sum_total,
                render: (empty, elem) => ( <Numeral>{(elem.orderServicesSum + elem.orderAppurtenanciesSum)}</Numeral>)
            },
        ]
    };

    const profitCol = {
        title:     <FormattedMessage id='report-orders-table.profit' />,
        key: 'profit',
        children: [
            {
                title: <div   className={Styles.filterColumnHeaderWrap}>
                    <FormattedMessage id='report-orders-table.labors' />
                    <br />
                    <Checkbox disabled/>
                </div>,
                align: 'right',
                key: 'labors2',
                width: defWidth.profit_labors,
                dataIndex: 'profitServicesSum',
                render: (profitServicesSum) => ( <Numeral>{profitServicesSum}</Numeral>)
            },
            {
                title: <div   className={Styles.filterColumnHeaderWrap}>
                    <FormattedMessage id='report-orders-table.spare_parts' />
                    <br />
                    <Checkbox disabled/>
                </div>,
                align: 'right',
                key: 'spare_parts2',
                width: defWidth.profit_parts,
                dataIndex: 'profitAppurtenanciesSum',
                render: (profitAppurtenanciesSum) => ( <Numeral>{profitAppurtenanciesSum}</Numeral>)
            },
            {
                title: <div   className={Styles.filterColumnHeaderWrap}>
                    <FormattedMessage id='report-orders-table.total' />
                    <br />
                    <div className={Styles.filterColumnText}><FormattedMessage id='report-orders-table.salaries_filter' /></div>
                </div>,
                align: 'right',
                key: 'total2',
                width: defWidth.profit_total,
                render: (empty, elem) => (<Numeral>{(elem.profitServicesSum + elem.profitAppurtenanciesSum)}</Numeral>)
            },
        ]
    };

    //percentage
    const marginCol = {
        title:     <FormattedMessage id='report-orders-table.margin' />,
        key: 'margin',
        children: [
            {
                title: <div>
                    <FormattedMessage id='report-orders-table.labors' />
                </div>,
                align: 'right',
                key: 'labors3',
                width: defWidth.margin_labors,
                render: (empty, elem) => {
                    if(!elem.orderServicesSum || !elem.profitServicesSum) return "-";

                    const val = (elem.profitServicesSum * 100)/elem.orderServicesSum;
                    return  <span>
                        { val ? 
                            Number(val).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            : 0
                        }
                    </span>
                }
            },
            {
                title: <div>
                    <FormattedMessage id='report-orders-table.spare_parts' />
                </div>,
                align: 'right',
                key: 'spare_parts3',
                width: defWidth.margin_parts,
                render: (empty, elem) => {
                    if(!elem.orderAppurtenanciesSum || !elem.profitAppurtenanciesSum) return "-";

                    const val = (elem.profitAppurtenanciesSum * 100)/elem.orderAppurtenanciesSum;
                    return  <span>
                        { val ? 
                            Number(val).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            : 0
                        }
                    </span>
                }
            },
            {
                title: <div>
                    <FormattedMessage id='report-orders-table.total' />
                </div>,
                align: 'right',
                key: 'total3',
                width: defWidth.margin_total,
                render: (empty, elem) => {
                    if((!elem.orderAppurtenanciesSum || !elem.profitAppurtenanciesSum) && (!elem.orderServicesSum || !elem.profitServicesSum)) return "-";

                    const val = ((elem.profitAppurtenanciesSum + elem.profitServicesSum) * 100)/(elem.orderServicesSum + elem.orderAppurtenanciesSum);
                    return <span>
                        { val ? 
                            Number(val).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
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