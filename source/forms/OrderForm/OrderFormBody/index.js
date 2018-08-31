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
    DecoratedTextArea,
} from 'forms/DecoratedFields';
import book from 'routes/book';
import { permissions, isForbidden } from 'utils';

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
    bodyUpdateIsForbidden() {
        return isForbidden(this.props.user, permissions.ACCESS_ORDER_BODY);
    }

    render() {
        const clientSearch = this._renderClientSearch();
        const clientColumn = this._renderClientColumn();
        const vehicleColumn = this._renderVehicleColumn();
        const comments = this._renderCommentsBlock();

        return (
            <div className={ Styles.clientBlock }>
                { clientSearch }
                <div className={ Styles.clientData }>
                    { clientColumn }
                    { vehicleColumn }
                </div>
                { comments }
            </div>
        );
    }

    _renderClientSearch = () => {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        const disabledClientSearch =
            (!_.get(this.props, 'order.status') ||
                _.get(this.props, 'order.status') !== 'reserve') &&
            _.get(this.props, 'order.clientId');

        const hasClient = !!_.get(this.props, 'order.clientId');

        return (
            <div className={ Styles.client }>
                <FormItem
                    label={ <FormattedMessage id='add_order_form.client' /> }
                    colon={ false }
                >
                    <DecoratedInput
                        field='searchClientQuery'
                        getFieldDecorator={ getFieldDecorator }
                        disabled={
                            Boolean(disabledClientSearch) ||
                            this.bodyUpdateIsForbidden()
                        }
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
                                this.props.order.clientId
                            }?ref=/orders/${this.props.order.id}` }
                        >
                            <Icon
                                type='edit'
                                className={ Styles.editClientIcon }
                            />
                        </a>
                    ) }
                </FormItem>
            </div>
        );
    };

    _renderClientColumn = () => {
        const { selectedClient, fetchedOrder } = this.props;
        const { formatMessage } = this.props.intl;
        const { getFieldDecorator } = this.props.form;

        return (
            <div className={ Styles.clientCol }>
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
                    disabled={ this.bodyUpdateIsForbidden() }
                    initialValue={
                        _.get(fetchedOrder, 'order.clientPhone') ||
                        (this.bodyUpdateIsForbidden()
                            ? void 0
                            : _.get(selectedClient, 'phones[0]'))
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
                <div className={ Styles.clientsInfo }>
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
                        disabled={ this.bodyUpdateIsForbidden() }
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
            </div>
        );
    };

    _renderVehicleColumn = () => {
        const { selectedClient, fetchedOrder } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { formatMessage } = this.props.intl;

        const selectedVehicleId = getFieldValue('clientVehicle');

        const selectedVehicle =
            selectedClient &&
            selectedVehicleId &&
            _.find(selectedClient.vehicles, { id: selectedVehicleId });

        return (
            <div className={ Styles.autoCol }>
                <DecoratedSelect
                    field='clientVehicle'
                    disabled={ this.bodyUpdateIsForbidden() }
                    initialValue={
                        _.get(fetchedOrder, 'order.clientVehicleId') ||
                        (this.bodyUpdateIsForbidden()
                            ? void 0
                            : _.get(selectedClient, 'vehicles[0].id'))
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
                            { vehicle.model
                                ? `${vehicle.make} ${vehicle.model}
                                ${vehicle.number ? ' ' + vehicle.number : ''}
                                ${vehicle.vin ? ' ' + vehicle.vin : ''}`
                                : `${formatMessage({
                                    id: 'add_order_form.no_model',
                                })}
                                ${vehicle.number ? ' ' + vehicle.number : ''}
                                ${vehicle.vin ? ' ' + vehicle.vin : ''}` }
                        </Option>
                    )) }
                </DecoratedSelect>
                <div className={ Styles.carNumbers }>
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
                    <FormItem
                        { ...formItemAutoColLayout }
                        label={ <FormattedMessage id='add_order_form.vin' /> }
                        colon={ false }
                    >
                        <Input disabled value={ _.get(selectedVehicle, 'vin') } />
                    </FormItem>
                </div>
                <DecoratedInputNumber
                    field='odometerValue'
                    disabled={ this.bodyUpdateIsForbidden() }
                    formItem
                    initialValue={ _.get(fetchedOrder, 'order.odometerValue') }
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
            </div>
        );
    };

    _renderCommentsBlock = () => {
        const { fetchedOrder, user } = this.props;
        const { ACCESS_ORDER_COMMENTS } = permissions;
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        return (
            <div className={ Styles.commentsBlock }>
                <DecoratedTextArea
                    className={ Styles.comment }
                    formItem
                    label={
                        <FormattedMessage id='add_order_form.client_comments' />
                    }
                    disabled={ isForbidden(user, ACCESS_ORDER_COMMENTS) }
                    getFieldDecorator={ getFieldDecorator }
                    field='comment'
                    initialValue={ _.get(fetchedOrder, 'order.comment') }
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
                <DecoratedTextArea
                    className={ Styles.comment }
                    formItem
                    label={ 'Рекомендации с прошлого заезда' }
                    disabled={ isForbidden(user, ACCESS_ORDER_COMMENTS) }
                    getFieldDecorator={ getFieldDecorator }
                    field='comment'
                    initialValue={ _.get(fetchedOrder, 'order.comment') }
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
            </div>
        );
    };
}
