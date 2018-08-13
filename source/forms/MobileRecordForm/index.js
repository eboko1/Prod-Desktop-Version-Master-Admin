// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button, Input, Select } from 'antd';
import { v4 } from 'uuid';
import _ from 'lodash';

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

// own
import {
    formItemAutoColLayout,
    formItemLayout,
    // formItemTotalLayout,
} from '../OrderForm/layouts';
import Styles from '../OrderForm/styles.m.css';

const FormItem = Form.Item;
const Option = Select.Option;

@injectIntl
@withReduxForm({
    name:            'orderForm',
    debouncedFields: [ 'comment', 'recommendation', 'vehicleCondition', 'businessComment' ],
    actions:         {
        change: onChangeOrderForm,
    },
})
export class MobileRecordForm extends Component {
    // componentDidMount() {
    //     // const availableHours = this.props.form.getFieldsValue([ 'beginDatetime', 'station' ]);
    //     // console.log('→ DM availableHours', availableHours);
    //     this.props.fetchAvailableHours();
    // }
    //
    // componentDidMount() {
    //     console.log(
    //         this.props.form.setFieldsValue({
    //             duration: this.props.order.duration,
    //         }),
    //     );
    //     console.log(
    //         '→ this.props.form.setFieldsValue',
    //         this.props.form.setFieldsValue,
    //     );
    //     this.props.form.setFieldsValue({ duration: this.props.order.duration });
    // }

    // componentDidUpdate(prevProps) {
    //     if (
    //         prevProps.form.getFieldsValue([ 'beginDatetime', 'station' ]) ===
    //         this.props.form.getFieldsValue([ 'beginDatetime', 'station' ])
    //     ) {
    //         // const availableHours = this.props.form.getFieldsValue([ 'beginDatetime', 'station' ]);
    //         // console.log('→ DUP availableHours', availableHours);
    //         this.props.fetchAvailableHours();
    //     }
    // }
    // componentDidMount() {
    //     const {
    //         getFieldDecorator,
    //         getFieldValue,
    //         getFieldsValue,
    //         setFieldsValue,
    //     } = this.props.form;
    //     const durationValue = getFieldValue('duration');
    //     console.log('→ durationValue', durationValue);
    //
    //     setFieldsValue({ duration: durationValue || 0.5 });
    // }

    render() {
        const { selectedClient, stations, onStatusChange } = this.props;
        const {
            getFieldDecorator,
            getFieldValue,
            getFieldsValue,
            setFieldsValue,
        } = this.props.form;
        const { formatMessage } = this.props.intl;

        const availableHours = getFieldsValue([ 'beginDate', 'beginTime', 'station' ]);

        const isDurationDisabled = _.every(
            getFieldsValue([ 'beginDate', 'beginTime', 'station' ]),
        );

        return (
            <Form layout='horizontal'>
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
                            message:  '',
                        },
                    ] }
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={ 'Choose selected client phone' }
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
                    formItemLayout={ formItemAutoColLayout }
                    colon={ false }
                    className={ Styles.clientCol }
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [
                        {
                            required: true,
                            message:  '',
                        },
                    ] }
                    placeholder={ 'Choose selected client vehicle' }
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
                            message:  'Please select your manager!',
                        },
                    ] }
                    label={ <FormattedMessage id='add_order_form.manager' /> }
                    hasFeedback
                    colon={ false }
                    className={ Styles.datePanelItem }
                    placeholder='Выберете менеджера'
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
                    Записать на:
                </div>
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
                />
                <DecoratedDatePicker
                    formItem
                    field='beginDate'
                    label={ <FormattedMessage id='date' /> }
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    formatMessage={ formatMessage }
                    allowClear={ false }
                    { ...formItemLayout }
                />
                <DecoratedTimePicker
                    formItem
                    field='beginTime'
                    label={ <FormattedMessage id='time' /> }
                    formatMessage={ formatMessage }
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    popupClassName='mobileRecordFormTimePicker'
                    { ...formItemLayout }
                />

                <DecoratedSlider
                    formItem
                    label='Продолжительность'
                    field='duration'
                    getFieldDecorator={ getFieldDecorator }
                    // setFieldsValue={ setFieldsValue }
                    // initialValue={ this.props.order.duration }
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
                            message: 'Too much',
                        },
                    ] }
                    placeholder={ formatMessage({
                        id:             'add_order_form.client_comments',
                        defaultMessage: 'Client_comments',
                    }) }
                    autosize={ { minRows: 2, maxRows: 6 } }
                />

                <div className={ Styles.mobileRecordFormFooter }>
                    <Button
                        className={ Styles.mobileRecordSubmitBtn }
                        type='primary'
                        onClick={ () => onStatusChange('approve') }
                    >
                        Записать
                    </Button>
                    <Button
                        className={ Styles.mobileRecordSubmitBtn }
                        onClick={ () => onStatusChange('cancel') }
                    >
                        Отказать
                    </Button>
                </div>
            </Form>
        );
    }
}
