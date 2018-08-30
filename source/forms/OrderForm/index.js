// vendor
import React, { Component } from 'react';
import { Form, Select, Input, Icon } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';
import _ from 'lodash';
import moment from 'moment';

//proj
import book from 'routes/book';
import {
    onChangeOrderForm,
    setClientSelection,
    prefillFromDashboard,
} from 'core/forms/orderForm/duck';
import { initOrderTasksForm } from 'core/forms/orderTaskForm/duck';

import {
    DecoratedInput,
    DecoratedSelect,
    DecoratedInputNumber,
    DecoratedDatePicker,
    DecoratedTimePicker,
    DecoratedTextArea,
} from 'forms/DecoratedFields';

import { ClientsSearchTable } from 'components/OrderForm/OrderFormTables';
import { OrderFormTabs } from 'components/OrderForm/OrderFormTabs';

import { withReduxForm2, getDateTimeConfig, images } from 'utils';
import {
    formItemAutoColLayout,
    formItemLayout,
    formItemTotalLayout,
} from './layouts';
import { servicesStats, detailsStats } from './stats';

// own
import Styles from './styles.m.css';

const FormItem = Form.Item;
const Option = Select.Option;

@injectIntl
@withReduxForm2({
    name:            'orderForm',
    debouncedFields: [ 'comment', 'recommendation', 'vehicleCondition', 'businessComment' ],
    actions:         {
        change: onChangeOrderForm,
        setClientSelection,
        initOrderTasksForm,
        prefillFromDashboard,
    },
})
export class OrderForm extends Component {
    componentDidMount() {
        const { location, prefillFromDashboard } = this.props;
        if (location.state) {
            prefillFromDashboard({
                beginDate: location.state.beginDatetime,
                beginTime: location.state.beginDatetime,
                station:   location.state.stationNum,
            });
        }
    }

    /* eslint-disable complexity */
    render() {
        this.props.form.getFieldDecorator('services[0].serviceName');
        this.props.form.getFieldDecorator('details[0].detailName');
        const dateBlock = this._renderDateBlock();
        const clientsSearchTable = this._renderClientSearchTable();
        const clientBlock = this._renderClientBlock();
        const totalBlock = this._renderTotalBlock();

        return (
            <Form className={ Styles.form } layout='horizontal'>
                { dateBlock }
                { clientsSearchTable }
                { clientBlock }
                { totalBlock }
            </Form>
        );
    }

    _renderClientSearchTable = () => {
        const {
            searchClientsResult: { searching: clientsSearching, clients },
            setClientSelection,
            fields,
            form,
        } = this.props;

        return (
            <ClientsSearchTable
                clientsSearching={ clientsSearching }
                setClientSelection={ setClientSelection }
                visible={ form.getFieldValue('searchClientQuery') }
                clients={ clients }
            />
        );
    };

    _renderDateBlock = () => {
        const {
            stations,
            managers,
            location,
            employees,
            fetchedOrder,
        } = this.props;
        const { formatMessage } = this.props.intl;
        const { getFieldDecorator } = this.props.form;

        const beginDate = this.props.form.getFieldValue('beginDate');
        const {
            disabledDate,
            disabledHours,
            disabledMinutes,
            disabledSeconds,
        } = getDateTimeConfig(moment(beginDate), this.props.schedule);

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
                    // showTime={ {
                    //     disabledHours,
                    //     disabledMinutes,
                    //     disabledSeconds,
                    //     format: 'HH:mm',
                    // } }
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
                        _.get(managers, '[0].id')
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
            </div>
        );
    };

    _renderClientBlock = () => {
        const clientColumn = this._renderClientColumn();
        const vehicleColumn = this._renderVehicleColumn();

        return (
            <div className={ Styles.clientBlock }>
                { clientColumn }
                { vehicleColumn }
            </div>
        );
    };

    _renderClientColumn = () => {
        const { selectedClient, fetchedOrder } = this.props;
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
                <FormItem
                    label={ <FormattedMessage id='add_order_form.email' /> }
                    { ...formItemLayout }
                >
                    <DecoratedSelect
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
                </FormItem>
                <FormItem
                    label={
                        <FormattedMessage id='add_order_form.client_comments' />
                    }
                >
                    <DecoratedTextArea
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
                </FormItem>
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
                    <FormItem { ...formItemAutoColLayout }>
                        <a
                            className={ Styles.ecat }
                            target='_blank'
                            rel='noreferrer noopener'
                            href='https://ecat.ua/OriginalCatalog.aspx'
                        >
                            <img src={ images.ecatLogo } />
                        </a>
                    </FormItem>
                </div>
            </div>
        );
    };

    _renderTotalBlock = () => {
        const {
            selectedClient,
            orderTasks,
            form,
            setModal,
            fetchedOrder,
        } = this.props;

        const { formatMessage } = this.props.intl;
        const { getFieldDecorator } = this.props.form;

        const { count: countDetails, price: priceDetails } = detailsStats(
            form.getFieldsValue().details || [],
        );

        const {
            count: countServices,
            price: priceServices,
            totalHours,
        } = servicesStats(
            form.getFieldsValue().services || [],
            this.props.allServices,
        );

        const servicesDiscount = form.getFieldsValue().servicesDiscount || 0;
        const detailsDiscount = form.getFieldsValue().detailsDiscount || 0;
        const comments = form.getFieldsValue([ 'comment', 'businessComment', 'vehicleCondition', 'recommendation' ]);

        const detailsTotalPrice =
            priceDetails - priceDetails * (detailsDiscount / 100);
        const servicesTotalPrice =
            priceServices - priceServices * (servicesDiscount / 100);

        const totalPrice = detailsTotalPrice + servicesTotalPrice;

        const commentsCollection = _.values(comments);
        const commentsCount = commentsCollection.filter(Boolean).length;

        return (
            <>
                <div className={ Styles.totalBlock }>
                    <div className={ Styles.totalBlockCol }>
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
                    <div className={ Styles.totalBlockCol }>
                        <DecoratedSelect
                            field='paymentMethod'
                            initialValue={ _.get(
                                fetchedOrder,
                                'order.paymentMethod',
                            ) }
                            formItem
                            colon={ false }
                            getFieldDecorator={ getFieldDecorator }
                            formItemLayout={ formItemTotalLayout }
                            label={
                                <FormattedMessage id='add_order_form.payment_method' />
                            }
                            // placeholder={
                            //     <FormattedMessage id='add_order_form.select_payment_method' />
                            // }
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
                        <FormItem>
                            <div className={ Styles.total }>
                                <FormattedMessage id='add_order_form.total' />
                                <span className={ Styles.totalSum }>
                                    { totalPrice }
                                    <FormattedMessage id='currency' />
                                </span>
                            </div>
                        </FormItem>
                    </div>
                </div>
                <OrderFormTabs
                    { ...this.props }
                    initOrderTasksForm={ this.props.initOrderTasksForm }
                    // changeModalStatus={ this.props.changeModalStatus }
                    formatMessage={ formatMessage }
                    getFieldDecorator={ getFieldDecorator }
                    form={ form }
                    totalHours={ totalHours }
                    countServices={ countServices }
                    countDetails={ countDetails }
                    priceServices={ priceServices }
                    priceDetails={ priceDetails }
                    setModal={ setModal }
                    orderTasks={ orderTasks }
                    commentsCount={ commentsCount }
                />
            </>
        );
    };
}
