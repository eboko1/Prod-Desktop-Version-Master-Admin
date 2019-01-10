// vendor
import React, { Component } from 'react';
import { Form, Select, Button, Radio, Icon } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import { fetchCashboxes } from 'core/cash/duck';
import {
    onChangeCashOrderForm,
    fetchCashOrderNextId,
    fetchCashOrderForm,
    createCashOrder,
    selectCounterpartyList,
    setClientSelection,
} from 'core/forms/cashOrderForm/duck';

import { ClientsSearchTable } from 'forms/OrderForm/OrderFormTables';
import {
    DecoratedSearch,
    DecoratedSelect,
    DecoratedInput,
    DecoratedInputNumber,
    DecoratedDatePicker,
    DecoratedTextArea,
    DecoratedRadio,
} from 'forms/DecoratedFields';
import { withReduxForm2 } from 'utils';

// own
import { cashOrderTypes, cashOrderCounterpartyTypes } from './config.js';
import Styles from './styles.m.css';
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
        setClientSelection,
    },
    mapStateToProps: state => ({
        cashboxes:        state.cash.cashboxes,
        counterpartyList: selectCounterpartyList(state),
        nextId:           _.get(state, 'forms.cashOrderForm.fields.nextId'),
    }),
})
@injectIntl
export class CashOrderForm extends Component {
    state = {
        sumType:          'increase',
        sumTypeRadio:     null,
        clientSearchType: 'client',
    };

    componentDidMount() {
        this.props.fetchCashOrderNextId();
        this.props.fetchCashboxes();
        console.log('→ this.props', this.props);
    }


    componentDidUpdate(prevProps) {
        const {
            form: { getFieldValue, setFieldsValue },
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

    _selectOrderType = (value) => {
        switch (value) {
            case cashOrderTypes.INCOME:
                return this.setState({ sumType: 'increase', sumTypeRadio: false });

            case cashOrderTypes.EXPENSE:
                return this.setState({ sumType: 'decrease', sumTypeRadio: false });

            case cashOrderTypes.ADJUSTMENT:
                return this.setState({ sumType: 'increase', sumTypeRadio: true });
            
            default:
                break;
        }
    }

    _setSumType = e => {
        this.setState({ sumType: e.target.value });
        this.props.form.setFieldsValue({[ 'sumType' ]: e.target.value})
    }

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

    render() {
        const {
            cashboxes,
            nextId,
            intl: { formatMessage },
            form: { getFieldDecorator, getFieldValue },
        } = this.props;

        const counterpartyType = getFieldValue('counterpartyType');
 

        return (
            <Form onSubmit={ this._submit }>
                <div className={ Styles.cashOrderId }>
                    <DecoratedInput
                        field='id'
                        initialValue={ nextId }
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
                    >
                        { cashboxes.map(({ id, name }) => (
                            <Option value={ id } key={ id }>
                                { name }
                            </Option>
                        )) }
                    </DecoratedSelect>
                    <DecoratedDatePicker
                        field='date'
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
                        format='YYYY-MM-DD HH:mm'
                        formItemLayout={ formItemLayout }
                        className={ Styles.styledFormItem }
                        cnStyles={ Styles.expandedInput }
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
                        >
                            <Radio value='increase'>
                                { formatMessage({ id: 'cash-order-form.increase' }) }
                            </Radio>
                            <Radio value='decrease'>
                                { formatMessage({ id: 'cash-order-form.decrease' }) }
                            </Radio>
                        </DecoratedRadio>
                    ) }
                    { this.state.sumType === 'increase' && (
                        <DecoratedInputNumber
                            fields={ {} }
                            field='increase'
                            getFieldDecorator={ getFieldDecorator }
                            formItem
                            label={
                                <div>
                                    { formatMessage({ id: 'cash-order-form.sum' }) } <Icon type='caret-up' style={ { color: 'var(--enabled)' } } />
                                </div>
                            }
                            placeholder={ formatMessage({
                                id: 'cash-order-form.sum.placeholder',
                            }) }
                            formItemLayout={ formItemLayout }
                            className={ Styles.styledFormItem }
                            cnStyles={ Styles.expandedInput }
                            rules={ [
                                {
                                    required: true,
                                    message:  formatMessage({
                                        id: 'required_field',
                                    }),
                                },
                            ] }
                        />
                    ) }
                    { this.state.sumType === 'decrease' && (
                        <DecoratedInputNumber
                            fields={ {} }
                            field='decrease'
                            getFieldDecorator={ getFieldDecorator }
                            formItem
                            label={
                                <div>
                                    { formatMessage({ id: 'cash-order-form.sum' }) } <Icon type='caret-down' style={ { color: 'var(--disabled)' } } />
                                </div>
                            }
                            placeholder={ formatMessage({
                                id: 'cash-order-form.sum.placeholder',
                            }) }
                            formItemLayout={ formItemLayout }
                            className={ Styles.styledFormItem }
                            cnStyles={ Styles.expandedInput }
                            rules={ [
                                {
                                    required: true,
                                    message:  formatMessage({
                                        id: 'required_field',
                                    }),
                                },
                            ] }
                        />
                    ) }
                    <DecoratedTextArea
                        fields={ {} }
                        field='description'
                        getFieldDecorator={ getFieldDecorator }
                        formItem
                        label={ formatMessage({ id: 'cash-order-form.comment' }) }
                        formItemLayout={ formItemLayout }
                        className={ Styles.styledFormItem }
                    />
                </div>
                <div className={ Styles.buttonGroup }>
                    <Button icon='printer'>
                        { formatMessage({ id: 'cash-order-form.print' }) }
                    </Button>
                    <Button type='primary' htmlType='submit'>
                        { formatMessage({ id: 'add' }) }
                    </Button>
                </div>
            </Form>
        );
    }

