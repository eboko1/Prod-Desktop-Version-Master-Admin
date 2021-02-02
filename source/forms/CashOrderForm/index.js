// vendor
import React, { Component } from "react";
import { Form, Select, Button, Radio, Icon, message } from "antd";
import { injectIntl } from "react-intl";
import _ from "lodash";
import moment from "moment";
import { v4 } from "uuid";
import classNames from "classnames/bind";

// proj
import { fetchCashboxes } from "core/cash/duck";
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
    printCashOrder,
    onOrderSelect,
    onClientFieldsReset,
    selectClientOrders,
} from "core/forms/cashOrderForm/duck";

import { Loader } from "commons";
import { ClientsSearchTable } from "forms/OrderForm/OrderFormTables";
import { CashSelectedClientOrdersTable } from "components";
import {
    DecoratedSearch,
    DecoratedSelect,
    DecoratedInput,
    DecoratedInputNumber,
    DecoratedDatePicker,
    DecoratedTextArea,
    DecoratedRadio,
} from "forms/DecoratedFields";
import { withReduxForm2, numeralFormatter, numeralParser } from "utils";

// own
import { cashOrderTypes, cashOrderCounterpartyTypes } from "./config.js";
import Styles from "./styles.m.css";
const cx = classNames.bind(Styles);
const Option = Select.Option;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
};

//const expandedWrapperFormItemLayout = {
//    wrapperCol: { span: 24 },
//};

const reverseFromItemLayout = {
    labelCol: { span: 15 },
    wrapperCol: { span: 7 },
};

const getActiveFieldsMap = activeCashOrder => {
    return _.pickBy(
        _.pick(activeCashOrder, [
            "id",
            "type",
            "businessSupplierId",
            "cashBoxId",
            "clientId",
            "orderId",
            "description",
            "employeeId",
            "increase",
            "decrease",
            "otherCounterparty",
            "datetime",
            "tag",
        ]),
        value => !_.isNil(value),
    );
};

@withReduxForm2({
    name: "cashOrderForm",
    actions: {
        change: onChangeCashOrderForm,
        fetchCashboxes,
        fetchCashOrderNextId,
        fetchCashOrderForm,
        createCashOrder,
        onClientSelect,
        onOrderSelect,
        onClientReset,
        onClientFieldsReset,
        onOrderReset,
        printCashOrder,
    },
    mapStateToProps: state => {
        return {
            activeCashOrder: _.get(state, "modals.modalProps.cashOrderEntity"),
            cashboxes: state.cash.cashboxes,
            client: selectClient(state),
            clientFetching: state.ui.clientFetching,
            clientOrdersFetching: state.ui.clientOrdersFetching,
            counterpartyList: selectCounterpartyList(state),
            nextId: _.get(state, "forms.cashOrderForm.fields.nextId"),
            order: selectOrder(state),
        };
    },
})
@injectIntl
export class CashOrderForm extends Component {
    state = {
        sumType: "increase",
        sumTypeRadio: null,
        clientSearchType: "client",
        editing: false,
        errorValidationPanel: false,
        timerId: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.editMode && !state.editing) {
            return {
                sumType: !_.isNil(
                    _.get(
                        getActiveFieldsMap(props.activeCashOrder),
                        "increase",
                    ),
                )
                    ? "increase"
                    : "decrease",
                editing: true,
            };
        }

