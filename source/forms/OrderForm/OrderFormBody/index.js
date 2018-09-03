// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Input, Icon } from 'antd';
import _ from 'lodash';
import { v4 } from 'uuid';
import classNames from 'classnames/bind';

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
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

let cx = classNames.bind(Styles);

const formBodyItemLayout = {
    labelCol: {
        xs:  { span: 24 },
        sm:  { span: 24 },
        md:  { span: 24 },
        lg:  { span: 24 },
        xl:  { span: 24 },
        xxl: { span: 9 },
    },
    wrapperCol: {
        xs:  { span: 24 },
        sm:  { span: 24 },
        md:  { span: 24 },
        lg:  { span: 24 },
        xl:  { span: 24 },
        xxl: { span: 15 },
    },
    colon: false,
};

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

        return !disabledClientSearch ? (
            <div className={ Styles.client }>
                <DecoratedInput
                    className={ Styles.clientSearchField }
                    field='searchClientQuery'
                    formItem
                    colon={ false }
                    label='Поиск клиента'
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
                <Icon
                    type='plus'
                    className={ Styles.addClientIcon }
                    onClick={ () => this.props.setAddClientModal() }
                />
            </div>
        ) : null;
    };

    _renderClientColumn = () => {
        const { selectedClient, fetchedOrder } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        // const hasClient = !!_.get(this.props, 'order.clientId');
        const hasClient = getFieldValue('clientPhone');

        return (
            <div className={ Styles.bodyColumn }>
                <div className={ Styles.bodyColumnContent }>
                    <div className={ Styles.contentWrapper }>
                        <div className={ Styles.comboFieldWrapper }>
                            <FormattedMessage id='add_order_form.client' />
                            <div className={ Styles.comboField }>
                                { selectedClient.name || selectedClient.surname
                                    ? (selectedClient.surname
                                        ? selectedClient.surname + ' '
                                        : '') + `${selectedClient.name}`
                                    : void 0 }
                            </div>
                        </div>
                        <DecoratedSelect
                            field='clientPhone'
                            disabled={ this.bodyUpdateIsForbidden() }
                            initialValue={
                                _.get(fetchedOrder, 'order.clientPhone') ||
                                (this.bodyUpdateIsForbidden()
                                    ? void 0
                                    : _.get(selectedClient, 'phones[0]'))
                            }
                            formItem
                            hasFeedback
                            className={ `${Styles.clientCol} ${
                                Styles.comboFieldSelect
                            }` }
                            colon={ false }
                            rules={ [
                                {
                                    required: true,
                                    message:  '',
                                },
                            ] }
                            getFieldDecorator={ getFieldDecorator }
                            dropdownStyle={ { borderRadius: 0 } }
                        >
                            { selectedClient.phones
                                .filter(Boolean)
                                .map(phone => (
                                    <Option value={ phone } key={ v4() }>
                                        { phone }
                                    </Option>
                                )) }
                        </DecoratedSelect>
                    </div>
                    { hasClient && (
                        <a
                            href={ `${book.oldApp.clients}/${
                                this.props.order.clientId
                            }?ref=/orders/${this.props.order.id}` }
                        >
                            <Icon type='edit' className={ Styles.editIcon } />
                        </a>
                    ) }
                </div>
                <div className={ Styles.clientsInfo }>
                    <DecoratedSelect
                        field='clientEmail'
                        className={ Styles.clientsInfoCol }
                        formItem
                        formItemLayout={ formBodyItemLayout }
                        getFieldDecorator={ getFieldDecorator }
                        label={ <FormattedMessage id='add_order_form.email' /> }
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
                        className={ Styles.clientsInfoCol }
                        disabled={ this.bodyUpdateIsForbidden() }
                        initialValue={ _.get(
                            fetchedOrder,
                            'order.clientRequisiteId',
                        ) }
                        formItem
                        label={
                            <FormattedMessage id='add_order_form.client_requisites' />
                        }
                        formItemLayout={ formBodyItemLayout }
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
            <div className={ Styles.bodyColumn }>
                <div className={ Styles.bodyColumnContent }>
                    <div className={ Styles.contentWrapper }>
                        <div className={ Styles.comboFieldWrapper }>
                            <FormattedMessage id='add_order_form.car' />
                            <div className={ Styles.comboField }>
                                { _.get(selectedVehicle, 'number') && (
                                    <div>
                                        Номер:{ ' ' }
                                        { _.get(selectedVehicle, 'number') }
                                    </div>
                                ) }
                                { _.get(selectedVehicle, 'vin') && (
                                    <div>
                                        VIN: { _.get(selectedVehicle, 'vin') }
                                    </div>
                                ) }
                            </div>
                        </div>
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
                            colon={ false }
                            className={ Styles.comboFieldSelect }
                            getFieldDecorator={ getFieldDecorator }
                            rules={ [
                                {
                                    required: true,
                                    message:  '',
                                },
                            ] }
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
                    </div>
                    { selectedVehicle && (
                        <a
                            href={ `${book.oldApp.clients}/${
                                this.props.order.clientId
                            }?ref=/orders/${this.props.order.id}` }
                        >
                            <Icon type='edit' className={ Styles.editIcon } />
                        </a>
                    ) }
                </div>
                <DecoratedInputNumber
                    field='odometerValue'
                    disabled={ this.bodyUpdateIsForbidden() }
                    formItem
                    initialValue={ _.get(fetchedOrder, 'order.odometerValue') }
                    colon={ false }
                    label={ <FormattedMessage id='add_order_form.odometr' /> }
                    formItemLayout={ formBodyItemLayout }
                    getFieldDecorator={ getFieldDecorator }
                    className={ Styles.odometr }
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
        const { orderHistory, fetchedOrder, user } = this.props;
        const { ACCESS_ORDER_COMMENTS } = permissions;
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        // (condition) ? (true block) : ((condition2) ? (true block2) : (else block2))
        let prevRecommendation = null;
        // = orderHistory
        //    ? orderHistory.orders
        //    : orderHistory.orders[ 1 ]
        //        ? orderHistory.orders[ 1 ].recommendation
        //        : false;

        if (orderHistory) {
            if (orderHistory.orders) {
                if (orderHistory.orders[ 1 ]) {
                    prevRecommendation = orderHistory.orders[ 1 ].recommendation;
                }
                prevRecommendation = false;
            }
            prevRecommendation = false;
        }

        console.log('→ prevRecommendation', prevRecommendation);

        const commentStyles = cx({
            comment:         true,
            commentExtended: !prevRecommendation,
        });

        return (
            <div className={ Styles.commentsBlock }>
                <DecoratedTextArea
                    className={ commentStyles }
                    formItem
                    colon={ false }
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
                { prevRecommendation && (
                    <DecoratedTextArea
                        className={ Styles.comment }
                        formItem
                        colon={ false }
                        label={ 'Рекомендации с прошлого заезда' }
                        disabled={ isForbidden(user, ACCESS_ORDER_COMMENTS) }
                        getFieldDecorator={ getFieldDecorator }
                        field='prevRecommendation'
                        initialValue={ prevRecommendation }
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
                ) }
            </div>
        );
    };
}
