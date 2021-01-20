//vendor
import React from 'react';
import { Form, Row, Col, DatePicker, Popover, Button } from 'antd';
import { FormattedMessage, injectIntl } from "react-intl";
import moment from 'moment';

//proj
import { DateRangePicker } from 'components';

//own
import Styles from './styles.m.css'
import {
    DecoratedSelect
} from "forms/DecoratedFields";



function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const DEF_DATE_FORMAT = 'YYYY/MM/DD';
const DEF_UI_DATE_FORMAT = 'YYYY/MM/DD';


@injectIntl
class ReportOrdersFilter extends React.Component {

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    const {
        filter,
        filterOptions
    } = this.props;

    const {
        creationFromDate,
        creationToDate,
        appointmentFromDate,
        appointmentToDate,
        doneFromDate,
        doneToDate,
        status,

        appurtenanciesResponsibleId,
        mechanicId,
        managerId,
        requisiteId,
        stationNum,
    }= filter;

    const {
        employees,
        managers,
        requisites,
        stations,
    } = filterOptions;

    const statuses = {
        required: 'transfer_required',
        reserve: 'transfer_reserve',
        not_complete: 'transfer_not_complete',
        approve: 'transfer_approve',
        progress: 'transfer_progress',
        success: 'transfer_success',
    }

    const statusesDataList = [
        {
            label:  <FormattedMessage id={statuses.required} />,
            value: 'required',
        },
        {
            label:  <FormattedMessage id={statuses.reserve} />,
            value: 'reserve',
        },
        {
            label:  <FormattedMessage id={statuses.not_complete} />,
            value: 'not_complete',
        },
        {
            label:  <FormattedMessage id={statuses.approve} />,
            value: 'approve',
        },
        {
            label:  <FormattedMessage id={statuses.progress} />,
            value: 'progress',
        },
        {
            label:  <FormattedMessage id={statuses.success} />,
            value: 'success',
        },
    ]
    
    const initValues = {
        creationFromDate: creationFromDate ? moment(creationFromDate, DEF_DATE_FORMAT): undefined,
        creationToDate: creationToDate ? moment(creationToDate, DEF_DATE_FORMAT): undefined,
        appointmentFromDate: appointmentFromDate ? moment(appointmentFromDate, DEF_DATE_FORMAT): undefined,
        appointmentToDate: appointmentToDate ? moment(appointmentToDate, DEF_DATE_FORMAT): undefined,
        doneFromDate: doneFromDate ? moment(doneFromDate, DEF_DATE_FORMAT): undefined,
        doneToDate: doneToDate ? moment(doneToDate, DEF_DATE_FORMAT): undefined,
    }

    //Handlers
    const onCreationRangeChanged = (range) => {
        this.props.form.setFieldsValue({
            creationFromDate: range[0],
            creationToDate: range[1],
            creationDateRange: range
        });
    }

    const onAppointmentRangeChanged = (range) => {
        this.props.form.setFieldsValue({
            appointmentFromDate: range[0],
            appointmentToDate: range[1],
            appointmentDateRange: range
        });
    }

    const onDoneRangeChanged = (range) => {
        this.props.form.setFieldsValue({
            doneFromDate: range[0],
            doneToDate: range[1],
            doneDateRange: range
        });
    }

    const onCreationFromDateChanged = (date) => {
        const {
            creationToDate,
        } = this.props.form.getFieldsValue();

        this.props.form.setFieldsValue({
            creationDateRange: [date, creationToDate]
        });
    }

    const onCreationToDateChanged = (date) => {
        const {
            creationFromDate
        } = this.props.form.getFieldsValue();
        this.props.form.setFieldsValue({
            creationDateRange: [creationFromDate, date]
        });
    }

    const onAppointmentFromDateChanged = (date) => {
        const {
            appointmentToDate,
        } = this.props.form.getFieldsValue();
        this.props.form.setFieldsValue({
            appointmentDateRange: [date, appointmentToDate]
        });
    }

