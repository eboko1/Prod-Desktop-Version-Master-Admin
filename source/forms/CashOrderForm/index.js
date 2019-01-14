// vendor
import React, { Component } from 'react';
import { Form, Select, Button, Radio, Icon } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import { v4 } from 'uuid';
import classNames from 'classnames/bind';

// proj
import { fetchCashboxes } from 'core/cash/duck';
import {
    onChangeCashOrderForm,
    fetchCashOrderNextId,
    fetchCashOrderForm,
    createCashOrder,
    selectCounterpartyList,
    selectClient,
    selectOrder,
    onClientSelect,
    onOrderSearch,
    printCashOrder,
} from 'core/forms/cashOrderForm/duck';

import { ClientsSearchTable } from 'forms/OrderForm/OrderFormTables';
import { CashSelectedClientOrdersTable } from 'components';
import {
    DecoratedSearch,
    DecoratedSelect,
    DecoratedInput,
    DecoratedInputNumber,
    DecoratedDatePicker,
    DecoratedTextArea,
    DecoratedRadio,
} from 'forms/DecoratedFields';
import { withReduxForm2, numeralFormatter, numeralParser } from 'utils';

// own
import { cashOrderTypes, cashOrderCounterpartyTypes } from './config.js';
import Styles from './styles.m.css';
const cx = classNames.bind(Styles);
const Option = Select.Option;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol:   { span: 7 },
    wrapperCol: { span: 15 },
};

const expandedWrapperFormItemLayout = {
    wrapperCol: { span: 24 },
};

const reverseFromItemLayout = {
    labelCol:   { span: 15 },
    wrapperCol: { span: 7 },
};

@withReduxForm2({
    name:    'cashOrderForm',
    actions: {
        change: onChangeCashOrderForm,
        fetchCashboxes,
        fetchCashOrderNextId,
        fetchCashOrderForm,
        createCashOrder,
        onClientSelect,
        onOrderSearch,
        printCashOrder,
    },
    mapStateToProps: state => {
        return {
            cashboxes:        state.cash.cashboxes,
            counterpartyList: selectCounterpartyList(state),
            nextId:           _.get(state, 'forms.cashOrderForm.fields.nextId'),
            client:           selectClient(state),
            orders:           _.get(selectClient(state), 'orders'),
            order:            selectOrder(state),
            activeCashOrder:  _.get(state, 'modals.modalProps.cashOrderEntity'),
        };
    },
})
@injectIntl
export class CashOrderForm extends Component {
    state = {
        sumType:          'increase',
        sumTypeRadio:     null,
        clientSearchType: 'client',
    };

    componentDidMount() {

        if(this.props.editMode || this.props.printMode) {
            console.log('@ action mode');
            this._setFormFields(this.props.activeCashOrder);
        }
        
        if (!this.props.editMode && !this.props.printMode) {
            console.log('@ createmode');
            this.props.fetchCashOrderNextId();
            this.props.fetchCashboxes();
        }

    }
    

    componentDidUpdate(prevProps) {
        const {
            form: { getFieldValue },
            fetchCashOrderForm,
        } = this.props;
        if (
            prevProps.fields.counterpartyType !==
            this.props.fields.counterpartyType
        ) {
            const counterparty = getFieldValue('counterpartyType');

            switch (counterparty) {
                case cashOrderCounterpartyTypes.EMPLOYEE:
                    return fetchCashOrderForm('employees');

                case cashOrderCounterpartyTypes.BUSINESS_SUPPLIER:
                    return fetchCashOrderForm('business_suppliers');

                default:
                    break;
            }
        }
    }

    _setFormFields = (ff) => {
        const { activeCashOrder, form } = this.props;
        const fieldsMap = _.pickBy(
            _.pick(activeCashOrder, [
                'id',
                'type',
                'businessSupplierId',
                'cashBoxId',
                'clientId',
                'orderId',
                'description',
                'employeeId',
                'increase',
                'decrease',
                'otherCounterparty',
                'datetime',
            ]), (value) => !_.isNil(value),
        );
        let counterPartyType = cashOrderCounterpartyTypes.OTHER;
        // if (fieldsMap.clientId) counterPartyType = cashOrderCounterpartyTypes.CLIENT; 
        // if (fieldsMap.employeeId) counterPartyType = cashOrderCounterpartyTypes.EMPLOYEE;
        // if (fieldsMap.businessSupplierId) counterPartyType = cashOrderCounterpartyTypes.BUSINESS_SUPPLIER;
        const normalizedDatetime = moment(fieldsMap.datetime);
        const sumType = !_.isNil(fieldsMap.increase) ? 'increase' : 'decrease';
        const normalizedFieldsMap = {...fieldsMap, sumType, counterPartyType, datetime: normalizedDatetime}
        console.log('→ normalizedFieldsMap', normalizedFieldsMap);
        form.setFieldsValue(normalizedFieldsMap);
        this.setState({ sumType });
    }

