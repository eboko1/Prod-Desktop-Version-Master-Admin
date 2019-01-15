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
    onClientReset,
    onOrderReset,
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
        onClientReset,
        onOrderReset,
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
        const {editMode, printMode, activeCashOrder, fetchCashOrderNextId, fetchCashboxes} = this.props;

        if (editMode || printMode) {
            this._setFormFields(activeCashOrder);
            this._selectOrderType(_.get(activeCashOrder, 'type'));
        }

        if (!editMode && !printMode) {
            fetchCashOrderNextId();
            fetchCashboxes();
        }
    }

    componentDidUpdate(prevProps) {
        const {
            editMode,
            fields,
            form: { getFieldValue, setFieldsValue },
        } = this.props;

        if (
            _.get(prevProps, 'fields.counterpartyType.value') !==
            _.get(fields, 'counterpartyType.value')
        ) {
            const counterparty = getFieldValue('counterpartyType');
            if (editMode) {
                const activeCounterparty = _.get(this._getActiveCounterpartyType(), 'counterpartyType');
                if (counterparty !== activeCounterparty) {
                    switch (activeCounterparty) {
                        case cashOrderCounterpartyTypes.CLIENT:
                            this._fetchCounterpartyFormData(counterparty)
                            setFieldsValue({ clientId: null, orderId: null })
                            break;

                        case cashOrderCounterpartyTypes.EMPLOYEE:
                            this._fetchCounterpartyFormData(counterparty)
                            setFieldsValue({ employeeId: null })
                            break;

                        case cashOrderCounterpartyTypes.BUSINESS_SUPPLIER:
                            this._fetchCounterpartyFormData(counterparty)
                            setFieldsValue({ businessSupplierId: null })
                            break;

                        case cashOrderCounterpartyTypes.OTHER:
                            this._fetchCounterpartyFormData(counterparty)
                            setFieldsValue({ otherCounterparty: null })
                            break;
                        
                        default:
                            break;
                    }
                }
            }

            this._fetchCounterpartyFormData(counterparty);
        }
    }

    _fetchCounterpartyFormData = counterparty => {
        switch (counterparty) {
            case cashOrderCounterpartyTypes.EMPLOYEE:
                return this.props.fetchCashOrderForm('employees');

            case cashOrderCounterpartyTypes.BUSINESS_SUPPLIER:
                return this.props.fetchCashOrderForm('business_suppliers');

            default:
                break;
        } 
    }

    _getActiveFieldsMap = () => _.pickBy(
        _.pick(this.props.activeCashOrder, [
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
        ]),
        value => !_.isNil(value),
    )

    _setFormFields = () => {
        const { form } = this.props;
        const fieldsMap = this._getActiveFieldsMap();
        const counterparty = this._getActiveCounterpartyType();
        const normalizedDatetime = moment(fieldsMap.datetime);
        const sumType = !_.isNil(fieldsMap.increase) ? 'increase' : 'decrease';
        const normalizedFieldsMap = {
            ...fieldsMap,
            sumType,
            ...counterparty,
            datetime: normalizedDatetime,
        };

        form.setFieldsValue(normalizedFieldsMap);
        this.setState({ sumType });
    };

    _getActiveCounterpartyType = () => {
        const fieldsMap = this._getActiveFieldsMap();

        let counterparty = {};
        if (fieldsMap.clientId) {
            counterparty = {
                counterpartyType: cashOrderCounterpartyTypes.CLIENT,
                clientId:         fieldsMap.clientId,
                orderId:          fieldsMap.orderId,
            }
        }
        if (fieldsMap.employeeId) {
            counterparty = {
                counterpartyType: cashOrderCounterpartyTypes.EMPLOYEE,
                employeeId:       fieldsMap.employeeId,
            }
        }

        if (fieldsMap.businessSupplierId) {
            counterparty = {
                counterpartyType:   cashOrderCounterpartyTypes.BUSINESS_SUPPLIER,
                businessSupplierId: fieldsMap.businessSupplierId,
            }
        }

        if (fieldsMap.otherCounterparty) {
            counterparty = {
                counterpartyType:  cashOrderCounterpartyTypes.OTHER,
                otherCounterparty: fieldsMap.otherCounterparty,
            }
        }

        return counterparty;
    }

    _submit = event => {
        event.preventDefault();
        const { form, createCashOrder, resetModal, editMode } = this.props;

        form.validateFields((err, values) => {
            if (!err) {
                createCashOrder({ ...values, editMode });
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

    _resetClient = () => {
        this.props.form.resetFields('clientId')
        this.props.onClientReset();
    }

    _resetOrder = () => {
        this.props.form.setFieldsValue({ 'orderId': null });
        this.props.onOrderReset();
    }

    _hiddenFormItemStyles = type =>
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

        const cashOrderId = getFieldValue('id');

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
                        initialValue={ cashOrderTypes.INCOME }
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
                        initialValue={ moment() }
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
                    { this._renderClientBlock() }
                    { this._renderEmployeeBlock() }
                    { this._renderSupplierBlock() }
                    { this._renderOtherBlock() }
                </div>
                <div className={ Styles.step }>
                    { this.state.sumTypeRadio &&
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
                    }
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
                        className={ this._hiddenFormItemStyles(
                            this.state.sumType === 'increase',
                        ) }
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
                        className={ this._hiddenFormItemStyles(
                            this.state.sumType === 'decrease',
                        ) }
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
                        formatter={ numeralFormatter }
                        parser={ numeralParser }
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
                    <Button
                        type={ printMode ? 'primary' : 'default' }
                        className={ printMode ? Styles.printButton : '' }
                        icon='printer'
                        onClick={ () => this.props.printCashOrder(cashOrderId) }
                    >
                        { formatMessage({ id: 'cash-order-form.print' }) }
                    </Button>
                    { printMode || editMode ? null : (
                        <Button type='primary' htmlType='submit'>
                            { formatMessage({ id: 'add' }) }
                        </Button>
                    ) }
                    { editMode && (
                        <Button type='primary' htmlType='submit'>
                            { formatMessage({ id: 'edit' }) }
                        </Button>
                    ) }
                </div>
            </Form>
        );
    }
    /* eslint-disable complexity */
    _renderClientBlock = () => {
        const {
            printMode,
            client,
            activeCashOrder,
            order,
            form: { getFieldValue },
            intl: { formatMessage },
        } = this.props;
        const orderId = _.get(order, 'id') || _.get(activeCashOrder, 'orderId');
        const clientId = _.get(client, 'clientId') ||  _.get(activeCashOrder, 'clientId');
        const clientSearch = this._renderClientSearch();
        const clientSearchTable = this._renderClientSearchTable();
        const clientField = this._renderClientField();
        const orderSearchField = this._renderOrderSearch();
        const orderField = this._renderOrderField();

        const isActive = getFieldValue('counterpartyType') === cashOrderCounterpartyTypes.CLIENT;

        return (
            <> 
                { !printMode && (isActive ? (
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
                ) : null)}
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
            form: { getFieldValue },
        } = this.props;

        const isActive = getFieldValue('counterpartyType') === cashOrderCounterpartyTypes.CLIENT;

        return (
            <div className={ Styles.client }>
                <DecoratedInput
                    field='searchClientQuery'
                    errors={ errors }
                    defaultGetValueProps
                    fieldValue={ _.get(fields, 'searchClientQuery') }
                    formItem
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={ formatMessage({
                        id: 'add_order_form.search_client.placeholder',
                    }) }
                    className={ this._hiddenFormItemStyles(isActive) }
                />
            </div>
        );
    };

    _renderClientField = () => {
        const {
            printMode,
            client,
            activeCashOrder,
            form: { getFieldDecorator, getFieldValue },
        } = this.props;

        const isActive = getFieldValue('counterpartyType') === cashOrderCounterpartyTypes.CLIENT;

        const clientId = _.get(client, 'clientId') ||  _.get(activeCashOrder, 'clientId');
        const name = _.get(client, 'name') ||  _.get(activeCashOrder, 'clientName');
        const surname = _.get(client, 'surname') ||  _.get(activeCashOrder, 'clientSurname');

        return (
            <div className={ Styles.clientField }>
                <DecoratedInput
                    field='clientId'
                    initialValue={ clientId }
                    getFieldDecorator={ getFieldDecorator }
                    cnStyles={ Styles.hiddenField }
                    disabled
                />
                { isActive &&
                    <div>
                        <span>{ `${name} ${surname ? surname : ''}` }</span>
                        { !printMode && <Icon type='close' onClick={ () => this._resetClient() }/> }
                    </div>
                }
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
            printMode,
            order,
            activeCashOrder,
            form: { getFieldDecorator, getFieldValue },
        } = this.props;

        const orderId = _.get(order, 'id') || _.get(activeCashOrder, 'orderId');
        const clientId = _.get(order, 'clientId') || _.get(activeCashOrder, 'clientId');
        const num = _.get(order, 'num') || _.get(activeCashOrder, 'orderNum');
        const clientName = _.get(order, 'clientName') || _.get(activeCashOrder, 'clientName');
        const clientSurname = _.get(order, 'clientSurname') || _.get(activeCashOrder, 'clientSurname');

        const isActive = getFieldValue('counterpartyType') === cashOrderCounterpartyTypes.CLIENT;

        return (
            <>
                <div className={ Styles.clientField }>
                    <DecoratedInput
                        field='orderId'
                        initialValue={ orderId }
                        getFieldDecorator={ getFieldDecorator }
                        cnStyles={ Styles.hiddenField }
                        disabled
                    />
                    { isActive &&
                        <div>
                            <span>{ num }</span>
                            { !printMode && <Icon type='close' onClick={ () => this._resetOrder() } /> }
                        </div>
                    }
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
                        {this.state.clientSearchType !== 'client' && (
                            <div>
                                { clientName }
                                { clientSurname }
                            </div>
                        )}
                    </>
                }
            </>
        );
    };

    _renderEmployeeBlock = () => {
        const {
            printMode,
            counterpartyList,
            form: { getFieldDecorator, getFieldValue },
            intl: { formatMessage },
        } = this.props;

        const isActive = getFieldValue('counterpartyType') === cashOrderCounterpartyTypes.EMPLOYEE;

        return (
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
                        required: isActive,
                        message:  formatMessage({
                            id: 'required_field',
                        }),
                    },
                ] }
                disabled={ printMode }
                className={ this._hiddenFormItemStyles(isActive) }
            >
                {
                    !_.isEmpty(counterpartyList)
                        ? counterpartyList.map(({ id, name, disabled }) => (
                            <Option value={ id } key={ id } disabled={ disabled }>
                                { name }
                            </Option>
                        )) : []
                }
            </DecoratedSelect>
        )
    };

    _renderSupplierBlock = () => {
        const {
            printMode,
            counterpartyList,
            form: { getFieldDecorator, getFieldValue },
            intl: { formatMessage },
        } = this.props;

        const isActive = getFieldValue('counterpartyType') === cashOrderCounterpartyTypes.BUSINESS_SUPPLIER;

        return (
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
                        required: isActive,
                        message:  formatMessage({
                            id: 'required_field',
                        }),
                    },
                ] }
                disabled={ printMode }
                className={ this._hiddenFormItemStyles(isActive) }
            >
                { !_.isEmpty(counterpartyList)
                    ? counterpartyList.map(({ id, name }) => (
                        <Option value={ id } key={ id }>
                            { name }
                        </Option>
                    )) : []
                }
            </DecoratedSelect>
        )
    };

    _renderOtherBlock = () => {
        const {
            printMode,
            editMode,
            form: { getFieldDecorator, getFieldValue },
            intl: { formatMessage },
        } = this.props;

        const isActive = getFieldValue('counterpartyType') === cashOrderCounterpartyTypes.OTHER;

        return (
            <DecoratedInput
                field='otherCounterparty'
                formItem
                formItemLayout={ expandedWrapperFormItemLayout }
                getFieldDecorator={ getFieldDecorator }
                rules={ [
                    {
                        required: isActive,
                        message:  formatMessage({
                            id: 'required_field',
                        }),
                    },
                ] }
                disabled={ printMode }
                placeholder={ formatMessage({
                    id: 'cash-order-form.other_counterparty.placeholder',
                }) }
                className={ this._hiddenFormItemStyles(isActive) }
            />
        );
    };
}