        return null;
    }

    async componentDidMount() {
        const {
            editMode,
            printMode,
            fromOrder,
            activeCashOrder,
            fetchCashOrderNextId,
            fetchCashboxes,
            cashboxes,
            intl: { formatMessage },
            form: { setFieldsValue },
        } = this.props;

        const defaultTagValue = `${formatMessage({
            id: `cash-order-form.dafault_tag`,
        })}`;

        if (editMode || printMode) {
            this._setFormFields(activeCashOrder);
            this._selectOrderType(_.get(activeCashOrder, "type"));
        }

        if (!editMode && !printMode && !fromOrder) {
            fetchCashOrderNextId();
            fetchCashboxes();
            setFieldsValue({ tag: defaultTagValue, cashBoxId: activeCashOrder.cashBoxId || _.get(cashboxes, "[0].id")});
        }

        if(fromOrder) {
            await fetchCashOrderNextId();
            await fetchCashboxes();
            await this._selectOrderType(_.get(activeCashOrder, "type"));
            await setFieldsValue(activeCashOrder);
        }
    }

    componentDidUpdate(prevProps) {
        const {
            editMode,
            fromOrder,
            activeCashOrder,
            fields,
            form: { getFieldValue, setFieldsValue, resetFields },
        } = this.props;

        if (
            _.get(prevProps, "fields.counterpartyType.value") !==
            _.get(fields, "counterpartyType.value")
        ) {
            const counterparty = getFieldValue("counterpartyType");
            this._fetchCounterpartyFormData(counterparty);

            if (!editMode) {
                this._setNullToFieldsValue();
                this.props.onClientFieldsReset();
            }

            if (editMode) {
                const activeCounterparty = _.get(
                    this._getActiveCounterpartyType(),
                    "counterpartyType",
                );

                if (counterparty !== activeCounterparty) {
                    this._setNullToFieldsValue();
                }
            }
        }

        if (
            editMode &&
            !_.isNil(_.get(prevProps, "fields.type.value")) &&
            _.get(prevProps, "fields.type.value") !==
                _.get(fields, "type.value") &&
            _.get(fields, "type.value") === cashOrderTypes.ADJUSTMENT
        ) {
            this.setState(prevState => {
                setFieldsValue({ [prevState.sumType]: null });

                return {
                    sumType: getFieldValue("sumType"),
                    sumTypeRadio: true,
                };
            });
        }
    }

    _setNullToFieldsValue = () => {
        this.props.form.setFieldsValue({
            clientId: null,
            orderId: null,
            employeeId: null,
            businessSupplierId: null,
            otherCounterparty: null,
        });
    };

    _fetchCounterpartyFormData = counterparty => {
        switch (counterparty) {
            case cashOrderCounterpartyTypes.EMPLOYEE:
                return this.props.fetchCashOrderForm("employees");

            case cashOrderCounterpartyTypes.BUSINESS_SUPPLIER:
                return this.props.fetchCashOrderForm("business_suppliers?all=true");

            default:
                break;
        }
    };

    _setFormFields = () => {
        const { form } = this.props;
        const fieldsMap = getActiveFieldsMap(this.props.activeCashOrder);
        const counterparty = this._getActiveCounterpartyType();
        const normalizedDatetime = moment(fieldsMap.datetime);
        const sumType = !_.isNil(fieldsMap.increase) ? "increase" : "decrease";
        const sumTypeRadio = fieldsMap.type === cashOrderTypes.ADJUSTMENT;
        const normalizedFieldsMap = {
            ...fieldsMap,
            sumType,
            sumTypeRadio,
            ...counterparty,
            datetime: normalizedDatetime,
        };

        this.setState({ sumTypeRadio });
        form.setFieldsValue(normalizedFieldsMap);
    };

    _getActiveCounterpartyType = () => {
        const fieldsMap = getActiveFieldsMap(this.props.activeCashOrder);

        let counterparty = {};
        if (fieldsMap.clientId) {
            counterparty = {
                counterpartyType: cashOrderCounterpartyTypes.CLIENT,
                clientId: fieldsMap.clientId,
                orderId: fieldsMap.orderId,
            };
        }
        if (fieldsMap.employeeId) {
            counterparty = {
                counterpartyType: cashOrderCounterpartyTypes.EMPLOYEE,
                employeeId: fieldsMap.employeeId,
            };
        }

        if (fieldsMap.businessSupplierId) {
            counterparty = {
                counterpartyType: cashOrderCounterpartyTypes.BUSINESS_SUPPLIER,
                businessSupplierId: fieldsMap.businessSupplierId,
            };
        }

        if (fieldsMap.otherCounterparty) {
            counterparty = {
                counterpartyType: cashOrderCounterpartyTypes.OTHER,
                otherCounterparty: fieldsMap.otherCounterparty,
            };
        }

        return counterparty;
    };

    _submit = event => {
        event.preventDefault();
        const { form, createCashOrder, resetModal, editMode, fromOrder, fetchOrder } = this.props;

        form.validateFields(async (err, values) => {
            if (_.has(err, "clientId") || _.has(err, "orderId")) {
                this._handleErrorValidationPanel();
            }

            if (!err) {
                const cashOrder = {
                    clientId: values.hasOwnProperty("clientId")
                        ? values.clientId
                        : null,
                    orderId: values.hasOwnProperty("orderId")
                        ? values.orderId
                        : null,
                    editMode,
                    ...values,
                };
                await createCashOrder(cashOrder);
                form.resetFields();
                resetModal();

                if(fromOrder) await fetchOrder();
            }
        });
    };

    _selectOrderType = value => {
        const {
            form: { setFieldsValue },
            intl: { formatMessage },
            editMode,
            printMode,
        } = this.props;

        const defaultTagValue = `${formatMessage({
            id: `cash-order-form.dafault_tag`,
        })}`;

        switch (value) {
            case cashOrderTypes.INCOME:
                return this.setState(prevState => {
                    setFieldsValue({ [prevState.sumType]: null });
                    if (!editMode && !printMode)
                        setFieldsValue({ tag: defaultTagValue });

                    return {
                        sumType: "increase",
                        sumTypeRadio: false,
                    };
                });

            case cashOrderTypes.EXPENSE:
                return this.setState(prevState => {
                    setFieldsValue({ [prevState.sumType]: null });
                    if (!editMode && !printMode) setFieldsValue({ tag: null });

                    return {
                        sumType: "decrease",
                        sumTypeRadio: false,
                    };
                });

            case cashOrderTypes.ADJUSTMENT:
                if (!this.props.editMode) {
                    return this.setState(prevState => {
                        setFieldsValue({ [prevState.sumType]: null });
                        if (!editMode && !printMode)
                            setFieldsValue({ tag: null });

                        return {
                            sumType: "increase",
                            sumTypeRadio: true,
                        };
                    });
                }
                break;

            default:
                break;
        }
    };

    _setSumType = e => {
        const sumType = e.target.value;
        this.setState(prevState => {
            this.props.form.setFieldsValue({
                sumType,
                [prevState.sumType]: null,
            });

            return { sumType };
        });
    };

    _setClientSearchType = e => {
        this._resetClientCounterparty();
        this.setState({ clientSearchType: e.target.value });
    };

    _handleClientSelection = client => {
        this.props.form.setFieldsValue({ clientId: client.clientId });
        this.props.onClientSelect(client);
    };

    _handleOrderSelection = order => {
        this.props.form.setFieldsValue({
            orderId: order.id,
            clientId: order.clientId,
            increase: order.remainingSum,
        });
        this.props.onOrderSelect(order);
    };

    _setCounterpartyType = type => {
        const counterparty = _.get(this.props.fields, "counterpartyType.value");
        const activeCounterparty = _.get(
            this._getActiveCounterpartyType(),
            "counterpartyType",
        );

        if (type === cashOrderCounterpartyTypes.CLIENT) {
            this._resetClientCounterparty();
        }
    };

    _getClientId = () => {
        const searchEntity = this.props[this.state.clientSearchType];

        const clientId =
            _.get(searchEntity, "clientId") || this.state.editing
                ? _.get(searchEntity, "clientId") ||
                  this.props.form.getFieldValue("clientId")
                : _.get(this.props.activeCashOrder, "clientId");

        return clientId;
    };

    _resetClient = editMode => {
        this.props.form.setFieldsValue({
            clientId: null,
            orderId: null,
        });
        this.props.onClientReset();

        if (editMode) {
            this.setState({ editing: true });
        }
    };

    _resetOrder = editMode => {
        this.props.form.setFieldsValue({ orderId: null });
        this.props.onOrderReset();

        if (editMode) {
            this.setState({ editing: true });
        }
    };

    _resetClientCounterparty = () => {
        this.props.onClientReset();
        this.props.onClientFieldsReset();
    };

    _handleErrorValidationPanel = () => {
        const setTimer = () => {
            const timerId = setTimeout(() => {
                this.setState(state => ({
                    errorValidationPanel: !state.errorValidationPanel,
                    timerId: null,
                }));
            }, 3000);
            this.setState(() => ({ timerId: timerId }));
        };

        if (this.state.timerId) {
            clearTimeout(this.state.timerId);
            setTimer();
            return;
        }

        this.setState(state => ({
            errorValidationPanel: !state.errorValidationPanel,
        }));
        setTimer();
    };

    _hiddenFormItemStyles = type =>
        cx({
            hiddenFormItem: !type,
            styledFormItem: true,
        });

    _hiddenResetStyles = prop =>
        cx({
            hiddenIcon: !prop,
            clientOrderField: true,
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

        const cashOrderId = getFieldValue("id");

        //https://github.com/ant-design/ant-design/issues/8880#issuecomment-402590493
        // getFieldDecorator("clientId", { initialValue: void 0 });
        return (
            <Form onSubmit={this._submit}>
                <div className={Styles.cashOrderId}>
                    <DecoratedInput
                        field="id"
                        initialValue={nextId || cashOrderId}
                        getFieldDecorator={getFieldDecorator}
                        formItem
                        label={formatMessage({
                            id: "cash-order-form.cash_order_num",
                        })}
                        formItemLayout={formItemLayout}
                        className={Styles.styledFormItem}
                        disabled
                    />
                </div>
                <div className={Styles.step}>
                    <DecoratedSelect
                        field="type"
                        initialValue={cashOrderTypes.INCOME}
                        getFieldDecorator={getFieldDecorator}
                        formItem
                        label={formatMessage({
                            id: "cash-order-form.order_type",
                        })}
                        placeholder={formatMessage({
                            id: "cash-order-form.order_type.placeholder",
                        })}
                        rules={[
                            {
                                required: true,
                                message: formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        getPopupContainer={trigger => trigger.parentNode}
                        formItemLayout={formItemLayout}
                        className={Styles.styledFormItem}
                        onSelect={this._selectOrderType}
                        disabled={printMode}
                    >
                        {Object.values(cashOrderTypes).map(type => (
                            <Option value={type} key={type}>
                                {formatMessage({
                                    id: `cash-order-form.type.${type}`,
                                })}
                            </Option>
                        ))}
                    </DecoratedSelect>
                    <DecoratedSelect
                        field="cashBoxId"
                        getFieldDecorator={getFieldDecorator}
                        formItem
                        label={formatMessage({ id: "cash-order-form.cashbox" })}
                        placeholder={formatMessage({
                            id: "cash-order-form.cashbox.placeholder",
                        })}
                        rules={[
                            {
                                required: true,
                                message: formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        initialValue={_.get(cashboxes, "[0].id")}
                        getPopupContainer={trigger => trigger.parentNode}
                        formItemLayout={formItemLayout}
                        className={Styles.styledFormItem}
                        disabled={printMode}
                    >
                        {cashboxes.map(({ id, name }) => (
                            <Option value={id} key={id}>
                                {name}
                            </Option>
                        ))}
                    </DecoratedSelect>
                    <DecoratedDatePicker
                        field="datetime"
                        initialValue={moment()}
                        getFieldDecorator={getFieldDecorator}
                        formItem
                        label={formatMessage({ id: "cash-order-form.date" })}
                        rules={[
                            {
                                required: true,
                                message: formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        formatMessage={formatMessage}
                        getCalendarContainer={trigger => trigger.parentNode}
                        format="YYYY-MM-DD"
                        formItemLayout={formItemLayout}
                        className={Styles.styledFormItem}
                        cnStyles={Styles.expandedInput}
                        disabled={printMode}
                    />
                </div>
                <div className={Styles.step}>
                    <DecoratedSelect
                        field="counterpartyType"
                        getFieldDecorator={getFieldDecorator}
                        formItem
                        label={formatMessage({
                            id: "cash-order-form.counterparty_type",
                        })}
                        placeholder={formatMessage({
                            id: "cash-order-form.counterparty_type.placeholder",
                        })}
                        rules={[
                            {
                                required: true,
                                message: formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        initialValue={cashOrderCounterpartyTypes.CLIENT}
                        getPopupContainer={trigger => trigger.parentNode}
                        formItemLayout={formItemLayout}
                        className={Styles.styledFormItem}
                        disabled={printMode}
                        onSelect={type => this._setCounterpartyType(type)}
                    >
                        {Object.values(cashOrderCounterpartyTypes).map(type => (
                            <Option value={type} key={type}>
                                {formatMessage({
                                    id: `cash-order-form.counterparty.${type}`,
                                })}
                            </Option>
                        ))}
                    </DecoratedSelect>
                    {this._renderClientBlock()}
                    {this._renderEmployeeBlock()}
                    {this._renderSupplierBlock()}
                    {this._renderOtherBlock()}
                </div>
                <div className={Styles.step}>
                    <DecoratedRadio
                        field="sumType"
                        formItem
                        getFieldDecorator={getFieldDecorator}
                        className={this._hiddenFormItemStyles(
                            this.state.sumTypeRadio,
                        )}
                        onChange={e => this._setSumType(e)}
                        initialValue={this.state.sumType}
                        disabled={printMode}
                    >
                        <Radio value="increase">
                            {formatMessage({
                                id: "cash-order-form.increase",
                            })}
                        </Radio>
                        <Radio value="decrease">
                            {formatMessage({
                                id: "cash-order-form.decrease",
                            })}
                        </Radio>
                    </DecoratedRadio>
                    <DecoratedInputNumber
                        fields={{}}
                        field="increase"
                        getFieldDecorator={getFieldDecorator}
                        formItem
                        label={
                            <div>
                                {formatMessage({
                                    id: "cash-order-form.sum",
                                })}{" "}
                                <Icon
                                    type="caret-up"
                                    style={{ color: "var(--enabled)" }}
                                />
                            </div>
                        }
                        placeholder={formatMessage({
                            id: "cash-order-form.sum.placeholder",
                        })}
                        formItemLayout={formItemLayout}
                        className={this._hiddenFormItemStyles(
                            this.state.sumType === "increase",
                        )}
                        cnStyles={Styles.expandedInput}
                        rules={[
                            {
                                required: this.state.sumType === "increase",
                                message: formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        disabled={printMode}
                        formatter={numeralFormatter}
                        parser={numeralParser}
                    />
                    <DecoratedInputNumber
                        fields={{}}
                        field="decrease"
                        getFieldDecorator={getFieldDecorator}
                        formItem
                        label={
                            <div>
                                {formatMessage({
                                    id: "cash-order-form.sum",
                                })}{" "}
                                <Icon
                                    type="caret-down"
                                    style={{ color: "var(--disabled)" }}
                                />
                            </div>
                        }
                        placeholder={formatMessage({
                            id: "cash-order-form.sum.placeholder",
                        })}
                        formItemLayout={formItemLayout}
                        className={this._hiddenFormItemStyles(
                            this.state.sumType === "decrease",
                        )}
                        cnStyles={Styles.expandedInput}
                        rules={[
                            {
                                required: this.state.sumType === "decrease",
                                message: formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        disabled={printMode}
                        formatter={numeralFormatter}
                        parser={numeralParser}
                    />
                    <DecoratedInput
                        fields={{}}
                        field="tag"
                        getFieldDecorator={getFieldDecorator}
                        formItem
                        label={formatMessage({
                            id: "cash-table.tag",
                        })}
                        formItemLayout={formItemLayout}
                        className={Styles.styledFormItem}
                    />
                    <DecoratedTextArea
                        fields={{}}
                        field="description"
                        getFieldDecorator={getFieldDecorator}
                        formItem
                        label={formatMessage({ id: "cash-order-form.comment" })}
                        formItemLayout={formItemLayout}
                        className={Styles.styledFormItem}
                        disabled={printMode}
                    />
                </div>
                {this.state.errorValidationPanel && (
                    <div className={Styles.error}>
                        {formatMessage({
                            id: "cash-order-form.client_and_order_are_required",
                        })}
                    </div>
                )}
                <div className={Styles.buttonGroup}>
                    <Button
                        type={printMode ? "primary" : "default"}
                        className={printMode ? Styles.printButton : ""}
                        icon="printer"
                        onClick={() => this.props.printCashOrder(cashOrderId)}
                    >
                        {formatMessage({ id: "cash-order-form.print" })}
                    </Button>
                    {printMode || editMode ? null : (
                        <Button type="primary" htmlType="submit">
                            {formatMessage({ id: "add" })}
                        </Button>
                    )}
                    {editMode && (
                        <Button type="primary" htmlType="submit">
                            {formatMessage({ id: "edit" })}
                        </Button>
                    )}
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

        const orderId =
            _.get(order, "id") || this.state.editing
                ? _.get(order, "id") || getFieldValue("orderId")
                : _.get(activeCashOrder, "orderId");
        const clientId =
            _.get(client, "clientId") || this.state.editing
                ? _.get(client, "clientId") || getFieldValue("clientId")
                : _.get(activeCashOrder, "clientId");

        const clientSearch = this._renderClientSearch();
        const clientSearchTable = this._renderClientSearchTable();
        const clientField = this._renderClientField();

        const orderSearchField = this._renderOrderSearch();
        const orderField = this._renderOrderField();

        const isActive =
            getFieldValue("counterpartyType") ===
            cashOrderCounterpartyTypes.CLIENT;

        return (
            <>
                {!printMode &&
                    (isActive ? (
                        <>
                            <Form.Item
                                className={Styles.switcher}
                                {...reverseFromItemLayout}
                                label={formatMessage({
                                    id:
                                        "cash-order-form.search_by_client_or_order",
                                })}
                            >
                                <RadioGroup
                                    onChange={e => this._setClientSearchType(e)}
                                    value={this.state.clientSearchType}
                                    disabled={printMode}
                                >
                                    <Radio value="client">
                                        {formatMessage({
                                            id:
                                                "cash-order-form.switch_by_client",
                                        })}
                                    </Radio>
                                    <Radio value="order">
                                        {formatMessage({
                                            id:
                                                "cash-order-form.switch_by_order",
                                        })}
                                    </Radio>
                                </RadioGroup>
                            </Form.Item>
                            {this.state.clientSearchType === "client" && (
                                <>
                                    {Boolean(!clientId) && clientSearch}
                                    {Boolean(!clientId) && clientSearchTable}
                                    {clientField}
                                    {Boolean(clientId) &&
                                        Boolean(!orderId) &&
                                        (this.props.clientOrdersFetching ? (
                                            <Loader
                                                loading={
                                                    this.props
                                                        .clientOrdersFetching
                                                }
                                            />
                                        ) : (
                                            <CashSelectedClientOrdersTable
                                                type="client"
                                                selectOrder={
                                                    this._handleOrderSelection
                                                }
                                                selectedClient={client}
                                            />
                                        ))}
                                    {orderField}
                                </>
                            )}
                            {this.state.clientSearchType === "order" && (
                                <>
                                    {Boolean(!orderId) && orderSearchField}
                                    {Boolean(!orderId) &&
                                        (this.props.form.getFieldValue(
                                            "searchOrderQuery",
                                        ) ? (
                                            <CashSelectedClientOrdersTable
                                                type="order"
                                                selectOrder={
                                                    this._handleOrderSelection
                                                }
                                                searchOrdersResult={
                                                    this.props
                                                        .searchOrdersResult
                                                }
                                                searching={
                                                    this.props
                                                        .clientOrdersFetching
                                                }
                                                searchOrderQuery={this.props.form.getFieldValue(
                                                    "searchOrderQuery",
                                                )}
                                            />
                                        ) : null)}
                                    {orderField}
                                </>
                            )}
                        </>
                    ) : null)}
            </>
        );
    };

    _renderClientSearchTable = () => {
        const {
            searchClientsResult: { searching: clientsSearching, clients },
            form,
        } = this.props;
        const formFieldsValues = form.getFieldsValue();
        const searchClientQuery = _.get(formFieldsValues, "searchClientQuery");

        return (
            <ClientsSearchTable
                clientsSearching={clientsSearching}
                setClientSelection={this._handleClientSelection}
                visible={searchClientQuery}
                clients={clients}
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

        const isActive =
            getFieldValue("counterpartyType") ===
            cashOrderCounterpartyTypes.CLIENT;

        return (
            <div className={Styles.client}>
                <DecoratedInput
                    field="searchClientQuery"
                    errors={errors}
                    defaultGetValueProps
                    fieldValue={_.get(fields, "searchClientQuery")}
                    formItem
                    label={formatMessage({
                        id: "cash-order-form.search",
                    })}
                    formItemLayout={formItemLayout}
                    getFieldDecorator={getFieldDecorator}
                    placeholder={formatMessage({
                        id: "add_order_form.search_client.placeholder",
                    })}
                    className={this._hiddenFormItemStyles(isActive)}
                    rules={[
                        {
                            required: isActive,
                            message: formatMessage({
                                id: "required_field",
                            }),
                        },
                    ]}
                />
            </div>
        );
    };

    _renderClientField = () => {
        const {
            printMode,
            editMode,
            client,
            activeCashOrder,
            form: { getFieldDecorator, getFieldValue },
            intl: { formatMessage },
        } = this.props;

        const isActive =
            getFieldValue("counterpartyType") ===
            cashOrderCounterpartyTypes.CLIENT;
        const clientId = this._getClientId();
        const name =
            _.get(client, "name") || _.get(activeCashOrder, "clientName");
        const surname =
            _.get(client, "surname") || _.get(activeCashOrder, "clientSurname");

        return (
            <div className={Styles.clientField}>
                <DecoratedInput
                    field="clientId"
                    // initialValue={editMode ? clientId : void 0}
                    getFieldDecorator={getFieldDecorator}
                    cnStyles={Styles.hiddenField}
                    disabled
                    rules={[
                        {
                            required: isActive,
                            message: formatMessage({
                                id: "required_field",
                            }),
                        },
                    ]}
                />
                {isActive && (
                    <div className={this._hiddenResetStyles(clientId)}>
                        <span>{`${name ? name : ""} ${
                            surname ? surname : ""
                        }`}</span>
                        {!printMode && (
                            <Icon
                                type="close"
                                onClick={() => this._resetClient(editMode)}
                                className={Styles.resetIcon}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    };

    _renderOrderSearch = () => {
        const {
            fields,
            errors,
            form: { getFieldDecorator, getFieldValue },
            intl: { formatMessage },
        } = this.props;

        const isActive =
            getFieldValue("counterpartyType") ===
                cashOrderCounterpartyTypes.CLIENT &&
            this.state.clientSearchType === "order";

        return (
            <DecoratedInput
                field="searchOrderQuery"
                errors={errors}
                defaultGetValueProps
                fieldValue={_.get(fields, "searchOrderQuery")}
                formItem
                label={formatMessage({
                    id: "cash-order-form.search",
                })}
                formItemLayout={formItemLayout}
                getFieldDecorator={getFieldDecorator}
                placeholder={formatMessage({
                    id: "cash-order-form.search_by_order",
                })}
                className={this._hiddenFormItemStyles(isActive)}
                rules={[
                    {
                        required: isActive,
                        message: formatMessage({
                            id: "required_field",
                        }),
                    },
                ]}
            />
        );
    };

    _renderOrderField = () => {
        const {
            printMode,
            editMode,
            order,
            activeCashOrder,
            form: { getFieldDecorator, getFieldValue },
            intl: { formatMessage },
        } = this.props;

        const orderId =
            _.get(order, "id") || this.state.editing
                ? _.get(order, "id") || getFieldValue("orderId")
                : _.get(activeCashOrder, "orderId");
        const clientId = this._getClientId();

        const num = _.get(order, "num") || _.get(activeCashOrder, "orderNum");
        const clientName =
            _.get(order, "clientName") || _.get(activeCashOrder, "clientName");
        const clientSurname =
            _.get(order, "clientSurname") ||
            _.get(activeCashOrder, "clientSurname");

        const isActive =
            getFieldValue("counterpartyType") ===
            cashOrderCounterpartyTypes.CLIENT;

        return (
            <>
                <div className={Styles.clientField}>
                    <DecoratedInput
                        field="orderId"
                        // initialValue={editMode ? orderId : void 0}
                        getFieldDecorator={getFieldDecorator}
                        cnStyles={Styles.hiddenField}
                        disabled
                        rules={[
                            {
                                required: isActive,
                                message: formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                    />
                    {isActive && (
                        <div className={this._hiddenResetStyles(orderId)}>
                            <span>{num}</span>
                            {!printMode && (
                                <Icon
                                    type="close"
                                    onClick={() => this._resetOrder(editMode)}
                                    className={Styles.resetIcon}
                                />
                            )}
                        </div>
                    )}
                </div>

                <DecoratedInput
                    field="clientId"
                    // initialValue={editMode ? clientId : void 0}
                    getFieldDecorator={getFieldDecorator}
                    cnStyles={Styles.hiddenField}
                    disabled
                    rules={[
                        {
                            required: isActive,
                            message: formatMessage({
                                id: "required_field",
                            }),
                        },
                    ]}
                />
                {this.state.clientSearchType !== "client" && (
                    <div className={this._hiddenResetStyles(clientId)}>
                        <span>
                            {clientName}
                            {clientSurname}
                        </span>
                    </div>
                )}
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

        const isActive =
            getFieldValue("counterpartyType") ===
            cashOrderCounterpartyTypes.EMPLOYEE;

        return (
            <DecoratedSelect
                field="employeeId"
                formItem
                placeholder={formatMessage({
                    id: "cash-order-form.select_employee",
                })}
                label={formatMessage({
                    id: "cash-order-form.counterparty.EMPLOYEE",
                })}
                formItemLayout={formItemLayout}
                getFieldDecorator={getFieldDecorator}
                getPopupContainer={trigger => trigger.parentNode}
                rules={[
                    {
                        required: isActive,
                        message: formatMessage({
                            id: "required_field",
                        }),
                    },
                ]}
                disabled={printMode}
                className={this._hiddenFormItemStyles(isActive)}
            >
                {!_.isEmpty(counterpartyList)
                    ? counterpartyList.map(({ id, name, surname, disabled }) => {
                        if(!disabled)
                            return (
                              <Option value={id} key={id} disabled={disabled}>
                                  {name} {surname}
                              </Option>
                            )
                    })
                    : []}
            </DecoratedSelect>
        );
    };

    _renderSupplierBlock = () => {
        const {
            printMode,
            counterpartyList,
            form: { getFieldDecorator, getFieldValue },
            intl: { formatMessage },
        } = this.props;

        const isActive =
            getFieldValue("counterpartyType") ===
            cashOrderCounterpartyTypes.BUSINESS_SUPPLIER;

        return (
            <DecoratedSelect
                field="businessSupplierId"
                formItem
                placeholder={formatMessage({
                    id: "cash-order-form.select_supplier",
                })}
                label={formatMessage({
                    id: "cash-order-form.counterparty.BUSINESS_SUPPLIER",
                })}
                formItemLayout={formItemLayout}
                getFieldDecorator={getFieldDecorator}
                getPopupContainer={trigger => trigger.parentNode}
                rules={[
                    {
                        required: isActive,
                        message: formatMessage({
                            id: "required_field",
                        }),
                    },
                ]}
                disabled={printMode}
                className={this._hiddenFormItemStyles(isActive)}
            >
                {!_.isEmpty(counterpartyList)
                    ? counterpartyList.map(({ id, name }) => (
                          <Option value={id} key={id}>
                              {name}
                          </Option>
                      ))
                    : []}
            </DecoratedSelect>
        );
    };

    _renderOtherBlock = () => {
        const {
            printMode,
            form: { getFieldDecorator, getFieldValue },
            intl: { formatMessage },
        } = this.props;

        const isActive =
            getFieldValue("counterpartyType") ===
            cashOrderCounterpartyTypes.OTHER;

        return (
            <DecoratedInput
                field="otherCounterparty"
                formItem
                label={formatMessage({
                    id: "cash-order-form.counterparty.OTHER",
                })}
                formItemLayout={formItemLayout}
                getFieldDecorator={getFieldDecorator}
                rules={[
                    {
                        required: isActive,
                        message: formatMessage({
                            id: "required_field",
                        }),
                    },
                ]}
                disabled={printMode}
                placeholder={formatMessage({
                    id: "cash-order-form.other_counterparty.placeholder",
                })}
                className={this._hiddenFormItemStyles(isActive)}
            />
        );
    };
}