    _renderClientBlock = () => {
        const {
            fields,
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

        const clientSearch = this._renderClientSearch();
        const clientSearchTable = this._renderClientSearchTable();

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
                        {clientSearch}
                        {clientSearchTable}
                    </>
                    
                }
                {this.state.clientSearchType === 'order' && (
                    <DecoratedSearch
                        field='orderId'
                        getFieldDecorator={ getFieldDecorator }
                        formItem
                        label={ formatMessage({
                            id: 'cash-order-form.search',
                        }) }
                        placeholder={ formatMessage({
                            id: 'cash-order-form.search_by_client',
                        }) }
                        formItemLayout={ formItemLayout }
                        className={ Styles.styledFormItem }
                    />
                )}
            </>
        );
    };

    _renderClientSearchTable = () => {
        const {
            searchClientsResult: { searching: clientsSearching, clients },
            setClientSelection,
            form,
        } = this.props;
        console.log('→ searchClientsResult', this.props.searchClientsResult);
        // const searchClientQuery = form.getFieldsValue([ 'searchClientQuery' ]);
        const formFieldsValues = form.getFieldsValue();
        const searchClientQuery = _.get(formFieldsValues, 'searchClientQuery');

        return (
            <ClientsSearchTable
                clientsSearching={ clientsSearching }
                setClientSelection={ setClientSelection }
                visible={ searchClientQuery }
                clients={ clients }
            />
        );
    };

    _renderClientSearch = () => {
        const { getFieldDecorator } = this.props.form;
        const { fields, errors, intl: { formatMessage } } = this.props;

        return (
            <div className={ Styles.client }>
                <DecoratedInput
                    field='searchClientQuery'
                    errors={ errors }
                    defaultGetValueProps
                    fieldValue={ _.get(fields, 'searchClientQuery') }
                    className={ Styles.clientSearchField }
                    formItem
                    colon={ false }
                    label={ formatMessage({
                        id: 'add_order_form.search_client',
                    }) }
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={ formatMessage({
                        id: 'add_order_form.search_client.placeholder',
                    }) }
                />
            </div>
        );
    };

    _renderEmployeeBlock = () => {
        const {
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
            counterpartyList,
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

        return !_.isEmpty(counterpartyList) ? (
            <DecoratedSelect
                field='employeeId'
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
