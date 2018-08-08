// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button, Slider, Input, Select } from 'antd';
import { v4 } from 'uuid';

// proj
// import { onChangeMobileRecordForm } from 'core/forms/mobileRecordForm/duck';
import { onChangeOrderForm } from 'core/forms/orderForm/duck';

import {
    DecoratedSelect,
    DecoratedTextArea,
    DecoratedDatePicker,
    DecoratedTimePicker,
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
    render() {
        const { selectedClient, stations, onStatusChange } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

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
                <div>Записать на:</div>
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
                    field='beginDatetime'
                    label={ <FormattedMessage id='date' /> }
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    formatMessage={ formatMessage }
                    { ...formItemLayout }
                />
                <DecoratedTimePicker
                    formItem
                    field='beginDatetime'
                    label={ <FormattedMessage id='time' /> }
                    formatMessage={ formatMessage }
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    popupClassName='mobileRecordFormTimePicker'
                    { ...formItemLayout }
                />
                <div>
                    <Slider
                        min={ 0.5 }
                        step={ 0.5 }
                        max={ 8 }
                        defaultValue={ 1 }
                        onChange={ value =>
                            console.log('→ duration slider value', value)
                        }
                    />
                </div>

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
