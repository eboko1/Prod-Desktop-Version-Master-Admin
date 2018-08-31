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
} from 'forms/DecoratedFields';
import { getDateTimeConfig } from 'utils';

// own
import { servicesStats, detailsStats } from '../stats';
import { formItemTotalLayout } from '../layouts';
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

export default class OrderFormHeader extends Component {
    render() {
        const dateBlock = this._renderDateBlock();
        const masterBlock = this._renderMasterBlock();
        const totalBlock = this._renderTotalBlock();

        return (
            <div className={ Styles.formHeader }>
                { dateBlock }
                { masterBlock }
                { totalBlock }
            </div>
        );
    }

    _renderDateBlock = () => {
        const { stations, location, fetchedOrder, schedule } = this.props;
        const { formatMessage } = this.props.intl;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const beginDate = getFieldValue('beginDate');
        const {
            disabledDate,
            disabledHours,
            disabledMinutes,
            disabledSeconds,
        } = getDateTimeConfig(moment(beginDate), schedule);

        return (
            <div className={ Styles.datePanel }>
                <DecoratedDatePicker
                    getFieldDecorator={ getFieldDecorator }
                    field='beginDate'
                    hasFeedback
                    formItem
                    formatMessage={ formatMessage }
                    label={
                        <FormattedMessage id='add_order_form.enrollment_date' />
                    }
                    colon={ false }
                    className={ Styles.datePanelItem }
                    rules={ [
                        {
                            required: true,
                            message:  'Please provide date',
                        },
                    ] }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_date',
                    }) }
                    disabledDate={ disabledDate }
                    format={ 'YYYY-MM-DD' } // HH:mm
                    showTime={ false }
                    initialValue={
                        _.get(fetchedOrder, 'order.beginDatetime') ||
                        _.get(location, 'state.beginDatetime')
                            ? moment(
                                _.get(fetchedOrder, 'order.beginDatetime') ||
                                      _.get(location, 'state.beginDatetime'),
                            )
                            : void 0
                    }
                />
                <DecoratedSelect
                    field='station'
                    rules={ [
                        {
                            required: true,
                            message:  'provide station',
                        },
                    ] }
                    formItem
                    label={ <FormattedMessage id='add_order_form.station' /> }
                    colon={ false }
                    hasFeedback
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={
                        <FormattedMessage id='add_order_form.select_station' />
                    }
                    options={ stations }
                    optionValue='num'
                    optionLabel='name'
                    initialValue={
                        _.get(location, 'state.stationNum') ||
                        _.get(fetchedOrder, 'order.stationNum') ||
                        _.get(stations, '[0].num')
                    }
                />
                <DecoratedTimePicker
                    formItem
                    field='beginTime'
                    hasFeedback
                    disabledHours={ disabledHours }
                    disabledMinutes={ disabledMinutes }
                    disabledSeconds={ disabledSeconds }
                    label={ <FormattedMessage id='time' /> }
                    formatMessage={ formatMessage }
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [
                        {
                            required: true,
                            message:  'Please provide time',
                        },
                    ] }
                    minuteStep={ 30 }
                    initialValue={
                        _.get(fetchedOrder, 'order.beginDatetime') ||
                        _.get(location, 'state.beginDatetime')
                            ? moment(
                                _.get(fetchedOrder, 'order.beginDatetime') ||
                                      _.get(location, 'state.beginDatetime'),
                            )
                            : void 0
                    }
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

        const { getFieldDecorator } = this.props.form;

        return (
            <div className={ Styles.masterBlock }>
                <DecoratedSelect
                    field='manager'
                    formItem
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [
                        {
                            required: true,
                            message:  'Please select your manager!',
                        },
                    ] }
                    label={ <FormattedMessage id='add_order_form.manager' /> }
                    hasFeedback
                    colon={ false }
                    className={ Styles.datePanelItem }
                    initialValue={
                        _.get(fetchedOrder, 'order.managerId') ||
                        authentificatedManager
                    }
                    placeholder='Выберете менеджера'
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
                <FormItem
                    label={ <FormattedMessage id='order_form_table.master' /> }
                    className={ Styles.durationPanelItem }
                >
                    <DecoratedSelect
                        field='employee'
                        getFieldDecorator={ getFieldDecorator }
                        initialValue={ _.get(fetchedOrder, 'order.employeeId') }
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
                </FormItem>
                <FormItem
                    label={
                        <FormattedMessage id='order_form_table.appurtenanciesResponsible' />
                    }
                    className={ Styles.durationPanelItem }
                >
                    <DecoratedSelect
                        field='appurtenanciesResponsible'
                        getFieldDecorator={ getFieldDecorator }
                        onSelect={ value => {
                            const services = this.props.form.getFieldValue(
                                'services',
                            );

                            const updatedServices = _(services)
                                .keys()
                                .map(serviceKey => [ `services[${serviceKey}][appurtenanciesResponsibleId]`, value ])
                                .fromPairs()
                                .value();
                            this.props.form.setFieldsValue(updatedServices);
                        } }
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
                </FormItem>
            </div>
        );
    };

    _renderTotalBlock = () => {
        const { form, fetchedOrder } = this.props;

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
            <div className={ Styles.totalBlock }>
                <FormItem>
                    <div className={ Styles.total }>
                        <FormattedMessage id='add_order_form.total' />
                        <span className={ Styles.totalSum }>
                            { totalPrice }
                            <FormattedMessage id='currency' />
                        </span>
                    </div>
                </FormItem>
                <DecoratedSelect
                    field='paymentMethod'
                    initialValue={ _.get(fetchedOrder, 'order.paymentMethod') }
                    formItem
                    colon={ false }
                    getFieldDecorator={ getFieldDecorator }
                    formItemLayout={ formItemTotalLayout }
                    label={
                        <FormattedMessage id='add_order_form.payment_method' />
                    }
                >
                    <Option value='cash'>
                        <Icon type='wallet' /> Нал
                    </Option>
                    <Option value='noncash'>
                        <Icon type='credit-card' /> Безнал
                    </Option>
                    <Option value='visa'>
                        <Icon type='credit-card' /> Visa
                    </Option>
                </DecoratedSelect>
                <DecoratedSelect
                    field='requisite'
                    initialValue={ _.get(
                        fetchedOrder,
                        'order.businessRequisiteId',
                    ) }
                    formItem
                    label={
                        <FormattedMessage id='add_order_form.service_requisites' />
                    }
                    formItemLayout={ formItemTotalLayout }
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
