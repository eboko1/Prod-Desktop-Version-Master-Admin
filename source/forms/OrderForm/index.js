// vendor
import React, { Component } from 'react';
import { Form, Select, Tabs, Input, Icon } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';
import _ from 'lodash';

//proj
import book from 'routes/book';
import {
    onChangeOrderForm,
    setClientSelection,
    onChangeOrderServices,
    onChangeOrderDetails,
    onServiceSearch,
    onDetailSearch,
    onBrandSearch,
} from 'core/forms/orderForm/duck';

import { defaultDetails } from 'core/forms/orderForm/helpers/details';

import {
    DecoratedInput,
    DecoratedTextArea,
    DecoratedSelect,
    DecoratedInputNumber,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';
import {
    DetailsTable,
    ServicesTable,
    DiscountPanel,
    ClientsSearchTable,
    TasksTable,
    HistoryTable,
    CallsTable,
} from 'components/OrderFormTables';

import { withReduxForm, getDateTimeConfig, images } from 'utils';
import {
    formItemAutoColLayout,
    formItemLayout,
    formItemTotalLayout,
} from './layouts';
import { servicesStats, detailsStats } from './stats';

// own
// import { DecoratedInput } from './DecoratedInput';
import Styles from './styles.m.css';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

@injectIntl
@withReduxForm({
    name:            'orderForm',
    debouncedFields: [ 'comment', 'recommendation', 'vehicleCondition', 'businessComment' ],
    actions:         {
        change: onChangeOrderForm,
        setClientSelection,
        onChangeOrderServices,
        onChangeOrderDetails,
        onServiceSearch,
        onDetailSearch,
        onBrandSearch,
    },
})
export class OrderForm extends Component {
    /* eslint-disable complexity */
    render() {
        const {
            fields: {
                clientVehicle: { value: selectedVehicleId },
            },
            form: { getFieldDecorator },
            managers,
            searchClientsResult: { searching: clientsSearching, clients },
            selectedClient,
            stations,
            addOrderForm,
        } = this.props;

        const { formatMessage } = this.props.intl;

        const selectedVehicle =
            this.props.selectedClient &&
            selectedVehicleId &&
            _.first(
                this.props.selectedClient.vehicles.filter(
                    ({ id }) => id === selectedVehicleId,
                ),
            );

        const { count: countDetails, price: priceDetails } = detailsStats(
            this.props.fields.details,
        );
        const {
            count: countServices,
            price: priceServices,
            totalHours,
        } = servicesStats(this.props.fields.services, this.props.allServices);

        // TODO deal with total hours
        // console.log(totalHours);

        const servicesDiscount =
            Number(this.props.fields.servicesDiscount.value) || 0;
        const detailsDiscount =
            Number(this.props.fields.detailsDiscount.value) || 0;

        const detailsTotalPrice =
            priceDetails - priceDetails * (detailsDiscount / 100);
        const servicesTotalPrice =
            priceServices - priceServices * (servicesDiscount / 100);

        const totalPrice = detailsTotalPrice + servicesTotalPrice;

        const beginDatetime = (this.props.fields.beginDatetime || {}).value;

        const {
            disabledDate,
            disabledHours,
            disabledMinutes,
            disabledSeconds,
            disabledTime,
        } = getDateTimeConfig(beginDatetime, this.props.schedule);

        const disabledClientSearch =
            (!_.get(this.props, 'order.status') ||
                _.get(this.props, 'order.status') !== 'reserve') &&
            _.get(this.props, 'order.clientId');

        const hasClient = !!_.get(this.props, 'order.clientId');

        return (
            <Form
                className={ Styles.form }
                // onSubmit={ this.handleSubmit }
                layout='horizontal'
            >
                <div className={ Styles.datePanel }>
                    <DecoratedDatePicker
                        getFieldDecorator={ getFieldDecorator }
                        field='beginDatetime'
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
                                message:  '',
                            },
                        ] }
                        placeholder={ formatMessage({
                            id:             'add_order_form.select_date',
                            defaultMessage: 'Provide date',
                        }) }
                        disabledDate={ disabledDate }
                        disabledTime={ disabledTime }
                        format={ 'YYYY-MM-DD HH:mm' }
                        showTime={ {
                            disabledHours,
                            disabledMinutes,
                            disabledSeconds,
                            format: 'HH:mm',
                        } }
                    />
                    { /*</FormItem>*/ }
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
                        { managers.map(manager => (
                            <Option
                                disabled={ manager.disabled }
                                value={ manager.id }
                                key={ v4() }
                            >
                                { `${manager.managerName} ${
                                    manager.managerSurname
                                }` }
                            </Option>
                        )) }
                    </DecoratedSelect>
                </div>

                <ClientsSearchTable
                    clientsSearching={ clientsSearching }
                    setClientSelection={ this.props.setClientSelection }
                    visible={ !!this.props.fields.searchClientQuery.value }
                    clients={ clients }
                />
                <div className={ Styles.clientBlock }>
                    <div className={ Styles.clientCol }>
                        <div className={ Styles.client }>
                            <FormItem
                                label={
                                    <FormattedMessage id='add_order_form.client' />
                                }
                                colon={ false }
                            >
                                <DecoratedInput
                                    field='searchClientQuery'
                                    getFieldDecorator={ getFieldDecorator }
                                    disabled={ disabledClientSearch }
                                    placeholder={ formatMessage({
                                        id:             'add_order_form.client.placeholder',
                                        defaultMessage: 'search client',
                                    }) }
                                />
                                { !disabledClientSearch && (
                                    <Icon
                                        type='plus'
                                        className={ Styles.addClientIcon }
                                        onClick={ () =>
                                            this.props.setAddClientModal()
                                        }
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
                            label={
                                <FormattedMessage id='add_order_form.name' />
                            }
                            { ...formItemLayout }
                        >
                            <Input
                                placeholder={ formatMessage({
                                    id:             'add_order_form.select_name',
                                    defaultMessage: 'Select client',
                                }) }
                                disabled
                                value={
                                    selectedClient.name ||
                                    selectedClient.surname
                                        ? (selectedClient.surname
                                            ? selectedClient.surname + ' '
                                            : '') + `${selectedClient.name}`
                                        : void 0
                                }
                            />
                        </FormItem>
                        <DecoratedSelect
                            label={
                                <FormattedMessage id='add_order_form.phone' />
                            }
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
                            { selectedClient.phones
                                .filter(Boolean)
                                .map(phone => (
                                    <Option value={ phone } key={ v4() }>
                                        { phone }
                                    </Option>
                                )) }
                        </DecoratedSelect>
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.email' />
                            }
                            { ...formItemLayout }
                        >
                            <DecoratedSelect
                                field='clientEmail'
                                getFieldDecorator={ getFieldDecorator }
                                placeholder={ 'Choose selected client email' }
                            >
                                { selectedClient.emails
                                    .filter(Boolean)
                                    .map(email => (
                                        <Option value={ email } key={ v4() }>
                                            { email }
                                        </Option>
                                    )) }
                            </DecoratedSelect>
                        </FormItem>
                    </div>
                    <div className={ Styles.autoCol }>
                        <div className={ Styles.auto }>
                            <FormattedMessage id='add_order_form.car' />
                        </div>
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
                                    value={
                                        selectedVehicle &&
                                        selectedVehicle.number
                                    }
                                />
                            </FormItem>

                            <DecoratedInputNumber
                                field='odometerValue'
                                formItem
                                colon={ false }
                                label={
                                    <FormattedMessage id='add_order_form.odometr' />
                                }
                                formItemLayout={ formItemAutoColLayout }
                                getFieldDecorator={ getFieldDecorator }
                                rules={ [
                                    {
                                        type:    'number',
                                        message: '',
                                    },
                                ] }
                                //min={ 0 }
                            />
                            <FormItem
                                { ...formItemAutoColLayout }
                                label={
                                    <FormattedMessage id='add_order_form.vin' />
                                }
                                colon={ false }
                            >
                                <Input
                                    disabled
                                    value={
                                        selectedVehicle && selectedVehicle.vin
                                    }
                                />
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
                </div>

                <div className={ Styles.totalBlock }>
                    <div className={ Styles.totalBlockCol }>
                        <DecoratedSelect
                            field='requisite'
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
                { /* FORMS TABS */ }
                <Tabs type='card'>
                    { !addOrderForm && (
                        <TabPane
                            tab={
                                formatMessage({
                                    id: 'order_form_table.tasks',
                                }) +
                                ' (' +
                                this.props.orderTasks.length +
                                ')'
                            }
                            key='1'
                        >
                            <TasksTable orderTasks={ this.props.orderTasks } />
                        </TabPane>
                    ) }
                    <TabPane
                        tab={ `${formatMessage({
                            id:             'add_order_form.services',
                            defaultMessage: 'Services',
                        })} (${countServices})` }
                        key='2'
                    >
                        <ServicesTable
                            { ...this.props }
                            onServiceSearch={ this.props.onServiceSearch }
                            services={ this.props.fields.services }
                        />
                        <DiscountPanel
                            price={ priceServices }
                            discountFieldName={ 'servicesDiscount' }
                            { ...this.props }
                        />
                    </TabPane>
                    <TabPane
                        tab={ `${formatMessage({
                            id:             'add_order_form.details',
                            defaultMessage: 'Details',
                        })} (${countDetails})` }
                        key='3'
                    >
                        <DetailsTable
                            { ...this.props }
                            details={ this.props.fields.details }
                            onDetailSearch={ this.props.onDetailSearch }
                            onBrandSearch={ this.props.onBrandSearch }
                            defaultDetail={ defaultDetails }
                        />
                        <DiscountPanel
                            price={ priceDetails }
                            discountFieldName={ 'detailsDiscount' }
                            { ...this.props }
                        />
                    </TabPane>
                    <TabPane
                        tab={ <FormattedMessage id='add_order_form.comments' /> }
                        key='4'
                    >
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.client_comments' />
                            }
                        >
                            <DecoratedTextArea
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
                        </FormItem>
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.service_recommendations' />
                            }
                        >
                            <DecoratedTextArea
                                getFieldDecorator={ getFieldDecorator }
                                field='recommendation'
                                rules={ [
                                    {
                                        max:     2000,
                                        message: 'Too much',
                                    },
                                ] }
                                placeholder={ formatMessage({
                                    id:
                                        'add_order_form.service_recommendations',
                                    defaultMessage: 'Service recommendations',
                                }) }
                                autosize={ { minRows: 2, maxRows: 6 } }
                            />
                        </FormItem>
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.vehicle_condition' />
                            }
                        >
                            <DecoratedTextArea
                                getFieldDecorator={ getFieldDecorator }
                                field='vehicleCondition'
                                rules={ [
                                    {
                                        max:     2000,
                                        message: 'Too much',
                                    },
                                ] }
                                placeholder={ formatMessage({
                                    id:             'add_order_form.vehicle_condition',
                                    defaultMessage: 'Vehicle condition',
                                }) }
                                autosize={ { minRows: 2, maxRows: 6 } }
                            />
                        </FormItem>
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.business_comment' />
                            }
                        >
                            <DecoratedTextArea
                                getFieldDecorator={ getFieldDecorator }
                                field='businessComment'
                                rules={ [
                                    {
                                        max:     2000,
                                        message: 'Too much',
                                    },
                                ] }
                                placeholder={ formatMessage({
                                    id:             'add_order_form.business_comment',
                                    defaultMessage: 'Business comment',
                                }) }
                                autosize={ { minRows: 2, maxRows: 6 } }
                            />
                        </FormItem>
                    </TabPane>
                    { !addOrderForm && (
                        <TabPane
                            tab={
                                formatMessage({
                                    id: 'order_form_table.history',
                                }) +
                                ' (' +
                                this.props.orderHistory.orders.length +
                                ')'
                            }
                            key='5'
                        >
                            <HistoryTable
                                orderHistory={ this.props.orderHistory }
                            />
                        </TabPane>
                    ) }
                    { !addOrderForm && (
                        <TabPane
                            tab={
                                formatMessage({
                                    id: 'order_form_table.calls',
                                }) +
                                ' (' +
                                this.props.orderCalls.length +
                                ')'
                            }
                            key='6'
                        >
                            <CallsTable orderCalls={ this.props.orderCalls } />
                        </TabPane>
                    ) }
                </Tabs>
            </Form>
        );
    }
}
