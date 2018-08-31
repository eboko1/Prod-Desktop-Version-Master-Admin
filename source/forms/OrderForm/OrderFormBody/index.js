// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Input, Icon } from 'antd';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import {
    DecoratedInput,
    DecoratedSelect,
    DecoratedInputNumber,
} from 'forms/DecoratedFields';
import book from 'routes/book';

// own
import {
    formItemAutoColLayout,
    formItemLayout,
    formItemTotalLayout,
} from '../layouts';
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

export default class OrderFormBody extends Component {
    render() {
        const clientColumn = this._renderClientColumn();
        const vehicleColumn = this._renderVehicleColumn();

        return (
            <div className={ Styles.clientBlock }>
                { clientColumn }
                { vehicleColumn }
            </div>
        );
    }

    _renderClientColumn = () => {
        const { selectedClient, fetchedOrder, order } = this.props;
        const { formatMessage } = this.props.intl;
        const { getFieldDecorator } = this.props.form;

        const disabledClientSearch =
            (!_.get(this.props, 'order.status') ||
                _.get(this.props, 'order.status') !== 'reserve') &&
            _.get(this.props, 'order.clientId');

        const hasClient = !!_.get(this.props, 'order.clientId');

        return (
            <div className={ Styles.clientCol }>
                <div className={ Styles.client }>
                    <FormItem
                        label={ <FormattedMessage id='add_order_form.client' /> }
                        colon={ false }
                    >
                        <DecoratedInput
                            field='searchClientQuery'
                            getFieldDecorator={ getFieldDecorator }
                            disabled={ Boolean(disabledClientSearch) }
                            placeholder={ formatMessage({
                                id:             'add_order_form.client.placeholder',
                                defaultMessage: 'search client',
                            }) }
                        />
                        { !disabledClientSearch && (
                            <Icon
                                type='plus'
                                className={ Styles.addClientIcon }
                                onClick={ () => this.props.setAddClientModal() }
                            />
                        ) }
                        { hasClient && (
                            <a
                                href={ `${book.oldApp.clients}/${
                                    order.clientId
                                }?ref=/orders/${order.id}` }
                            >
                                <Icon
                                    type='edit'
                                    className={ Styles.editClientIcon }
                                />
                            </a>
                        ) }
                    </FormItem>
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
                    initialValue={
                        _.get(fetchedOrder, 'order.clientPhone') ||
                        _.get(selectedClient, 'phones[0]')
                    }
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
                    formItem
                    label={ <FormattedMessage id='add_order_form.email' /> }
                    formItemLayout={ formItemLayout }
                    field='clientEmail'
                    getFieldDecorator={ getFieldDecorator }
                    initialValue={
                        _.get(fetchedOrder, 'order.clientEmail') ||
                        selectedClient.emails.find(Boolean)
                    }
                    placeholder={ 'Choose selected client email' }
                >
                    { selectedClient.emails.filter(Boolean).map(email => (
                        <Option value={ email } key={ v4() }>
                            { email }
                        </Option>
                    )) }
                </DecoratedSelect>
                <DecoratedSelect
                    field='clientRequisite'
                    initialValue={ _.get(
                        fetchedOrder,
                        'order.clientRequisiteId',
                    ) }
                    formItem
                    label={
                        <FormattedMessage id='add_order_form.client_requisites' />
                    }
                    formItemLayout={ formItemTotalLayout }
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={
                        <FormattedMessage id='add_order_form.select_requisites' />
                    }
                    options={ selectedClient.requisites }
                    optionValue='id'
                    optionLabel='name'
                    optionDisabled='disabled'
                />
            </div>
        );
    };

    _renderVehicleColumn = () => {
        const { selectedClient, fetchedOrder } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const selectedVehicleId = getFieldValue('clientVehicle');

        const selectedVehicle =
            selectedClient &&
            selectedVehicleId &&
            _.find(selectedClient.vehicles, { id: selectedVehicleId });

        return (
            <div className={ Styles.autoCol }>
                <div className={ Styles.auto }>
                    <FormattedMessage id='add_order_form.car' />
                </div>
                <DecoratedSelect
                    field='clientVehicle'
                    initialValue={
                        _.get(fetchedOrder, 'order.clientVehicleId') ||
                        _.get(selectedClient, 'vehicles[0].id')
                    }
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
                <div className={ Styles.ecatBlock }>
                    <FormItem
                        label={
                            <FormattedMessage id='add_order_form.car_number' />
                        }
                        { ...formItemAutoColLayout }
                        colon={ false }
                    >
                        <Input
                            disabled
                            value={ _.get(selectedVehicle, 'number') }
                        />
                    </FormItem>

                    <DecoratedInputNumber
                        field='odometerValue'
                        formItem
                        initialValue={ _.get(
                            fetchedOrder,
                            'order.odometerValue',
                        ) }
                        colon={ false }
                        label={ <FormattedMessage id='add_order_form.odometr' /> }
                        formItemLayout={ formItemAutoColLayout }
                        getFieldDecorator={ getFieldDecorator }
                        rules={ [
                            {
                                type:    'number',
                                message: '',
                            },
                        ] }
                        min={ 0 }
                    />
                    <FormItem
                        { ...formItemAutoColLayout }
                        label={ <FormattedMessage id='add_order_form.vin' /> }
                        colon={ false }
                    >
                        <Input disabled value={ _.get(selectedVehicle, 'vin') } />
                    </FormItem>
                </div>
            </div>
        );
    };
}
