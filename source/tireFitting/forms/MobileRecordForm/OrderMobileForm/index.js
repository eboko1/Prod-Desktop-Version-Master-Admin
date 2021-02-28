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
// import { onChangeMobileRecordForm } from 'core/forms/mobileRecordForm/duck';
import book from "routes/book";
import { onChangeOrderForm } from "core/forms/orderForm/duck";

import {
    DecoratedInput,
    DecoratedSelect,
    DecoratedTextArea,
    DecoratedDatePicker,
    DecoratedTimePicker,
    DecoratedSlider,
} from "forms/DecoratedFields";

import { withReduxForm } from "utils";
import { permissions, isForbidden } from "utils";

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
@withReduxForm({
    name: "orderForm",
    debouncedFields: [
        "comment",
        "recommendation",
        "vehicleCondition",
        "businessComment",
    ],
    actions: {
        change: onChangeOrderForm,
    },
})
export class OrderMobileForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workshopModalVisible: false,
            stockModalVisible: false,
        };
    }

    showStockModal() {
        this.setState({
            stockModalVisible: true,
        })
    }

    hideStockModal() {
        this.setState({
            stockModalVisible: false,
        })
    }

    showWorkshopModal() {
        this.setState({
            workshopModalVisible: true,
        })
    }

    hideWorkshopModal() {
        this.setState({
            workshopModalVisible: false,
        })
    }

    render() {
        const {
            selectedClient,
            stations,
            onStatusChange,
            orderDiagnostic,
            order: { status },
            onClose,
        } = this.props;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { formatMessage } = this.props.intl;

        const vehicle = selectedClient.vehicles.find((vehicle)=>vehicle.id == this.props.order.clientVehicleId) || undefined;

        const disabledHours = getDisabledHours( 8, 20)

        const isDurationDisabled = _.every(
            getFieldsValue([
                "stationLoads[0].beginDate",
                "stationLoads[0].beginTime",
                "stationLoads[0].station",
            ]),
        );
        return (
            <Form layout="horizontal">
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
                    label={<FormattedMessage id="add_order_form.name" />}
                    {...formItemLayout}
                >
                    <Input
                        placeholder={formatMessage({
                            id: "add_order_form.select_name",
                            defaultMessage: "Select client",
                        })}
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
                    initialValue={this.props.order.clientPhone}
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
                    {selectedClient.phones.filter(Boolean).map(phone => (
                        <Option value={phone} key={v4()}>
                            {phone}
                        </Option>
                    ))}
                </DecoratedSelect>
                <DecoratedSelect
                    field="clientVehicle"
                    initialValue={this.props.order.clientVehicleId}
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
                    {selectedClient.vehicles.map(vehicle => (
                        <Option value={vehicle.id} key={v4()}>
                            {`${vehicle.make} ${
                                vehicle.model
                            } ${vehicle.number || vehicle.vin || ""}`}
                        </Option>
                    ))}
                </DecoratedSelect>
                <hr />
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
            </Form>
        );
    }
}