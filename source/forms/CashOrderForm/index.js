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
        if (this.props.editMode || this.props.printMode) {
            this._setFormFields(this.props.activeCashOrder);
        }

        if (!this.props.editMode && !this.props.printMode) {
            this.props.fetchCashOrderNextId();
            this.props.fetchCashboxes();
        }
    }

    componentDidUpdate(prevProps) {
        const {
            editMode,
            activeCashOrder,
            form: { getFieldValue, setFieldsValue },
            fetchCashOrderForm,
        } = this.props;
        if (
            prevProps.fields.counterpartyType !==
            this.props.fields.counterpartyType
        ) {
            const counterparty = getFieldValue('counterpartyType');
            if (editMode) {
                const activeCounterparty = _.get(this._getActiveCounterpartyType(), 'counterpartyType');
                console.log('→ counterparty', counterparty);
                console.log('→ activeCounterparty', activeCounterparty);
                if (counterparty !== activeCounterparty) {
                    console.log('→ aaa', counterparty);
                    switch (activeCounterparty) {
                        case cashOrderCounterpartyTypes.CLIENT:
                            return setFieldsValue({ clientId: 1, orderId: 2 })

                        case cashOrderCounterpartyTypes.EMPLOYEE:
                            return setFieldsValue({ employeeId: 3 })

                        case cashOrderCounterpartyTypes.BUSINESS_SUPPLIER:
                            return setFieldsValue({ businessSupplierId: 4 })

                        case cashOrderCounterpartyTypes.OTHER:
                            return setFieldsValue({ otherCounterparty: 5 })
                        
                        default:
                            break;
                    }
                }
            }

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
        console.log('→ SET FIELDSconterparty', counterparty);
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

        const counterpartyType = getFieldValue('counterpartyType') || _.get(this._getActiveCounterpartyType(), 'counterpartyType');
        console.log('→ getFV counterPartyType', counterpartyType);
        const cashOrderId = getFieldValue('id');
        console.log('→ this.props', this.props);

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
                    { this._renderCounterpartyBlock(counterpartyType) }
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
            intl: { formatMessage },
        } = this.props;
        const orderId = _.get(order, 'id') || _.get(activeCashOrder, 'orderId');
        const clientId = _.get(client, 'clientId') ||  _.get(activeCashOrder, 'clientId');
        const clientSearch = this._renderClientSearch();
        const clientSearchTable = this._renderClientSearchTable();
        const clientField = this._renderClientField();
        const orderSearchField = this._renderOrderSearch();
        const orderField = this._renderOrderField();
        console.log('→ ClientBlock clientId', clientId);

        return (
            <> 
                { !printMode && (
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
                )}
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
            printMode,
            client,
            activeCashOrder,
            onClientReset,
            form: { getFieldDecorator },
        } = this.props;

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
                <div>
                    <span>{ `${name} ${surname ? surname : ''}` }</span>
                    { !printMode && <Icon type='close' onClick={ () => onClientReset() }/> }
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
            printMode,
            order,
            activeCashOrder,
            onOrderReset,
            form: { getFieldDecorator },
        } = this.props;

        const orderId = _.get(order, 'id') || _.get(activeCashOrder, 'orderId');
        const clientId = _.get(order, 'clientId') || _.get(activeCashOrder, 'clientId');
        const num = _.get(order, 'num') || _.get(activeCashOrder, 'orderNum');
        const clientName = _.get(order, 'clientName') || _.get(activeCashOrder, 'clientName');
        const clientSurname = _.get(order, 'clientSurname') || _.get(activeCashOrder, 'clientSurname');
        console.log('→ _renderOrderField num ', num );

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
                    <div>
                        <span>{ num }</span>
                        { !printMode && <Icon type='close' onClick={ () => onOrderReset() } /> }
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
            editMode,
            counterpartyList,
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

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
                        required: true,
                        message:  formatMessage({
                            id: 'required_field',
                        }),
                    },
                ] }
                disabled={ printMode }
                className={ this._hiddenFormItemStyles(!editMode) }
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
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

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
                        required: true,
                        message:  formatMessage({
                            id: 'required_field',
                        }),
                    },
                ] }
                disabled={ printMode }
                className={ this._hiddenFormItemStyles(printMode) }
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
                className={ this._hiddenFormItemStyles(printMode || editMode) }
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
