// vendor
import React, { Component } from 'react';
import { Form, Select, Button, Radio } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { fetchCashboxes } from 'core/cash/duck';
import {
    onChangeCashOrderForm,
    fetchCashOrderNextId,
    createCashOrder,
} from 'core/forms/cashOrderForm/duck';

import {
    DecoratedSearch,
    DecoratedSelect,
    DecoratedInput,
    DecoratedInputNumber,
    DecoratedDatePicker,
    DecoratedTextArea,
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
        createCashOrder,
    },
    mapStateToProps: state => ({
        cashboxes: state.cash.cashboxes,
        nextId:    _.get(state, 'forms.cashOrderForm.fields.nextId'),
    }),
})
@injectIntl
export class CashOrderForm extends Component {
    state = {
        sumType:          'increase',
        clientSearchType: 'client',
    };

    componentDidMount() {
        this.props.fetchCashOrderNextId();
        this.props.fetchCashboxes();
    }

    _submit = () => {
        const { form, createCashOrder, resetModal } = this.props;

        form.validateFields((err, values) => {
            console.log('→ values', values);
            if (!err) {
                console.log('→ sub');
                createCashOrder(values);
                // form.resetFields();
                // resetModal();
            }
        });
    };

    _setSumType = sumType => this.setState({ sumType });

    _setClientSearchType = clientSearchType =>
        this.setState({ clientSearchType });

    render() {
        const {
            cashboxes,
            nextId,
            intl: { formatMessage },
            form: { getFieldDecorator, getFieldValue },
        } = this.props;
        console.log('→ props', this.props);
        const counterpartyType = getFieldValue('counterpartyType');

        return (
            <Form onSubmit={ this._submit }>
                <div className={ Styles.cashOrderId }>
                    { /* <DecoratedInput
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
                    /> */ }
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
                        getPopupContainer={ trigger => trigger.parentNode }
                        formItemLayout={ formItemLayout }
                        className={ Styles.styledFormItem }
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
                    <RadioGroup
                        onChange={ this._setSumType }
                        value={ this.state.sumType }
                    >
                        <Radio value='increase'>
                            { formatMessage({ id: 'cash-order-form.increase' }) }
                        </Radio>
                        <Radio value='decrease'>
                            { formatMessage({ id: 'cash-order-form.decrease' }) }
                        </Radio>
                    </RadioGroup>
                    { this.state.sumType === 'increase' && (
                        <DecoratedInputNumber
                            field='increase'
                            getFieldDecorator={ getFieldDecorator }
                            formItem
                            label={ formatMessage({ id: 'cash-order-form.sum' }) }
                            placeholder={ formatMessage({
                                id: 'cash-order-form.sum.placeholder',
                            }) }
                            formItemLayout={ formItemLayout }
                            className={ Styles.styledFormItem }
                            cnStyles={ Styles.expandedInput }
                        />
                    ) }
                    { this.state.sumType === 'decrease' && (
                        <DecoratedInputNumber
                            field='decrease'
                            getFieldDecorator={ getFieldDecorator }
                            formItem
                            label={ formatMessage({ id: 'cash-order-form.sum' }) }
                            placeholder={ formatMessage({
                                id: 'cash-order-form.sum.placeholder',
                            }) }
                            formItemLayout={ formItemLayout }
                            className={ Styles.styledFormItem }
                            cnStyles={ Styles.expandedInput }
                        />
                    ) }
                    <DecoratedTextArea
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
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

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
                        onChange={ this._setClientSearchType }
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
                <DecoratedSearch
                    field='clientId'
                    getFieldDecorator={ getFieldDecorator }
                    formItem
                    label={ formatMessage({
                        id: 'cash-order-form.search',
                    }) }
                    placeholder={ formatMessage({
                        id: 'cash-order-form.search_by_client',
                    }) }
                    // onChange={ ({ target: { value } }) =>
                    //     this.handleOrdersSearch(value)
                    // }
                    formItemLayout={ formItemLayout }
                    className={ Styles.styledFormItem }
                />
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
                    // onChange={ ({ target: { value } }) =>
                    //     this.handleOrdersSearch(value)
                    // }
                    formItemLayout={ formItemLayout }
                    className={ Styles.styledFormItem }
                />
            </>
        );
    };

    _renderEmployeeBlock = () => {
        const {
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

        return (
            <DecoratedInput
                field='employeeId'
                formItem
                formItemLayout={ formItemLayout }
                // rules={ [
                //     {
                //         required: true,
                //         message:  formatMessage({
                //             id: 'cash-creation-form.name.validation',
                //         }),
                //     },
                // ] }
                getFieldDecorator={ getFieldDecorator }
            />
        );
    };

    _renderSupplierBlock = () => {
        const {
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

        return (
            <DecoratedInput
                field='businessSupplierId'
                formItem
                formItemLayout={ formItemLayout }
                // rules={ [
                //     {
                //         required: true,
                //         message:  formatMessage({
                //             id: 'cash-creation-form.name.validation',
                //         }),
                //     },
                // ] }
                getFieldDecorator={ getFieldDecorator }
            />
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
                formItemLayout={ formItemLayout }
                // rules={ [
                //     {
                //         required: true,
                //         message:  formatMessage({
                //             id: 'cash-creation-form.name.validation',
                //         }),
                //     },
                // ] }
                getFieldDecorator={ getFieldDecorator }
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
