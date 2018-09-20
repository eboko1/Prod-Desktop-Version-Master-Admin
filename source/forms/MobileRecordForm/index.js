// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button, Input, Select } from 'antd';
import { v4 } from 'uuid';
import _ from 'lodash';
import moment from 'moment';

// proj
// import { onChangeMobileRecordForm } from 'core/forms/mobileRecordForm/duck';
import {
    onChangeOrderForm,
    fetchAvailableHours,
} from 'core/forms/orderForm/duck';

import {
    DecoratedSelect,
    DecoratedTextArea,
    DecoratedDatePicker,
    DecoratedTimePicker,
    DecoratedSlider,
} from 'forms/DecoratedFields';

import { withReduxForm } from 'utils';

import Styles from './styles.m.css';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xl:  { span: 24 },
        xxl: { span: 4 },
    },
    wrapperCol: {
        xl:  { span: 24 },
        xxl: { span: 20 },
    },
    colon: false,
};

@injectIntl
@withReduxForm({
    name:            'orderForm',
    debouncedFields: [ 'comment', 'recommendation', 'vehicleCondition', 'businessComment' ],
    actions:         {
        change: onChangeOrderForm,
        fetchAvailableHours,
    },
})
export class MobileRecordForm extends Component {
    fetchAvailableHours(station, date) {
        this.props.form.resetFields([ 'beginTime' ]);
        this.props.fetchAvailableHours(station, date, _.get(this.props, 'order.id'));
    }

    render() {
        const {
            selectedClient,
            stations,
            onStatusChange,
            order: { status },
        } = this.props;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { formatMessage } = this.props.intl;

        const isDurationDisabled = _.every(
            getFieldsValue([ 'beginDate', 'beginTime', 'station' ]),
        );

        return (
            <Form layout='horizontal'>
                <div className={ Styles.mobileRecordFormFooter }>
                    { status !== 'cancel' &&
                        status !== 'approve' && (
                        <Button
                            className={ Styles.mobileRecordSubmitBtn }
                            type='primary'
                            onClick={ () => onStatusChange('approve') }
                        >
                            <FormattedMessage id='add_order_form.save_appointment' />
                        </Button>
                    ) }
                    { status !== 'cancel' && (
                        <Button
                            className={ Styles.mobileRecordSubmitBtn }
                            onClick={ () => onStatusChange('cancel') }
                        >
                            <FormattedMessage id='cancel' />
                        </Button>
                    ) }
                </div>
                <FormItem
                    label={ <FormattedMessage id='add_order_form.name' /> }
                    { ...formItemLayout }
                >
                    <Input
                        placeholder={ formatMessage({
                            id:             'add_order_form.select_name',
                            defaultMessage: 'Select client',
                        }) }
                        disabled
                        value={
                            selectedClient.name || selectedClient.surname
                                ? (selectedClient.surname
                                    ? selectedClient.surname + ' '
                                    : '') + `${selectedClient.name}`
                                : void 0
                        }
                    />
                </FormItem>
                <DecoratedSelect
                    label={ <FormattedMessage id='add_order_form.phone' /> }
                    field='clientPhone'
                    formItem
                    formItemLayout={ formItemLayout }
                    hasFeedback
                    className={ Styles.clientCol }
                    colon={ false }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_client_phone',
                    }) }
                >
                    { selectedClient.phones.filter(Boolean).map(phone => (
                        <Option value={ phone } key={ v4() }>
                            { phone }
                        </Option>
                    )) }
                </DecoratedSelect>
                <DecoratedSelect
                    field='clientVehicle'
                    formItem
                    hasFeedback
                    label={ <FormattedMessage id='add_order_form.car' /> }
                    formItemLayout={ formItemLayout }
                    colon={ false }
                    className={ Styles.clientCol }
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_client_vehicle',
                    }) }
                    optionDisabled='enabled'
                >
                    { selectedClient.vehicles.map(vehicle => (
                        <Option value={ vehicle.id } key={ v4() }>
                            { `${vehicle.make} ${
                                vehicle.model
                            } ${vehicle.number || vehicle.vin || ''}` }
                        </Option>
                    )) }
                </DecoratedSelect>
                <hr />
                <DecoratedSelect
                    field='manager'
                    formItem
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    label={ <FormattedMessage id='add_order_form.manager' /> }
                    hasFeedback
                    colon={ false }
                    className={ Styles.datePanelItem }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_manager',
                    }) }
                >
                    { this.props.managers.map(manager => (
                        <Option
                            disabled={ manager.disabled }
                            value={ manager.id }
                            key={ v4() }
                        >
                            { `${manager.managerName} ${manager.managerSurname}` }
                        </Option>
                    )) }
                </DecoratedSelect>
                <hr />
                <div style={ { fontSize: '18px', marginBottom: '10px' } }>
                    <FormattedMessage id='add_order_form.appointment_details' />
                </div>
                <DecoratedSelect
                    field='station'
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'required_field',
                            }),
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
                    onSelect={ value => {
                        const beginDate = this.props.form.getFieldValue(
                            'beginDate',
                        );
                        if (beginDate) {
                            this.fetchAvailableHours(value, beginDate);
                        }
                    } }
                    optionValue='num'
                    optionLabel='name'
                />
                <DecoratedDatePicker
                    formItem
                    field='beginDate'
                    hasFeedback
                    label={ <FormattedMessage id='date' /> }
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    formatMessage={ formatMessage }
                    allowClear={ false }
                    onChange={ value => {
                        const station = this.props.form.getFieldValue(
                            'station',
                        );
                        if (station) {
                            this.fetchAvailableHours(station, value);
                        }
                    } }
                    { ...formItemLayout }
                />
                <DecoratedTimePicker
                    field='beginTime'
                    formItem
                    hasFeedback
                    inputReadOnly
                    allowEmpty={ false }
                    disabled={
                        !this.props.form.getFieldValue('beginDate') ||
                        !this.props.form.getFieldValue('station')
                    }
                    disabledHours={ () => {
                        const availableHours = this.props.availableHours || [];

                        return _.difference(
                            Array(24)
                                .fill(1)
                                .map((value, index) => index),
                            availableHours.map(availableHour =>
                                Number(moment(availableHour).format('HH'))),
                        );
                    } }
                    disabledMinutes={ hour => {
                        const availableHours = this.props.availableHours || [];

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
                    // disabledSeconds={ disabledSeconds }
                    label={ <FormattedMessage id='time' /> }
                    formatMessage={ formatMessage }
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    minuteStep={ 30 }
                />

                <DecoratedSlider
                    formItem
                    label={ <FormattedMessage id='add_order_form.duration' /> }
                    field='duration'
                    getFieldDecorator={ getFieldDecorator }
                    disabled={ !isDurationDisabled }
                    min={ 0 }
                    step={ 0.5 }
                    max={ 8 }
                    { ...formItemLayout }
                />
                <DecoratedTextArea
                    formItem
                    label={
                        <FormattedMessage id='add_order_form.client_comments' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                    field='comment'
                    rules={ [
                        {
                            max:     2000,
                            message: formatMessage({
                                id: 'field_should_be_below_2000_chars',
                            }),
                        },
                    ] }
                    placeholder={ formatMessage({
                        id:             'add_order_form.client_comments',
                        defaultMessage: 'Client_comments',
                    }) }
                    autosize={ { minRows: 2, maxRows: 6 } }
                />
            </Form>
        );
    }
}
