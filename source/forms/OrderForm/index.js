// vendor
import React, { Component } from 'react';
import {
    Form,
    Select,
    Radio,
    Button,
    Tabs,
    Input,
    DatePicker,
    TimePicker,
    Icon,
    Spin,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import moment from 'moment';
import { v4 } from 'uuid';
import _ from 'lodash';

//proj
import {
    onChangeOrderForm,
    setClientSelection,
    onChangeOrderServices,
    onServiceSearch,
} from 'core/forms/orderForm/duck';

import { DecoratedTextArea, DecoratedSelect } from 'forms/DecoratedFields';
import {
    DetailsTable,
    ServicesTable,
    DiscountPanel,
    ClientsSearchTable,
} from 'components/OrderFormTables';

import { withReduxForm, hasErrors, getDateTimeConfig, images } from 'utils';

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
    name:    'orderForm',
    actions: {
        change: onChangeOrderForm,
        setClientSelection,
        onChangeOrderServices,
        onServiceSearch,
    },
})
export class OrderForm extends Component {
    // handleSubmit = e => {
    //     e.preventDefault();
    //     this.props.form.validateFields((err, values) => {
    //         if (!err) {
    //             // eslint-disable-next-line
    //             console.log("Received values of form: ", values);
    //         }
    //     });
    // };

    callback(key) {
        console.log(key);
    }

    handleChangeSearchSelect(value) {
        console.log(`selected ${value}`);
    }
    //
    // fetchClientSearch(client) {
    //     debounce(this.props.fetchClientsSearch, 800);
    // }

    render() {
        const {
            allServices,
            allDetails,
            managers,
            employees,
            vehicles,
            stations,
        } = this.props;

        const { searchClientsResult } = this.props;
        const {
            searchClientsResult: { searching: clientsSearching },
            selectedClient,
        } = this.props;
        const { getFieldDecorator, getFieldsError } = this.props.form;

        console.log('selectedClient', this.props.selectedClient);

        const buttonDisabled = hasErrors(getFieldsError());
        const beginDatetime = (this.props.fields.beginDatetime || {}).value;

        const {
            disabledDate,
            disabledHours,
            disabledMinutes,
            disabledSeconds,
            disabledTime,
        } = getDateTimeConfig(beginDatetime, this.props.schedule);

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

        const formItemAutoColLayout = {
            labelCol: {
                xl:  { span: 24 },
                xxl: { span: 8 },
            },
            wrapperCol: {
                xl:  { span: 24 },
                xxl: { span: 12 },
            },
            colon: false,
        };

        const formItemTotalLayout = {
            labelCol: {
                xl:  { span: 24 },
                xxl: { span: 6 },
            },
            wrapperCol: {
                xl:  { span: 24 },
                xxl: { span: 18 },
            },
            colon: false,
        };

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
                            <RadioButton value='approved'>Approved</RadioButton>
                        </RadioGroup>,
                    ) }
                </FormItem> */ }

                <div className={ Styles.datePanel }>
                    <FormItem
                        label={
                            <FormattedMessage id='add_order_form.enrollment_date' />
                        }
                        hasFeedback
                        colon={ false }
                        className={ Styles.datePanelItem }
                    >
                        { getFieldDecorator('beginDatetime')(
                            // TODO fix possible timezone problems
                            // TODO provide locale https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json
                            <DatePicker
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
                            />,
                        ) }
                    </FormItem>
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
                                    <Option disabled={ manager.disabled } value={ manager.id } key={ v4() }>
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
                                <Input />
                            </FormItem>
                            <FormItem
                                label={
                                    <FormattedMessage id='add_order_form.odometr' />
                                }
                                { ...formItemAutoColLayout }
                                colon={ false }
                            >
                                <Input />
                            </FormItem>
                            <FormItem
                                { ...formItemAutoColLayout }
                                label={
                                    <FormattedMessage id='add_order_form.vin' />
                                }
                                colon={ false }
                            >
                                <Input />
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
                                    <Option value='card'>
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
                                    0<FormattedMessage id='currency' />
                                </span>
                            </div>
                        </FormItem>
                    </div>
                </div>
                { /* FORMS TABS */ }
                <Tabs onChange={ () => this.callback() } type='card'>
                    <TabPane
                        tab={ `${this.props.intl.formatMessage({
                            id:             'add_order_form.services',
                            defaultMessage: 'Services',
                        })} ()` }
                        key='1'
                    >
                        <ServicesTable
                            { ...this.props }
                            onServiceSearch={ this.props.onServiceSearch }
                            services={ this.props.fields.services }
                        />
                        <DiscountPanel { ...this.props } />
                    </TabPane>
                    <TabPane
                        tab={ `${this.props.intl.formatMessage({
                            id:             'add_order_form.details',
                            defaultMessage: 'Details',
                        })} ()` }
                        key='2'
                    >
                        <DetailsTable { ...this.props } />
                        <DiscountPanel { ...this.props } />
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
                    </TabPane>
                </Tabs>
            </Form>
        );
    }
}
