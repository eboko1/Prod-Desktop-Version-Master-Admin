// vendor
import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import {
    Form,
    Button,
    Input,
    Select,
    Modal,
    Icon,
    Upload,
    notification,
    InputNumber,
} from "antd";
import { v4 } from "uuid";
import _ from "lodash";
import moment from "moment";

// proj
import { AddClientModal, ToSuccessModal } from "modals";
import book from "routes/book";
import { Numeral } from "commons";
import {
    DecoratedInput,
    DecoratedSelect,
    DecoratedTextArea,
    DecoratedDatePicker,
    DecoratedTimePicker,
    DecoratedSlider,
} from "forms/DecoratedFields";
import { permissions, isForbidden } from "utils";
import { ClientsSearchTable } from "../../OrderForm/OrderFormTables";

// own
import Styles from "./styles.m.css";

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xl: { span: 24 },
        xxl: { span: 4 },
    },
    wrapperCol: {
        xl: { span: 24 },
        xxl: { span: 20 },
    },
    colon: false,
};

const getDisabledHours = (startTime = 0, endTime = 23) => {
    const availableHours = [];
    for(let i = Number(startTime); i <= Number(endTime); i++) {
        availableHours.push(i);
    }
    return _.difference(
        Array(24).fill(1).map((value, index) => index),
        availableHours
    );
};