    const onAppointmentToDateChanged = (date) => {
        const {
            appointmentFromDate,
        } = this.props.form.getFieldsValue();
        this.props.form.setFieldsValue({
            appointmentDateRange: [appointmentFromDate, date]
        });
    }

    const onDoneFromDateChanged = (date) => {
        const {
            doneToDate
        } = this.props.form.getFieldsValue();
        this.props.form.setFieldsValue({
            doneDateRange: [date, doneToDate]
        });
    }

    const onDoneToDateChanged = (date) => {
        const {
            doneFromDate,
        } = this.props.form.getFieldsValue();
        this.props.form.setFieldsValue({
            doneDateRange: [doneFromDate, date]
        });
    }
    //------------------
    
    return (
        <Form
            layout="inline"
            onSubmit={this.handleSubmit}
            initialvalues={initValues}
        >
            <div className={Styles.formContent}>
                <div className={Styles.filterBlock}>
                    <Row className={Styles.row}>
                        <Col  className={Styles.colText} span={4}><FormattedMessage id="report-orders-form.creation"/></Col>
                        <Col className={Styles.col} span={2}><FormattedMessage id="report-orders-form.from"/></Col>
                        <Col className={Styles.col} span={6}>
                            <Form.Item className={Styles.formItemStyle} name={'creationFromDate'}>
                                {getFieldDecorator('creationFromDate', {
                                    initialValue: initValues.creationFromDate
                                })(
                                    <DatePicker format={"YYYY/MM/DD"} popupStyle={{zIndex: 2000}} fromat={DEF_UI_DATE_FORMAT} onChange={onCreationFromDateChanged}/>
                                )}
                            </Form.Item>
                        </Col>
                        <Col className={Styles.col} span={2}><FormattedMessage id="report-orders-form.to"/></Col>
                        <Col className={Styles.col} span={6}>
                            <Form.Item className={Styles.formItemStyle} name={'creationToDate'}>
                                    {getFieldDecorator('creationToDate', {
                                        initialValue: initValues.creationToDate
                                    })(
                                        <DatePicker format={"YYYY/MM/DD"} popupStyle={{zIndex: 2000}} fromat={DEF_UI_DATE_FORMAT} onChange={onCreationToDateChanged}/>
                                    )}
                            </Form.Item>
                        </Col>
                        <Col className={Styles.col} span={4}>
                            <Form.Item>
                                {getFieldDecorator('creationDateRange', {
                                    initialValue: [initValues.creationFromDate, initValues.creationToDate ],
                                    valuePropName: 'dateRange',
                                    // trigger: 'onDateChange'
                                })(
                                    <DateRangePicker
                                        minimize
                                        overlayStyle={{zIndex: '5000'}}
                                        onDateChange={onCreationRangeChanged}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row  className={Styles.row}>
                        <Col className={Styles.colText} span={4}><FormattedMessage id="report-orders-form.appointment"/></Col>
                        <Col className={Styles.col} span={2}><FormattedMessage id="report-orders-form.from"/></Col>
                        <Col className={Styles.col} span={6}>
                            <Form.Item className={Styles.formItemStyle} name={'appointmentFromDate'}>
                                    {getFieldDecorator('appointmentFromDate', {
                                        initialValue: initValues.appointmentFromDate
                                    })(
                                        <DatePicker format={"YYYY/MM/DD"} popupStyle={{zIndex: 2000}} fromat={DEF_UI_DATE_FORMAT} onChange={onAppointmentFromDateChanged}/>
                                    )}
                            </Form.Item>
                        </Col>
                        <Col className={Styles.col} span={2}><FormattedMessage id="report-orders-form.to"/></Col>
                        <Col className={Styles.col} span={6}>
                            <Form.Item className={Styles.formItemStyle} name={'appointmentToDate'}>
                                    {getFieldDecorator('appointmentToDate', {
                                        initialValue: initValues.appointmentToDate
                                    })(
                                        <DatePicker format={"YYYY/MM/DD"} popupStyle={{zIndex: 2000}} fromat={DEF_UI_DATE_FORMAT} onChange={onAppointmentToDateChanged}/>
                                    )}
                            </Form.Item>
                        </Col>
                        <Col className={Styles.col} span={4}>
                            <Form.Item>
                                {getFieldDecorator('appointmentDateRange', {
                                    initialValue: [initValues.appointmentFromDate, initValues.appointmentToDate ],
                                    valuePropName: 'dateRange',
                                    // trigger: 'onDateChange'
                                })(
                                    <DateRangePicker
                                        minimize
                                        overlayStyle={{zIndex: '5000'}}
                                        onDateChange={onAppointmentRangeChanged}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row  className={Styles.row}>
                        <Col className={Styles.colText} span={4}><FormattedMessage id="report-orders-form.done"/></Col>
                        <Col className={Styles.col} span={2}><FormattedMessage id="report-orders-form.from"/></Col>
                        <Col className={Styles.col} span={6}>
                            <Form.Item className={Styles.formItemStyle} name={'doneFromDate'}>
                                    {getFieldDecorator('doneFromDate', {
                                        initialValue: initValues.doneFromDate
                                    })(
                                        <DatePicker format={"YYYY/MM/DD"} popupStyle={{zIndex: 2000}} fromat={DEF_UI_DATE_FORMAT} onChange={onDoneFromDateChanged}/>
                                    )}
                            </Form.Item>
                        </Col>
                        <Col className={Styles.col} span={2}><FormattedMessage id="report-orders-form.to"/></Col>
                        <Col className={Styles.col} span={6}>
                            <Form.Item className={Styles.formItemStyle} name={'doneToDate'}>
                                    {getFieldDecorator('doneToDate', {
                                        initialValue: initValues.doneToDate
                                    })(
                                        <DatePicker format={"YYYY/MM/DD"} popupStyle={{zIndex: 2000}} fromat={DEF_UI_DATE_FORMAT} onChange={onDoneToDateChanged}/>
                                    )}
                            </Form.Item>
                        </Col>
                        <Col className={Styles.col} span={4}>
                            <Form.Item>
                                {getFieldDecorator('doneDateRange', {
                                    initialValue: [initValues.doneFromDate, initValues.doneToDate ],
                                    valuePropName: 'dateRange',
                                    // trigger: 'onDateChange'
                                })(
                                    <DateRangePicker
                                        minimize
                                        overlayStyle={{zIndex: '5000'}}
                                        onDateChange={onDoneRangeChanged}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
                {/* ------------------------------------------------------------------------- */}
                <div className={Styles.filterBlock}>
                    <Row className={Styles.row}>
                        <Col  className={Styles.colText} span={8}><FormattedMessage id="report-orders-form.status"/></Col>
                        <Col className={Styles.col} span={14}>
                            <Form.Item className={Styles.formItemStyle} name={'statuses'}>
                                    <DecoratedSelect
                                        field="status"
                                        showSearch
                                        allowClear
                                        getFieldDecorator={getFieldDecorator}
                                        getPopupContainer={trigger =>
                                            trigger.parentNode
                                        }
                                        options={statusesDataList}
                                        optionValue="value" //Will be sent as var
                                        optionLabel="label"
                                        initialValue={status}
                                    />
                            </Form.Item>
                        </Col>
                        <Col className={Styles.col} span={2}></Col>
                    </Row>
                    <Row className={Styles.row}>
                        <Col  className={Styles.colText} span={8}><FormattedMessage id="report-orders-form.station"/></Col>
                        <Col className={Styles.col} span={14}>
                            <Form.Item className={Styles.formItemStyle} name={'stationNum'}>
                                <DecoratedSelect
                                    field="stationNum"
                                    showSearch
                                    allowClear
                                    getFieldDecorator={getFieldDecorator}
                                    getPopupContainer={trigger =>
                                        trigger.parentNode
                                    }
                                    options={stations}
                                    optionValue="num" //Will be sent as var
                                    optionLabel="name"
                                    initialValue={stationNum}
                                />
                            </Form.Item>
                        </Col>
                        <Col className={Styles.col} span={2}></Col>
                    </Row>
                    <Row className={Styles.row}>
                        <Col  className={Styles.colText} span={8}><FormattedMessage id="report-orders-form.requisites"/></Col>
                        <Col className={Styles.col} span={14}>
                            <Form.Item className={Styles.formItemStyle} name={'requisites'}>
                                    <DecoratedSelect
                                        field="requisiteId"
                                        showSearch
                                        allowClear
                                        getFieldDecorator={getFieldDecorator}
                                        getPopupContainer={trigger =>
                                            trigger.parentNode
                                        }
                                        options={requisites}
                                        optionValue="id" //Will be sent as var
                                        optionLabel="name"
                                        optionDisabled="disabled"
                                        initialValue={requisiteId}
                                    />
                            </Form.Item>
                        </Col>
                        <Col className={Styles.col} span={2}></Col>
                    </Row>
                </div>
                {/* ------------------------------------------------------------------------- */}
                <div className={Styles.filterBlock}>
                    <Row className={Styles.row}>
                        <Col  className={Styles.colText} span={8}><FormattedMessage id="report-orders-form.responsible"/></Col>
                        <Col className={Styles.col} span={14}>
                            <Form.Item className={Styles.formItemStyle} name={'managers'}>
                                <DecoratedSelect
                                    field="managerId"
                                    showSearch
                                    allowClear
                                    getFieldDecorator={getFieldDecorator}
                                    getPopupContainer={trigger =>
                                        trigger.parentNode
                                    }
                                    options={managers}
                                    optionValue="id" //Will be sent as var
                                    optionLabel="managerName"
                                    optionDisabled="disabled"
                                    initialValue={managerId}
                                />
                            </Form.Item>
                        </Col>
                        <Col className={Styles.col} span={2}></Col>
                    </Row>
                    <Row className={Styles.row}>
                        <Col  className={Styles.colText} span={8}><FormattedMessage id="report-orders-form.mechanic"/></Col>
                        <Col className={Styles.col} span={14}>
                            <Form.Item className={Styles.formItemStyle} name={'mechanic'}>
                                <DecoratedSelect
                                    field="mechanicId"
                                    showSearch
                                    allowClear
                                    getFieldDecorator={getFieldDecorator}
                                    getPopupContainer={trigger =>
                                        trigger.parentNode
                                    }
                                    options={employees}
                                    optionValue="id" //Will be sent as var
                                    optionLabel="name"
                                    optionDisabled="disabled"
                                    initialValue={mechanicId}
                                />
                            </Form.Item>
                        </Col>
                        <Col className={Styles.col} span={2}></Col>
                    </Row>
                    <Row className={Styles.row}>
                        <Col  className={Styles.colText} span={8}><FormattedMessage id="report-orders-form.appurtenancies_responsible"/></Col>
                        <Col className={Styles.col} span={14}>
                            <Form.Item className={Styles.formItemStyle} name={'appurtenanciesResponsible'}>
                                <DecoratedSelect
                                    field="appurtenanciesResponsibleId"
                                    allowClear
                                    showSearch
                                    getFieldDecorator={getFieldDecorator}
                                    getPopupContainer={trigger =>
                                        trigger.parentNode
                                    }
                                    options={employees}
                                    optionValue="id" //Will be sent as var
                                    optionLabel="name"
                                    optionDisabled="disabled"
                                    initialValue={appurtenanciesResponsibleId}
                                />
                            </Form.Item>
                        </Col>
                        <Col className={Styles.col} span={2}></Col>
                    </Row>
                </div>
                {/* ------------------------------------------------------------------------- */}
            </div>

        </Form>
    );
  }
}

export const ReportOrdersFilterForm = Form.create()(ReportOrdersFilter);