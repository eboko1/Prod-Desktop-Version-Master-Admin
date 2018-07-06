// vendor
import React, { Component } from 'react';
import { Form, Select, Radio, Tabs, Input, DatePicker, Icon } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';
import _ from 'lodash';

//proj
import {
    onChangeOrderForm,
    setClientSelection,
    onChangeOrderServices,
    onChangeOrderDetails,
    onServiceSearch,
    defaultDetail,
    onDetailSearch,
    onBrandSearch,
} from 'core/forms/orderForm/duck';

import {
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
} from 'components/OrderFormTables';

import { withReduxForm, hasErrors, getDateTimeConfig, images } from 'utils';
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
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

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
    render() {
        const { managers, stations } = this.props;

        const { searchClientsResult } = this.props;
        const {
            searchClientsResult: { searching: clientsSearching },
            selectedClient,
        } = this.props;
        const { getFieldDecorator, getFieldsError } = this.props.form;
        const {
            fields: {
                clientVehicle: { value: selectedVehicleId },
            },
        } = this.props;
        const selectedVehicle =
            this.props.selectedClient &&
            selectedVehicleId &&
            _.first(
                this.props.selectedClient.vehicles.filter(
                    ({ id }) => id === selectedVehicleId,
                ),
            );

        const buttonDisabled = hasErrors(getFieldsError());

        const { count: countDetails, price: priceDetails } = detailsStats(
            this.props.fields.details,
        );
        const {
            count: countServices,
            price: priceServices,
            totalHours,
        } = servicesStats(this.props.fields.services, this.props.allServices);

        // TODO deal with total hours
        console.log(totalHours);

        const servicesDiscount = ~~this.props.fields.servicesDiscount.value;
        const detailsDiscount = ~~this.props.fields.detailsDiscount.value;

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

        console.log('form', this.props.form);

        return (
            <Form
                className={ Styles.form }
                // onSubmit={ this.handleSubmit }
                layout='horizontal'
            >
                { /* <Button
                    type='dashed'
                    htmlType='submit'
                    disabled={ buttonDisabled }
                >
                    inner submit (test validation)
                </Button> */ }
                { /* <FormItem { ...formItemLayout } label='Plain Text'>
                    <span className='ant-form-text'>readonlytext</span>
                </FormItem> */ }
                { /*
                <FormItem { ...formItemLayout } label='Radio.Button'>
                    { getFieldDecorator('status')(
                        <RadioGroup>
                            <RadioButton value='reserve'>Reserve</RadioButton>
                            <RadioButton value='new'>New</RadioButton>
                            <RadioButton value='questionable'>
                                Questionable
                            </RadioButton>
                            <RadioButton value='approve'>Approved</RadioButton>
                        </RadioGroup>,
                    ) }
                </FormItem> */ }

                <div className={ Styles.datePanel }>
                    <DecoratedDatePicker
                        getFieldDecorator={ getFieldDecorator }
                        field='beginDatetime'
                        formatMessage={ this.props.intl.formatMessage }
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
                        placeholder={ this.props.intl.formatMessage({
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
                    <FormItem
                        label={ <FormattedMessage id='add_order_form.station' /> }
                        hasFeedback
                        colon={ false }
                        className={ Styles.datePanelItem }
                    >
                        <DecoratedSelect
                            field='station'
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                            // onChange={ value =>
                            //     this.handleServiceSelect(record.key, value)
                            // }
                            placeholder={
                                <FormattedMessage id='add_order_form.select_station' />
                            }
                            // setFieldsValue={ setStation() }
                            // dropdownMatchSelectWidth={ false }
                            // dropdownStyle={ { width: '70%' } }
                            options={ stations }
                            optionValue='num'
                            optionLabel='name'
                        />
                    </FormItem>
                    <FormItem
                        label={ <FormattedMessage id='add_order_form.manager' /> }
                        hasFeedback
                        colon={ false }
                        className={ Styles.datePanelItem }
                    >
                        { getFieldDecorator('manager', {
                            rules: [
                                {
                                    required: true,
                                    message:  'Please select your manager!',
                                },
                            ],
                        })(
                            <Select placeholder='Выберете менеджера'>
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
                            </Select>,
                        ) }
                    </FormItem>
                </div>

                <ClientsSearchTable
                    clientsSearching={ clientsSearching }
                    setClientSelection={ this.props.setClientSelection }
                    visible={ !!this.props.fields.searchClientQuery.value }
                    clients={ searchClientsResult.clients }
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
                                { getFieldDecorator('searchClientQuery', {})(
                                    <Input
                                        // onChange={ () => console.log('→ ', )}
                                        placeholder={ this.props.intl.formatMessage(
                                            {
                                                id:
                                                    'add_order_form.client.placeholder',
                                                defaultMessage: 'search client',
                                            },
                                        ) }
                                    />,
                                ) }
                                <Icon
                                    type='plus'
                                    className={ Styles.addClientIcon }
                                    onClick={ () =>
                                        this.props.setAddClientModal(true)
                                    }
                                />
                            </FormItem>
                        </div>
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.name' />
                            }
                            { ...formItemLayout }
                        >
                            <Input
                                placeholder={ this.props.intl.formatMessage({
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
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.phone' />
                            }
                            { ...formItemLayout }
                        >
                            <DecoratedSelect
                                field='clientPhone'
                                getFieldDecorator={
                                    this.props.form.getFieldDecorator
                                }
                                placeholder={ 'Choose selected client phone' }
                                optionDisabled='enabled'
                            >
                                { selectedClient.phones
                                    .filter(Boolean)
                                    .map(phone => (
                                        <Option value={ phone } key={ v4() }>
                                            { phone }
                                        </Option>
                                    )) }
                            </DecoratedSelect>
                        </FormItem>
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.email' />
                            }
                            { ...formItemLayout }
                        >
                            <DecoratedSelect
                                field='clientEmail'
                                getFieldDecorator={
                                    this.props.form.getFieldDecorator
                                }
                                placeholder={ 'Choose selected client email' }
                                optionDisabled='enabled'
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
                        <FormItem
                            label={ <FormattedMessage id='add_order_form.car' /> }
                            { ...formItemLayout }
                            colon={ false }
                        >
                            <DecoratedSelect
                                field='clientVehicle'
                                getFieldDecorator={
                                    this.props.form.getFieldDecorator
                                }
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
                                        } ${vehicle.number ||
                                            vehicle.vin ||
                                            ''}` }
                                    </Option>
                                )) }
                            </DecoratedSelect>
                        </FormItem>
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
                            <FormItem
                                label={
                                    <FormattedMessage id='add_order_form.odometr' />
                                }
                                { ...formItemAutoColLayout }
                                colon={ false }
                            >
                                <DecoratedInputNumber
                                    field={ 'odometerValue' }
                                    getFieldDecorator={
                                        this.props.form.getFieldDecorator
                                    }
                                    rules={ [
                                        {
                                            required: true,
                                            type:     'number',
                                            message:  '',
                                        },
                                    ] }
                                    //min={ 0 }
                                />
                            </FormItem>
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
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.service_requisites' />
                            }
                            { ...formItemTotalLayout }
                        >
                            <DecoratedSelect
                                field='requisite'
                                getFieldDecorator={
                                    this.props.form.getFieldDecorator
                                }
                                // onChange={ value =>
                                //     this.handleServiceSelect(record.key, value)
                                // }
                                placeholder={
                                    <FormattedMessage id='add_order_form.select_requisites' />
                                }
                                // dropdownMatchSelectWidth={ false }
                                // dropdownStyle={ { width: '70%' } }
                                options={ this.props.requisites }
                                optionValue='id'
                                optionLabel='name'
                                optionDisabled='enabled'
                            />
                        </FormItem>
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.client_requisites' />
                            }
                            { ...formItemTotalLayout }
                        >
                            <DecoratedSelect
                                field='clientRequisite'
                                getFieldDecorator={
                                    this.props.form.getFieldDecorator
                                }
                                placeholder={
                                    <FormattedMessage id='add_order_form.select_requisites' />
                                }
                                // dropdownMatchSelectWidth={ false }
                                // dropdownStyle={ { width: '70%' } }
                                options={ selectedClient.requisites }
                                optionValue='id'
                                optionLabel='name'
                                optionDisabled='enabled'
                            />
                        </FormItem>
                    </div>
                    <div className={ Styles.totalBlockCol }>
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.payment_method' />
                            }
                            colon={ false }
                            { ...formItemTotalLayout }
                        >
                            { getFieldDecorator('paymentMethod')(
                                <Select
                                    placeholder={
                                        <FormattedMessage id='add_order_form.select_payment_method' />
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
                                </Select>,
                            ) }
                        </FormItem>
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
                    <TabPane
                        tab={ `${this.props.intl.formatMessage({
                            id:             'add_order_form.services',
                            defaultMessage: 'Services',
                        })} (${countServices})` }
                        key='1'
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
                        tab={ `${this.props.intl.formatMessage({
                            id:             'add_order_form.details',
                            defaultMessage: 'Details',
                        })} (${countDetails})` }
                        key='2'
                    >
                        <DetailsTable
                            { ...this.props }
                            details={ this.props.fields.details }
                            onDetailSearch={ this.props.onDetailSearch }
                            onBrandSearch={ this.props.onBrandSearch }
                            defaultDetail={ defaultDetail }
                        />
                        <DiscountPanel
                            price={ priceDetails }
                            discountFieldName={ 'detailsDiscount' }
                            { ...this.props }
                        />
                    </TabPane>
                    <TabPane
                        tab={ <FormattedMessage id='add_order_form.comments' /> }
                        key='3'
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
                                placeholder={ this.props.intl.formatMessage({
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
                                placeholder={ this.props.intl.formatMessage({
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
                                placeholder={ this.props.intl.formatMessage({
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
                                placeholder={ this.props.intl.formatMessage({
                                    id:             'add_order_form.business_comment',
                                    defaultMessage: 'Business comment',
                                }) }
                                autosize={ { minRows: 2, maxRows: 6 } }
                            />
                        </FormItem>
                    </TabPane>
                </Tabs>
            </Form>
        );
    }
}