@injectIntl
export class OrderMobileFormFields extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workshopModalVisible: false,
            stockModalVisible: false,
        };
    }

    bodyUpdateIsForbidden() {
        return isForbidden(this.props.user, permissions.ACCESS_ORDER_BODY);
    }

    _renderClientSearch = () => {
        const { getFieldDecorator } = this.props.form;
        const { user, fields, errors } = this.props;
        const { CREATE_EDIT_DELETE_CLIENTS } = permissions;

        const disabledClientSearch =
            (!_.get(this.props, "order.status") ||
                _.get(this.props, "order.status") !== "reserve") &&
            _.get(this.props, "order.clientId");

        return !disabledClientSearch ? (
            <div className={Styles.client}>
                <DecoratedInput
                    errors={errors}
                    defaultGetValueProps
                    fieldValue={_.get(fields, "searchClientQuery")}
                    className={Styles.clientSearchField}
                    field="searchClientQuery"
                    formItem
                    colon={false}
                    label={this.props.intl.formatMessage({
                        id: "add_order_form.search_client",
                    })}
                    getFieldDecorator={getFieldDecorator}
                    disabled={
                        Boolean(disabledClientSearch)
                    }
                    placeholder={this.props.intl.formatMessage({
                        id: "add_order_form.search_client.placeholder",
                    })}
                />
                {!isForbidden(user, CREATE_EDIT_DELETE_CLIENTS) ? (
                    <Icon
                        type="plus"
                        className={Styles.addClientIcon}
                        onClick={() => this.props.setAddClientModal()}
                    />
                ) : null}
            </div>
        ) : null;
    };

    _renderClientSearchTable = () => {
        const {
            searchClientsResult: { searching: clientsSearching, clients },
            setClientSelection,
            form,
        } = this.props;

        const formFieldsValues = form.getFieldsValue();
        const searchClientQuery = _.get(formFieldsValues, "searchClientQuery");

        return (
            <ClientsSearchTable
                clientsSearching={clientsSearching}
                setClientSelection={setClientSelection}
                visible={searchClientQuery}
                clients={clients}
            />
        );
    };

    _renderTotalBlock = () => {
        const { totalSum, totalSumWithTax, isTaxPayer, cashSum } = this.props;

        const remainPrice = isTaxPayer ? 
            Math.round((totalSumWithTax - cashSum)*100)/100 : 
            Math.round((totalSum - cashSum)*100)/100;

        const mask = "0,0.00";

        return (
            <div className={Styles.totalBlock}>
                <div className={Styles.sum}>
                    <span className={Styles.sumWrapper}>
                        <FormattedMessage id="sum" />
                        <Numeral
                            mask={mask}
                            className={Styles.sumNumeral}
                            nullText="0"
                            currency={this.props.intl.formatMessage({
                                id: "currency",
                            })}
                        >
                            {totalSum}
                        </Numeral>
                    </span>
                    {isTaxPayer &&
                        <span className={Styles.sumWrapper}>
                            <FormattedMessage id="with" /> <FormattedMessage id="VAT" />
                            <Numeral
                                mask={mask}
                                className={Styles.sumNumeral}
                                nullText="0"
                                currency={this.props.intl.formatMessage({
                                    id: "currency",
                                })}
                            >
                                {totalSumWithTax}
                            </Numeral>
                        </span>
                    }
                    <span className={Styles.sumWrapper}>
                        <FormattedMessage id="paid" />
                        <Numeral
                            mask={mask}
                            className={Styles.sumNumeral}
                            nullText="0"
                            currency={this.props.intl.formatMessage({
                                id: "currency",
                            })}
                        >
                            {cashSum}
                        </Numeral>
                    </span>
                </div>
                <div className={Styles.totalSumWrap}>
                    <FormattedMessage id="remain" />
                    <Numeral
                        mask={mask}
                        className={Styles.totalSum}
                        currency={this.props.intl.formatMessage({
                            id: "currency",
                        })}
                        nullText="0"
                    >
                        {remainPrice || 0}
                    </Numeral>
                </div>
            </div>
        );
    }

    _saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        const {
            selectedClient,
            stations,
            onStatusChange,
            order: { status },
            schedule,
            fetchedOrder,
            form,
            modal,
            resetModal,
            addClientFormData
        } = this.props;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { formatMessage } = this.props.intl;


        const formFieldsValues = form.getFieldsValue();
        const searchClientQuery = _.get(formFieldsValues, "searchClientQuery");

        const vehicle = selectedClient.vehicles.find((vehicle)=>vehicle.id == this.props.order.clientVehicleId) || undefined;

        const dayNumber = moment(_.get(this.props, "stationLoads[0].beginDate")).day();
        let disabledHours = undefined;
        if(schedule && dayNumber) {
            let index;
            switch (dayNumber) {
                case 6:
                    index = 1;
                    break;
                case 7:
                    index = 2;
                    break;
                default:
                    index = 0;
            }

            disabledHours = getDisabledHours(
                schedule[index] && schedule[index].beginTime ? schedule[index].beginTime.split(/[.:]/)[0] : 9,
                schedule[index] && schedule[index].endTime ? schedule[index].endTime.split(/[.:]/)[0] : 20
            )
        }

        const isDurationDisabled = _.every(
            getFieldsValue([
                "stationLoads[0].beginDate",
                "stationLoads[0].beginTime",
                "stationLoads[0].station",
            ]),
        );

        const totalBlock = this._renderTotalBlock();
        const clientSearch = this._renderClientSearch();
        const clientsSearchTable = this._renderClientSearchTable();

        return (
            <div>
                {clientSearch}
                {clientsSearchTable}
                <div style={{ display: "none" }}>
                    <DecoratedInput
                        field="stationLoads[0].status"
                        hiddeninput="hiddeninput"
                        formItem
                        initialValue={"TO_DO"}
                        getFieldDecorator={getFieldDecorator}
                    />
                </div>
                <div className={Styles.mobileRecordFormFooter} style={{display: 'none'}}>
                    {status !== "cancel" && status !== "approve" && (
                        <Button
                            className={Styles.mobileRecordSubmitBtn}
                            type="primary"
                            onClick={() => onStatusChange("approve")}
                        >
                            <FormattedMessage id="add_order_form.save_appointment" />
                        </Button>
                    )}
                    {status !== "cancel" && (
                        <Button
                            className={Styles.mobileRecordSubmitBtn}
                            onClick={() =>
                                onStatusChange(
                                    status,
                                    undefined,
                                    undefined,
                                    `${book.dashboard}`,
                                )
                            }
                        >
                            <FormattedMessage id="close" />
                        </Button>
                    )}
                </div>
                <FormItem
                    label={<FormattedMessage id="add_order_form.client" />}
                    {...formItemLayout}
                >
                    <Input
                        placeholder={formatMessage({
                            id: "add_order_form.select_name",
                            defaultMessage: "Select client",
                        })}
                        style={{color: "var(--text)"}}
                        disabled
                        value={
                            selectedClient.name || selectedClient.surname
                                ? (selectedClient.surname
                                      ? selectedClient.surname + " "
                                      : "") + `${selectedClient.name}`
                                : void 0
                        }
                    />
                </FormItem>
                <DecoratedSelect
                    label={<FormattedMessage id="add_order_form.phone" />}
                    field="clientPhone"
                    initialValue={
                        _.get(fetchedOrder, "order.clientPhone") ||
                        (this.bodyUpdateIsForbidden()
                            ? void 0
                            : _.get(selectedClient, "phones[0]"))
                    }
                    formItem
                    formItemLayout={formItemLayout}
                    hasFeedback
                    className={Styles.clientCol}
                    colon={false}
                    rules={[
                        {
                            required: true,
                            message: formatMessage({
                                id: "required_field",
                            }),
                        },
                    ]}
                    getFieldDecorator={getFieldDecorator}
                    placeholder={formatMessage({
                        id: "add_order_form.select_client_phone",
                    })}
                >
                    {_.get(selectedClient, "phones", []).filter(Boolean).map(phone => (
                        <Option value={phone} key={v4()}>
                            {phone}
                        </Option>
                    ))}
                </DecoratedSelect>
                <DecoratedSelect
                    field="clientVehicle"
                    initialValue={
                        _.get(fetchedOrder, "order.clientVehicleId") ||
                        (this.bodyUpdateIsForbidden()
                            ? void 0
                            : _.get(selectedClient, "vehicles[0].id"))
                    }
                    formItem
                    hasFeedback
                    label={<FormattedMessage id="add_order_form.car" />}
                    formItemLayout={formItemLayout}
                    colon={false}
                    className={Styles.clientCol}
                    getFieldDecorator={getFieldDecorator}
                    rules={[
                        {
                            required: true,
                            message: formatMessage({
                                id: "required_field",
                            }),
                        },
                    ]}
                    placeholder={formatMessage({
                        id: "add_order_form.select_client_vehicle",
                    })}
                    optionDisabled="enabled"
                >
                    {_.get(selectedClient, "vehicles", []).map(vehicle => (
                        <Option value={vehicle.id} key={v4()}>
                            {`${vehicle.make} ${
                                vehicle.model
                            } ${vehicle.number || vehicle.vin || ""}`}
                        </Option>
                    ))}
                </DecoratedSelect>
                <hr />
                {totalBlock}
                <hr />
                <div style={{ fontSize: "18px", marginBottom: "10px" }}>
                    <FormattedMessage id="add_order_form.appointment_details" />
                </div>
                <DecoratedSelect
                    field="stationLoads[0].station"
                    initialValue={this.props.order.stationNum}
                    rules={[
                        {
                            required: true,
                            message: formatMessage({
                                id: "required_field",
                            }),
                        },
                    ]}
                    formItem
                    label={<FormattedMessage id="add_order_form.station" />}
                    colon={false}
                    hasFeedback
                    className={Styles.datePanelItem}
                    getFieldDecorator={getFieldDecorator}
                    placeholder={
                        <FormattedMessage id="add_order_form.select_station" />
                    }
                    options={stations}
                    optionValue="num"
                    optionLabel="name"
                />
                <DecoratedDatePicker
                    formItem
                    initialValue={moment(
                        this.props.order.beginDatetime,
                    ).toISOString()}
                    field="stationLoads[0].beginDate"
                    hasFeedback
                    label={<FormattedMessage id="date" />}
                    className={Styles.datePanelItem}
                    getFieldDecorator={getFieldDecorator}
                    formatMessage={formatMessage}
                    allowClear={false}
                    {...formItemLayout}
                    rules={[
                        {
                            required: true,
                            message: formatMessage({
                                id: "required_field",
                            }),
                        },
                    ]}
                />
                <DecoratedTimePicker
                    field="stationLoads[0].beginTime"
                    initialValue={moment(
                        this.props.order.beginDatetime,
                    ).toISOString()}
                    formItem
                    hasFeedback
                    inputReadOnly
                    allowClear={false}
                    disabledHours={()=>disabledHours}
                    label={<FormattedMessage id="time" />}
                    formatMessage={formatMessage}
                    className={Styles.datePanelItem}
                    getFieldDecorator={getFieldDecorator}
                    minuteStep={30}
                    hideDisabledOptions
                    rules={[
                        {
                            required: true,
                            message: formatMessage({
                                id: "required_field",
                            }),
                        },
                    ]}
                />
                <DecoratedSlider
                    formItem
                    label={<FormattedMessage id="add_order_form.duration" />}
                    field="stationLoads[0].duration"
                    initialValue={this.props.order.duration}
                    getFieldDecorator={getFieldDecorator}
                    disabled={!isDurationDisabled}
                    min={0}
                    step={0.5}
                    max={8}
                    {...formItemLayout}
                />
                <DecoratedSelect
                    field="manager"
                    initialValue={this.props.order.managerId}
                    formItem
                    getFieldDecorator={getFieldDecorator}
                    rules={[
                        {
                            required: true,
                            message: formatMessage({
                                id: "required_field",
                            }),
                        },
                    ]}
                    label={<FormattedMessage id="add_order_form.manager" />}
                    hasFeedback
                    colon={false}
                    className={Styles.datePanelItem}
                    placeholder={formatMessage({
                        id: "add_order_form.select_manager",
                    })}
                    {...formItemLayout}
                >
                    {this.props.managers.map(manager => (
                        <Option
                            disabled={manager.disabled}
                            value={manager.id}
                            key={v4()}
                        >
                            {`${manager.managerName} ${manager.managerSurname}`}
                        </Option>
                    ))}
                </DecoratedSelect>
                <DecoratedSelect
                    formItem
                    hasFeedback
                    defaultGetValueProps
                    field="employee"
                    label={<FormattedMessage id="order_form_table.master" />}
                    className={Styles.datePanelItem}
                    getFieldDecorator={getFieldDecorator}
                    initialValue={
                        _.get(fetchedOrder, "order.employeeId") ||
                        (location.state ? location.state.employeeId : undefined)
                    }
                    placeholder={formatMessage({
                        id: "order_form_table.select_master",
                    })}
                    {...formItemLayout}
                >
                    {_.get(this.props, "employees", []).map(employee => {
                        if (!employee.disabled) {
                            return (
                                <Option
                                    value={employee.id}
                                    key={`employee-${employee.id}`}
                                    disabled={employee.disabled}
                                >
                                    {`${employee.name} ${employee.surname}`}
                                </Option>
                            );
                        }
                    })}
                </DecoratedSelect>
                <DecoratedTextArea
                    formItem
                    initialValue={this.props.order.comment}
                    label={
                        <FormattedMessage id="add_order_form.client_comments" />
                    }
                    getFieldDecorator={getFieldDecorator}
                    field="comment"
                    rules={[
                        {
                            max: 2000,
                            message: formatMessage({
                                id: "field_should_be_below_2000_chars",
                            }),
                        },
                    ]}
                    placeholder={formatMessage({
                        id: "add_order_form.client_comments",
                        defaultMessage: "Client_comments",
                    })}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                />
                <AddClientModal
                    searchQuery={searchClientQuery}
                    wrappedComponentRef={this._saveFormRef}
                    visible={modal}
                    resetModal={resetModal}
                    addClientFormData={addClientFormData}
                />
            </div>
        );
    }
}