// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Icon } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import {
    DecoratedDatePicker,
    DecoratedTimePicker,
    DecoratedSelect,
    DecoratedSlider,
} from 'forms/DecoratedFields';
import { Numeral } from 'commons';
import { getDateTimeConfig, permissions, isForbidden } from 'utils';

// own
import { formHeaderItemLayout, formHorizontalItemLayout } from '../layouts';
import { servicesStats, detailsStats } from '../stats';
// import { formItemTotalLayout } from '../layouts';
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

export default class OrderFormHeader extends Component {
    bodyUpdateIsForbidden() {
        return isForbidden(this.props.user, permissions.ACCESS_ORDER_BODY);
    }

    render() {
        const dateBlock = this._renderDateBlock();
        const masterBlock = this._renderMasterBlock();
        const totalBlock = this._renderTotalBlock();
        const duration = this._renderDuration();

        return (
            <div className={ Styles.formHeader }>
                <div className={ Styles.headerColumns }>
                    { dateBlock }
                    { masterBlock }
                    { totalBlock }
                </div>
                { duration }
            </div>
        );
    }

    _renderDuration = () => {
        const { fetchedOrder, totalHours, location, schedule } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { formatMessage } = this.props.intl;

        const deliveryDate = getFieldValue('deliveryDate');

        const momentDate = getFieldValue('stationLoads[0].beginDate');
        const momentTime = getFieldValue('stationLoads[0].beginTime');
        const duration = getFieldValue('stationLoads[0].duration');

        const excludeConfig = [{ momentDate, momentTime, duration }];

        const {
            disabledHours,
            disabledMinutes,
            disabledSeconds,
            disabledDate: dateTimeDisabledDate,
            beginTime,
        } = getDateTimeConfig(moment(deliveryDate), schedule, excludeConfig);

        const initialBeginDatetime = moment(momentDate).set({
            hours:        0,
            minutes:      0,
            milliseconds: 0,
            seconds:      0,
        });
        const disabledDate = date =>
            dateTimeDisabledDate(date) ||
            date && date.isSameOrBefore(initialBeginDatetime);

        const initialDeliveryDatetime = _.get(
            fetchedOrder,
            'order.deliveryDatetime',
        );

        return (
            <div className={ Styles.durationBlock }>
                <DecoratedSlider
                    field='stationLoads[0].duration'
                    formItem
                    formItemLayout={ formHeaderItemLayout }
                    className={ `${Styles.duration} ${Styles.deliveryDatetime}` }
                    colon={ false }
                    disabled={ this.bodyUpdateIsForbidden() }
                    initDuration={
                        _.get(fetchedOrder, 'order.duration') || totalHours
                    }
                    label={ `${formatMessage({
                        id: 'time',
                    })} (${getFieldValue(
                        'stationLoads[0].duration',
                    )}${formatMessage({
                        id: 'add_order_form.hours_shortcut',
                    })})` }
                    getFieldDecorator={ getFieldDecorator }
                    min={ 0 }
                    step={ 0.5 }
                    max={ 8 }
                />
                <DecoratedDatePicker
                    getFieldDecorator={ getFieldDecorator }
                    disabled={ this.bodyUpdateIsForbidden() }
                    field='deliveryDate'
                    allowClear={ false }
                    hasFeedback
                    formItem
                    formItemLayout={ formHeaderItemLayout }
                    formatMessage={ formatMessage }
                    label={
                        <FormattedMessage id='add_order_form.delivery_date' />
                    }
                    colon={ false }
                    className={ Styles.deliveryDatetime }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_date',
                    }) }
                    disabledDate={ disabledDate }
                    format={ 'YYYY-MM-DD' } // HH:mm
                    showTime={ false }
                    initialValue={
                        initialDeliveryDatetime
                            ? moment(initialDeliveryDatetime)
                            : void 0
                    }
                />
                <DecoratedTimePicker
                    formItem
                    disabled={
                        this.bodyUpdateIsForbidden() ||
                        !this.props.form.getFieldValue('deliveryDate')
                    }
                    disabledHours={ disabledHours }
                    disabledMinutes={ disabledMinutes }
                    disabledSeconds={ disabledSeconds }
                    formItemLayout={ formHeaderItemLayout }
                    defaultOpenValue={ moment(`${beginTime}:00`, 'HH:mm:ss') }
                    field='deliveryTime'
                    hasFeedback
                    allowEmpty={ false }
                    label={
                        <FormattedMessage id='add_order_form.delivery_time' />
                    }
                    formatMessage={ formatMessage }
                    className={ Styles.deliveryDatetime }
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'add_order_form.please_provide_time',
                            }),
                        },
                    ] }
                    placeholder={ formatMessage({
                        id: 'add_order_form.provide_time',
                    }) }
                    initialValue={
                        initialDeliveryDatetime
                            ? moment(initialDeliveryDatetime)
                            : void 0
                    }
                    minuteStep={ 30 }
                />
            </div>
        );
    };

    _renderDateBlock = () => {
        const { stations, location, fetchedOrder, schedule } = this.props;
        const { formatMessage } = this.props.intl;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const beginDate = getFieldValue('stationLoads[0].beginDate');
        // disabledHours, disabledMinutes, disabledSeconds
        const { disabledDate, beginTime } = getDateTimeConfig(
            moment(beginDate),
            schedule,
        );

        const beginDatetime =
            _.get(fetchedOrder, 'order.beginDatetime') ||
            (this.bodyUpdateIsForbidden()
                ? void 0
                : _.get(location, 'state.beginDatetime'));

        const momentBeginDatetime = beginDatetime
            ? moment(beginDatetime)
            : void 0;

        return (
            <div className={ Styles.headerCol }>
                <DecoratedDatePicker
                    getFieldDecorator={ getFieldDecorator }
                    disabled={ this.bodyUpdateIsForbidden() }
                    // field='beginDate'
                    field='stationLoads[0].beginDate'
                    hasFeedback
                    formItem
                    formItemLayout={ formHeaderItemLayout }
                    formatMessage={ formatMessage }
                    label={
                        <FormattedMessage id='add_order_form.enrollment_date' />
                    }
                    allowClear={ false }
                    colon={ false }
                    className={ Styles.datePanelItem }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_date',
                    }) }
                    disabledDate={ disabledDate }
                    format={ 'YYYY-MM-DD' } // HH:mm
                    showTime={ false }
                    initialValue={ momentBeginDatetime }
                />

                <DecoratedSelect
                    field='stationLoads[0].station'
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    formItem
                    formItemLayout={ formHeaderItemLayout }
                    label={ <FormattedMessage id='add_order_form.station' /> }
                    colon={ false }
                    hasFeedback
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_station',
                    }) }
                    disabled={ this.bodyUpdateIsForbidden() }
                    initialValue={
                        _.get(fetchedOrder, 'order.stationNum') ||
                        (this.bodyUpdateIsForbidden()
                            ? void 0
                            : _.get(location, 'state.stationNum'))
                    }
                >
                    { stations.map(({ name, num }) => {
                        return (
                            <Option value={ num } key={ String(num) }>
                                { name || String(num) }
                            </Option>
                        );
                    }) }
                </DecoratedSelect>

                <DecoratedTimePicker
                    formItem
                    disabled={
                        this.bodyUpdateIsForbidden() ||
                        !this.props.form.getFieldValue(
                            'stationLoads[0].beginDate',
                        ) ||
                        !this.props.form.getFieldValue(
                            'stationLoads[0].station',
                        )
                    }
                    formItemLayout={ formHeaderItemLayout }
                    defaultOpenValue={ moment(`${beginTime}:00`, 'HH:mm:ss') }
                    field='stationLoads[0].beginTime'
                    hasFeedback
                    disabledHours={ () => {
                        const availableHours = _.get(
                            this.props.availableHours,
                            '0',
                            [],
                        );

                        return _.difference(
                            Array(24)
                                .fill(1)
                                .map((value, index) => index),
                            availableHours.map(availableHour =>
                                Number(moment(availableHour).format('HH'))),
                        );
                    } }
                    disabledMinutes={ hour => {
                        const availableHours = _.get(
                            this.props.availableHours,
                            '0',
                            [],
                        );

                        const availableMinutes = availableHours
                            .map(availableHour => moment(availableHour))
                            .filter(
                                availableHour =>
                                    Number(availableHour.format('HH')) === hour,
                            )
                            .map(availableHour =>
                                Number(availableHour.format('mm')));

                        return _.difference([ 0, 30 ], availableMinutes);
                    } }
                    label={ <FormattedMessage id='add_order_form.applied_on' /> }
                    formatMessage={ formatMessage }
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'add_order_form.please_provide_time',
                            }),
                        },
                    ] }
                    placeholder={ formatMessage({
                        id: 'add_order_form.provide_time',
                    }) }
                    minuteStep={ 30 }
                    initialValue={ momentBeginDatetime }
                />
            </div>
        );
    };

    _renderMasterBlock = () => {
        const {
            fetchedOrder,
            managers,
            employees,
            authentificatedManager,
        } = this.props;

        const isOwnBusiness =
            _.find(managers, { id: authentificatedManager }) || void 0;

        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        return (
            <div className={ Styles.headerCol }>
                <DecoratedSelect
                    field='manager'
                    formItem
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'add_order_form.please_select_manager',
                            }),
                        },
                    ] }
                    label={ <FormattedMessage id='add_order_form.manager' /> }
                    hasFeedback
                    colon={ false }
                    className={ Styles.datePanelItem }
                    initialValue={
                        _.get(fetchedOrder, 'order.managerId') ||
                        (this.bodyUpdateIsForbidden()
                            ? void 0
                            : isOwnBusiness && authentificatedManager)
                    }
                    disabled={ this.bodyUpdateIsForbidden() }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_manager',
                    }) }
                    formItemLayout={ formHeaderItemLayout }
                >
                    { managers.map(manager => (
                        <Option
                            disabled={ manager.disabled }
                            value={ manager.id }
                            key={ v4() }
                        >
                            { `${manager.managerName} ${manager.managerSurname}` }
                        </Option>
                    )) }
                </DecoratedSelect>

                <DecoratedSelect
                    formItem
                    field='employee'
                    label={ <FormattedMessage id='order_form_table.master' /> }
                    className={ Styles.durationPanelItem }
                    disabled={ this.bodyUpdateIsForbidden() }
                    getFieldDecorator={ getFieldDecorator }
                    initialValue={ _.get(fetchedOrder, 'order.employeeId') }
                    placeholder={ formatMessage({
                        id: 'order_form_table.select_master',
                    }) }
                    formItemLayout={ formHeaderItemLayout }
                >
                    { employees.map(employee => (
                        <Option
                            value={ employee.id }
                            key={ `employee-${employee.id}` }
                            disabled={ employee.disabled }
                        >
                            { `${employee.name} ${employee.surname}` }
                        </Option>
                    )) }
                </DecoratedSelect>

                <DecoratedSelect
                    formItem
                    field='appurtenanciesResponsible'
                    label={
                        <FormattedMessage id='order_form_table.appurtenancies_responsible' />
                    }
                    className={ Styles.durationPanelItem }
                    disabled={ this.bodyUpdateIsForbidden() }
                    getFieldDecorator={ getFieldDecorator }
                    initialValue={ _.get(
                        fetchedOrder,
                        'order.appurtenanciesResponsibleId',
                    ) }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_appurtenancies_responsible',
                    }) }
                    formItemLayout={ formHeaderItemLayout }
                >
                    { employees.map(employee => (
                        <Option
                            value={ employee.id }
                            key={ v4() }
                            disabled={ employee.disabled }
                        >
                            { `${employee.name} ${employee.surname}` }
                        </Option>
                    )) }
                </DecoratedSelect>
            </div>
        );
    };

    _renderTotalBlock = () => {
        const { form, fetchedOrder } = this.props;
        const { formatMessage } = this.props.intl;

        const { getFieldDecorator } = this.props.form;

        const { price: priceDetails } = detailsStats(
            form.getFieldsValue().details || [],
        );

        const { price: priceServices } = servicesStats(
            form.getFieldsValue().services || [],
            this.props.allServices,
        );

        const servicesDiscount = form.getFieldsValue().servicesDiscount || 0;
        const detailsDiscount = form.getFieldsValue().detailsDiscount || 0;

        const detailsTotalPrice =
            priceDetails - priceDetails * (detailsDiscount / 100);
        const servicesTotalPrice =
            priceServices - priceServices * (servicesDiscount / 100);

        const totalPrice = detailsTotalPrice + servicesTotalPrice;

        return (
            <div className={ Styles.headerCol }>
                <FormItem>
                    <div className={ Styles.total }>
                        <FormattedMessage id='sum' />
                        <Numeral
                            className={ Styles.totalSum }
                            currency={ this.props.intl.formatMessage({
                                id: 'currency',
                            }) }
                            nullText='0'
                        >
                            { totalPrice }
                        </Numeral>
                        { /* <span className={ Styles.totalSum }>
                            { `${totalPrice} ${formatMessage({
                                id: 'currency',
                            })}` }
                        </span> */ }
                    </div>
                </FormItem>
                <DecoratedSelect
                    field='paymentMethod'
                    disabled={ this.bodyUpdateIsForbidden() }
                    initialValue={ _.get(fetchedOrder, 'order.paymentMethod') }
                    formItem
                    colon={ false }
                    getFieldDecorator={ getFieldDecorator }
                    formItemLayout={ formHeaderItemLayout }
                    label={
                        <FormattedMessage id='add_order_form.payment_method' />
                    }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_payment_method',
                    }) }
                >
                    <Option value='cash'>
                        <Icon type='wallet' />{ ' ' }
                        <FormattedMessage id='add_order_form.cash' />
                    </Option>
                    <Option value='noncash'>
                        <Icon type='credit-card' />{ ' ' }
                        <FormattedMessage id='add_order_form.non-cash' />
                    </Option>
                    <Option value='visa'>
                        <Icon type='credit-card' />{ ' ' }
                        <FormattedMessage id='add_order_form.visa' />
                    </Option>
                </DecoratedSelect>
                <DecoratedSelect
                    field='requisite'
                    disabled={ this.bodyUpdateIsForbidden() }
                    initialValue={ _.get(
                        fetchedOrder,
                        'order.businessRequisiteId',
                    ) }
                    formItem
                    label={
                        <FormattedMessage id='add_order_form.service_requisites' />
                    }
                    formItemLayout={ formHeaderItemLayout }
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={
                        <FormattedMessage id='add_order_form.select_requisites' />
                    }
                    options={ this.props.requisites }
                    optionValue='id'
                    optionLabel='name'
                    optionDisabled='disabled'
                />
            </div>
        );
    };
}
