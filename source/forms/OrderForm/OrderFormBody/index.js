// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { Select, Icon } from 'antd';
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
import { ClientsSearchTable } from './../OrderFormTables';
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

const formVerticalLayout = {
    labelCol: {
        xs:  { span: 24 },
        sm:  { span: 24 },
        md:  { span: 24 },
        lg:  { span: 24 },
        xl:  { span: 24 },
        xxl: { span: 24 },
    },
    wrapperCol: {
        xs:  { span: 24 },
        sm:  { span: 24 },
        md:  { span: 24 },
        lg:  { span: 24 },
        xl:  { span: 24 },
        xxl: { span: 24 },
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
        const clientsSearchTable = this._renderClientSearchTable();

        return (
            <div className={ Styles.clientBlock }>
                { clientSearch }
                { clientsSearchTable }
                <div className={ Styles.clientData }>
                    { clientColumn }
                    { vehicleColumn }
                </div>
                { comments }
            </div>
        );
    }

    _renderClientSearchTable = () => {
        const {
            searchClientsResult: { searching: clientsSearching, clients },
            setClientSelection,
        } = this.props;
        const { getFieldValue } = this.props.form;

        return (
            <ClientsSearchTable
                clientsSearching={ clientsSearching }
                setClientSelection={ setClientSelection }
                visible={ getFieldValue('searchClientQuery') }
                clients={ clients }
            />
        );
    };

    _renderClientSearch = () => {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;
        const { user } = this.props;
        const { CREATE_EDIT_DELETE_CLIENTS } = permissions;

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
                    label={
                        <FormattedMessage id='add_order_form.search_client' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                    disabled={
                        Boolean(disabledClientSearch) ||
                        this.bodyUpdateIsForbidden()
                    }
                    placeholder={ formatMessage({
                        id:             'add_order_form.search_client.placeholder',
                        defaultMessage: 'Search client',
                    }) }
                />
                { !isForbidden(user, CREATE_EDIT_DELETE_CLIENTS) ? (
                    <Icon
                        type='plus'
                        className={ Styles.addClientIcon }
                        onClick={ () => this.props.setAddClientModal() }
                    />
                ) : null }
            </div>
        ) : null;
    };

    _renderClientColumn = () => {
        const { selectedClient, fetchedOrder } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { formatMessage } = this.props.intl;

        // const hasClient = !!_.get(this.props, 'order.clientId');
        const hasClient = getFieldValue('clientPhone');
        const clipboardClientEmail = getFieldValue('clientEmail');

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
                                    message:  formatMessage({
                                        id: 'required_field',
                                    }),
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
                        <div className={ Styles.iconsCol }>
                            <Link
                                to={ `${book.client}/${selectedClient.clientId}` }
                            >
                                <Icon type='edit' className={ Styles.editIcon } />
                            </Link>
                            <CopyToClipboard text={ hasClient }>
                                <Icon
                                    type='copy'
                                    theme='outlined'
                                    className={ Styles.copyIcon }
                                />
                            </CopyToClipboard>
                        </div>
                    ) }
                </div>
                <div className={ Styles.clientsInfo }>
                    <DecoratedSelect
                        field='clientEmail'
                        className={ Styles.clientsInfoCol }
                        formItem
                        disabled={ this.bodyUpdateIsForbidden() }
                        formItemLayout={ formVerticalLayout }
                        getFieldDecorator={ getFieldDecorator }
                        label={
                            <div>
                                <FormattedMessage id='add_order_form.email' />
                                { clipboardClientEmail && (
                                    <CopyToClipboard
                                        text={ clipboardClientEmail }
                                    >
                                        <Icon
                                            type='copy'
                                            theme='outlined'
                                            className={ Styles.copyIcon }
                                        />
                                    </CopyToClipboard>
                                ) }
                            </div>
                        }
                        initialValue={
                            _.get(fetchedOrder, 'order.clientEmail') ||
                            selectedClient.emails.find(Boolean)
                        }
                        placeholder={ formatMessage({
                            id: 'add_order_form.email.placeholder',
                        }) }
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
                        formItemLayout={ formVerticalLayout }
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

        function formatVehicleLabel(vehicle) {
            const modelPart = vehicle.model
                ? `${vehicle.make} ${vehicle.model}`
                : formatMessage({ id: 'add_order_form.no_model' });
            const horsePowerLabel = !vehicle.horsePower
                ? null
                : `(${vehicle.horsePower} ${formatMessage({
                    id: 'horse_power',
                })})`;
            const modificationPart = [ vehicle.modification, horsePowerLabel ]
                .filter(Boolean)
                .join(' ');
            const parts = [ modelPart, vehicle.year, modificationPart, vehicle.number, vehicle.vin ];

            return parts
                .filter(Boolean)
                .map(String)
                .map(_.trimEnd)
                .join(', ');
        }

        return (
            <div className={ Styles.bodyColumn }>
                <div className={ Styles.bodyColumnContent }>
                    <div className={ Styles.contentWrapper }>
                        <div className={ Styles.comboFieldWrapper }>
                            <FormattedMessage id='add_order_form.car' />
                            <div className={ Styles.comboField }>
                                { _.get(selectedVehicle, 'number') && (
                                    <div>
                                        <FormattedMessage id='add_client_form.number' />:{ ' ' }
                                        { _.get(selectedVehicle, 'number') }
                                    </div>
                                ) }
                                { _.get(selectedVehicle, 'vin') && (
                                    <div>
                                        <FormattedMessage id='add_client_form.vin' />: { _.get(selectedVehicle, 'vin') }
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
                                    message:  formatMessage({
                                        id: 'required_field',
                                    }),
                                },
                            ] }
                            optionDisabled='enabled'
                        >
                            { selectedClient.vehicles.map(vehicle => (
                                <Option value={ vehicle.id } key={ v4() }>
                                    { formatVehicleLabel(vehicle) }
                                </Option>
                            )) }
                        </DecoratedSelect>
                    </div>
                    { selectedVehicle && (
                        <div className={ Styles.iconsCol }>
                            <a
                                href={ `${book.oldApp.clients}/${
                                    this.props.order.clientId
                                }?ref=/orders/${this.props.order.id}` }
                            >
                                <Icon type='edit' className={ Styles.editIcon } />
                            </a>
                            <CopyToClipboard
                                text={ `${selectedVehicle.make} ${
                                    selectedVehicle.model
                                }` }
                            >
                                <Icon
                                    type='copy'
                                    theme='outlined'
                                    className={ Styles.copyIcon }
                                />
                            </CopyToClipboard>
                        </div>
                    ) }
                </div>
                <DecoratedInputNumber
                    field='odometerValue'
                    disabled={ this.bodyUpdateIsForbidden() }
                    formItem
                    initialValue={ _.get(fetchedOrder, 'order.odometerValue') }
                    colon={ false }
                    label={ <FormattedMessage id='add_order_form.odometr' /> }
                    formItemLayout={ formVerticalLayout }
                    getFieldDecorator={ getFieldDecorator }
                    className={ Styles.odometr }
                    placeholder={ formatMessage({
                        id: 'add_order_form.provide_odometr',
                    }) }
                    rules={ [
                        {
                            type:    'number',
                            message: formatMessage({
                                id: 'required_field',
                            }),
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

        const id = this.props.orderId;
        const orderIndexInHistory = _.findIndex(_.get(orderHistory, 'orders'), {
            id,
        });
        const prevRecommendation =
            orderIndexInHistory !== -1
                ? _.get(orderHistory, [ 'orders', orderIndexInHistory + 1, 'recommendation' ])
                : null;

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
                { prevRecommendation && (
                    <DecoratedTextArea
                        className={ Styles.comment }
                        formItem
                        colon={ false }
                        label={
                            <FormattedMessage id='add_order_form.prev_order_recommendations' />
                        }
                        disabled
                        getFieldDecorator={ getFieldDecorator }
                        field='prevRecommendation'
                        initialValue={ prevRecommendation }
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
                ) }
            </div>
        );
    };
}