    _submit = event => {
        event.preventDefault();
        const { form, createCashOrder, resetModal } = this.props;

        form.validateFields((err, values) => {
            if (!err) {
                createCashOrder(values);
                form.resetFields();
                resetModal();
            }
        });
    };

    _selectOrderType = value => {
        switch (value) {
            case cashOrderTypes.INCOME:
                return this.setState({
                    sumType:      'increase',
                    sumTypeRadio: false,
                });

            case cashOrderTypes.EXPENSE:
                return this.setState({
                    sumType:      'decrease',
                    sumTypeRadio: false,
                });

            case cashOrderTypes.ADJUSTMENT:
                return this.setState({
                    sumType:      'increase',
                    sumTypeRadio: true,
                });

            default:
                break;
        }
    };

    _setSumType = e => {
        this.setState({ sumType: e.target.value });
        this.props.form.setFieldsValue({ [ 'sumType' ]: e.target.value });
    };

    _setClientSearchType = e =>
        this.setState({ clientSearchType: e.target.value });

    _getClientOrdersOptions() {
        return _.get(this.props, 'selectedClient.emails', [])
            .filter(Boolean)
            .map(email => (
                <Option value={ email } key={ v4() }>
                    { email }
                </Option>
            ));
    }

    _hiddenFormItemStyles = (type) =>
        cx({
            hiddenFormItem: !type,
            styledFormItem: true,
        });

    render() {
        const {
            cashboxes,
            nextId,
            printMode,
            editMode,
            intl: { formatMessage },
            form: { getFieldDecorator, getFieldValue },
        } = this.props;

        const counterpartyType = getFieldValue('counterpartyType');
        const cashOrderId = getFieldValue('id');
        console.log('→ cashOrderId', cashOrderId );

        return (
            <Form onSubmit={ this._submit }>
                <div className={ Styles.cashOrderId }>
                    <DecoratedInput
                        field='id'
                        initialValue={ nextId || cashOrderId }
                        getFieldDecorator={ getFieldDecorator }
                        formItem
                        label={ formatMessage({
                            id: 'cash-order-form.cash_order_num',
                        }) }
                        formItemLayout={ formItemLayout }
                        className={ Styles.styledFormItem }
                        disabled
                    />
                </div>
                <div className={ Styles.step }>
                    <DecoratedSelect
                        field='type'
                        getFieldDecorator={ getFieldDecorator }
                        formItem
                        label={ formatMessage({
                            id: 'cash-order-form.order_type',
                        }) }
                        placeholder={ formatMessage({
                            id: 'cash-order-form.order_type.placeholder',
                        }) }
                        rules={ [
                            {
                                required: true,
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        getPopupContainer={ trigger => trigger.parentNode }
                        formItemLayout={ formItemLayout }
                        className={ Styles.styledFormItem }
                        onSelect={ this._selectOrderType }
                        disabled={ printMode }
                    >
                        { Object.values(cashOrderTypes).map(type => (
                            <Option value={ type } key={ type }>
                                { formatMessage({
                                    id: `cash-order-form.type.${type}`,
                                }) }
                            </Option>
                        )) }
                    </DecoratedSelect>
                    <DecoratedSelect
                        field='cashBoxId'
                        getFieldDecorator={ getFieldDecorator }
                        formItem
                        label={ formatMessage({ id: 'cash-order-form.cashbox' }) }
                        placeholder={ formatMessage({
                            id: 'cash-order-form.cashbox.placeholder',
                        }) }
                        rules={ [
                            {
                                required: true,
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        getPopupContainer={ trigger => trigger.parentNode }
                        formItemLayout={ formItemLayout }
                        className={ Styles.styledFormItem }
                        disabled={ printMode }
                    >
                        { cashboxes.map(({ id, name }) => (
                            <Option value={ id } key={ id }>
                                { name }
                            </Option>
                        )) }
                    </DecoratedSelect>
                    <DecoratedDatePicker
                        field='datetime'
                        getFieldDecorator={ getFieldDecorator }
                        formItem
                        label={ formatMessage({ id: 'cash-order-form.date' }) }
                        rules={ [
                            {
                                required: true,
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        formatMessage={ formatMessage }
                        getCalendarContainer={ trigger => trigger.parentNode }
                        format='YYYY-MM-DD'
                        formItemLayout={ formItemLayout }
                        className={ Styles.styledFormItem }
                        cnStyles={ Styles.expandedInput }
                        disabled={ printMode }
                    />
                </div>
                <div className={ Styles.step }>
                    <DecoratedSelect
                        field='counterpartyType'
                        getFieldDecorator={ getFieldDecorator }
                        formItem
                        label={ formatMessage({
                            id: 'cash-order-form.counterparty_type',
                        }) }
                        placeholder={ formatMessage({
                            id: 'cash-order-form.counterparty_type.placeholder',
                        }) }
                        rules={ [
                            {
                                required: true,
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        getPopupContainer={ trigger => trigger.parentNode }
                        formItemLayout={ formItemLayout }
                        className={ Styles.styledFormItem }
                        disabled={ printMode }
                    >
                        { Object.values(cashOrderCounterpartyTypes).map(type => (
                            <Option value={ type } key={ type }>
                                { formatMessage({
                                    id: `cash-order-form.counterparty.${type}`,
                                }) }
                            </Option>
                        )) }
                    </DecoratedSelect>
                    { this._renderCounterpartyBlock(counterpartyType) }
                </div>
                <div className={ Styles.step }>
                    { this.state.sumTypeRadio && (
                        <DecoratedRadio
                            field='sumType'
                            getFieldDecorator={ getFieldDecorator }
                            cnStyles={ Styles.sumType }
                            onChange={ e => this._setSumType(e) }
                            initialValue={ this.state.sumType }
                            disabled={ printMode }
                        >
                            <Radio value='increase'>
                                { formatMessage({
                                    id: 'cash-order-form.increase',
                                }) }
                            </Radio>
                            <Radio value='decrease'>
                                { formatMessage({
                                    id: 'cash-order-form.decrease',
                                }) }
                            </Radio>
                        </DecoratedRadio>
                    ) }
                    <DecoratedInputNumber
                        fields={ {} }
                        field='increase'
                        getFieldDecorator={ getFieldDecorator }
                        formItem
                        label={
                            <div>
                                { formatMessage({
                                    id: 'cash-order-form.sum',
                                }) }{ ' ' }
                                <Icon
                                    type='caret-up'
                                    style={ { color: 'var(--enabled)' } }
                                />
                            </div>
                        }
                        placeholder={ formatMessage({
                            id: 'cash-order-form.sum.placeholder',
                        }) }
                        formItemLayout={ formItemLayout }
                        className={ this._hiddenFormItemStyles(this.state.sumType === 'increase') }
                        cnStyles={ Styles.expandedInput }
                        rules={ [
                            {
                                required: this.state.sumType === 'increase',
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        disabled={ printMode }
                        formatter={ numeralFormatter }
                        parser={ numeralParser }
                    />
                    <DecoratedInputNumber
                        fields={ {} }
                        field='decrease'
                        getFieldDecorator={ getFieldDecorator }
                        formItem
                        label={
                            <div>
                                { formatMessage({
                                    id: 'cash-order-form.sum',
                                }) }{ ' ' }
                                <Icon
                                    type='caret-down'
                                    style={ { color: 'var(--disabled)' } }
                                />
                            </div>
                        }
                        placeholder={ formatMessage({
                            id: 'cash-order-form.sum.placeholder',
                        }) }
                        formItemLayout={ formItemLayout }
                        className={ this._hiddenFormItemStyles(this.state.sumType === 'decrease') }
                        cnStyles={ Styles.expandedInput }
                        rules={ [
                            {
                                required: this.state.sumType === 'decrease',
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        disabled={ printMode }
                    />
                    <DecoratedTextArea
                        fields={ {} }
                        field='description'
                        getFieldDecorator={ getFieldDecorator }
                        formItem
                        label={ formatMessage({ id: 'cash-order-form.comment' }) }
                        formItemLayout={ formItemLayout }
                        className={ Styles.styledFormItem }
                        disabled={ printMode }
                    />
                </div>
                <div className={ Styles.buttonGroup }>
                    <Button icon='printer' onClick={ () => this.props.printCashOrder(cashOrderId) }>
                        { formatMessage({ id: 'cash-order-form.print' }) }
              
                    </Button>
                    <Button type='primary' htmlType='submit'>
                        { formatMessage({ id: 'add' }) }
                    </Button>
                </div>
            </Form>
        );
    }
    /* eslint-disable complexity */
    _renderClientBlock = () => {
        const {
            printMode,
            client: { clientId },
            order,
            intl: { formatMessage },
        } = this.props;
        const orderId = order.id;
        const clientSearch = this._renderClientSearch();
        const clientSearchTable = this._renderClientSearchTable();
        const clientField = this._renderClientField();
        const orderSearchField = this._renderOrderSearch();
        const orderField = this._renderOrderField();

        return (
            <>
                <Form.Item
                    className={ Styles.switcher }
                    { ...reverseFromItemLayout }
                    label={ formatMessage({
                        id: 'cash-order-form.search_by_client_or_order',
                    }) }
                >
                    <RadioGroup
                        onChange={ e => this._setClientSearchType(e) }
                        value={ this.state.clientSearchType }
                        disabled={ printMode }
                    >
                        <Radio value='client'>
                            { formatMessage({
                                id: 'cash-order-form.switch_by_client',
                            }) }
                        </Radio>
                        <Radio value='order'>
                            { formatMessage({
                                id: 'cash-order-form.switch_by_order',
                            }) }
                        </Radio>
                    </RadioGroup>
                </Form.Item>
                {this.state.clientSearchType === 'client' && 
                    <>
                        {Boolean(!clientId) && clientSearch}
                        {Boolean(!clientId) && clientSearchTable}
                        {Boolean(clientId) && clientField}
                        {Boolean(clientId) &&
                            Boolean(!orderId) && (
                            <CashSelectedClientOrdersTable
                                orders={ this.props.orders }
                            />
                        )}
                        {Boolean(orderId) && orderField}
                    </>
                }
                {this.state.clientSearchType === 'order' && 
                    <>
                        {Boolean(!orderId) && orderSearchField}
                        {Boolean(orderId) && orderField}
                    </>
                }
            </>
        );
    };

    _renderClientSearchTable = () => {
        const {
            searchClientsResult: { searching: clientsSearching, clients },
            onClientSelect,
            form,
        } = this.props;
        const formFieldsValues = form.getFieldsValue();
        const searchClientQuery = _.get(formFieldsValues, 'searchClientQuery');

        return (
            <ClientsSearchTable
                clientsSearching={ clientsSearching }
                setClientSelection={ onClientSelect }
                visible={ searchClientQuery }
                clients={ clients }
            />
        );
    };

    _renderClientSearch = () => {
        const { getFieldDecorator } = this.props.form;
        const {
            fields,
            errors,
            intl: { formatMessage },
        } = this.props;

        return (
            <div className={ Styles.client }>
                <DecoratedInput
                    field='searchClientQuery'
                    errors={ errors }
                    defaultGetValueProps
                    fieldValue={ _.get(fields, 'searchClientQuery') }
                    className={ Styles.clientSearchField }
                    formItem
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={ formatMessage({
                        id: 'add_order_form.search_client.placeholder',
                    }) }
                />
            </div>
        );
    };

    _renderClientField = () => {
        const {
            client: { clientId, name, surname },
            form: { getFieldDecorator },
        } = this.props;

        return (
            <div className={ Styles.clientField }>
                <DecoratedInput
                    field='clientId'
                    initialValue={ clientId }
                    getFieldDecorator={ getFieldDecorator }
                    cnStyles={ Styles.hiddenField }
                    disabled
                />
                <div>
                    <span>{ `${name} ${surname ? surname : ''}` }</span>
                    <Icon type='close' />
                </div>
            </div>
        );
    };

    _renderOrderSearch = () => {
        const {
            onOrderSearch,
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

        return (
            <DecoratedSearch
                fields={ {} }
                field='orderId'
                getFieldDecorator={ getFieldDecorator }
                formItem
                placeholder={ formatMessage({
                    id: 'cash-order-form.search_by_order',
                }) }
                onSearch={ onOrderSearch }
                formItemLayout={ formItemLayout }
                className={ Styles.styledFormItem }
                enterButton
            />
        );
    };

    _renderOrderField = () => {
        const {
            order: {id, clientId, num, clientName, clientSurname },
            form: { getFieldDecorator },
        } = this.props;

        return (
            <>
                <div className={ Styles.clientField }>
                    <DecoratedInput
                        field='orderId'
                        initialValue={ id }
                        getFieldDecorator={ getFieldDecorator }
                        cnStyles={ Styles.hiddenField }
                        disabled
                    />
                    <div>
                        <span>{ num }</span>
                        <Icon type='close' />
                    </div>
                </div>
                {clientId && 
                    <>
                        <DecoratedInput
                            field='clientId'
                            initialValue={ clientId }
                            getFieldDecorator={ getFieldDecorator }
                            cnStyles={ Styles.hiddenField }
                            disabled
                        />
                        {this.state.clientSearchType !== 'client' && 
                            <div>
                                { clientName }
                                { clientSurname }
                            </div>
                        }
                    </>
                }
            </>
        );
    };

    _renderEmployeeBlock = () => {
        const {
            printMode,
            counterpartyList,
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

        return !_.isEmpty(counterpartyList) ? (
            <DecoratedSelect
                field='employeeId'
                formItem
                placeholder={ formatMessage({
                    id: 'cash-order-form.select_employee',
                }) }
                formItemLayout={ expandedWrapperFormItemLayout }
                getFieldDecorator={ getFieldDecorator }
                getPopupContainer={ trigger => trigger.parentNode }
                rules={ [
                    {
                        required: true,
                        message:  formatMessage({
                            id: 'required_field',
                        }),
                    },
                ] }
                disabled={ printMode }
            >
                { counterpartyList.map(({ id, name, disabled }) => (
                    <Option value={ id } key={ id } disabled={ disabled }>
                        { name }
                    </Option>
                )) }
            </DecoratedSelect>
        ) : (
            <div>{ formatMessage({ id: 'no_data' }) }</div>
        );
    };

    _renderSupplierBlock = () => {
        const {
            printMode,
            counterpartyList,
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

        return !_.isEmpty(counterpartyList) ? (
            <DecoratedSelect
                field='businessSupplierId'
                formItem
                placeholder={ formatMessage({
                    id: 'cash-order-form.select_supplier',
                }) }
                formItemLayout={ expandedWrapperFormItemLayout }
                getFieldDecorator={ getFieldDecorator }
                getPopupContainer={ trigger => trigger.parentNode }
                rules={ [
                    {
                        required: true,
                        message:  formatMessage({
                            id: 'required_field',
                        }),
                    },
                ] }
                disabled={ printMode }
            >
                { counterpartyList.map(({ id, name }) => (
                    <Option value={ id } key={ id }>
                        { name }
                    </Option>
                )) }
            </DecoratedSelect>
        ) : (
            <div>{ formatMessage({ id: 'no_data' }) }</div>
        );
    };

    _renderOtherBlock = () => {
        const {
            printMode,
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

        return (
            <DecoratedInput
                field='otherCounterparty'
                formItem
                formItemLayout={ expandedWrapperFormItemLayout }
                getFieldDecorator={ getFieldDecorator }
                rules={ [
                    {
                        required: true,
                        message:  formatMessage({
                            id: 'required_field',
                        }),
                    },
                ] }
                disabled={ printMode }
            />
        );
    };

    _renderCounterpartyBlock = type => {
        switch (type) {
            case cashOrderCounterpartyTypes.CLIENT:
                return this._renderClientBlock();

            case cashOrderCounterpartyTypes.EMPLOYEE:
                return this._renderEmployeeBlock();

            case cashOrderCounterpartyTypes.BUSINESS_SUPPLIER:
                return this._renderSupplierBlock();

            case cashOrderCounterpartyTypes.OTHER:
                return this._renderOtherBlock();

            default:
                return null;
        }
    };
}
