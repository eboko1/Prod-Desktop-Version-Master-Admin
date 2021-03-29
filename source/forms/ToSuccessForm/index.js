//vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Button, Radio, Select } from "antd";
import classNames from "classnames/bind";
import _ from "lodash";
import moment from "moment";

// proj
import { onChangeToSuccessForm } from "core/forms/toSuccessForm/duck";
import {
    createCashOrder,
    fetchCashOrderNextId,
    selectCashOrderNextId,
    fetchAnalytics,
    selectAnalytics,
} from "core/forms/cashOrderForm/duck";
import { fetchCashboxes } from "core/cash/duck";

import {
    DecoratedCheckbox,
    DecoratedRadio,
    DecoratedInputNumber,
    DecoratedSelect,
} from "forms/DecoratedFields";
import { cashOrderTypes } from "forms/CashOrderForm/config";
import { permissions, isForbidden, withReduxForm2 } from "utils";

// own
import Styles from "./styles.m.css";
const cx = classNames.bind(Styles);
const Option = Select.Option;

@injectIntl
@withReduxForm2({
    name: "toSuccessForm",
    actions: {
        change: onChangeToSuccessForm,
        createCashOrder,
        fetchCashboxes,
        fetchCashOrderNextId,
        fetchAnalytics,
    },
    mapStateToProps: state => ({
        businessName: state.auth.businessName,
        user: state.auth,
        cashboxes: state.cash.cashboxes,
        cashOrderNextId: selectCashOrderNextId(state),
        analytics: selectAnalytics(state),
    }),
})
export class ToSuccessForm extends Component {
    componentDidMount() {
        const { 
            fetchAnalytics
        } = this.props;

        fetchAnalytics();
    }

    componentDidUpdate(nextProps) {
        if (nextProps.fields.withPayment !== this.props.fields.withPayment) {
            if (_.isEmpty(this.props.cashboxes)) {
                this.props.fetchCashboxes();
            }
            const withPayment = this.props.form.getFieldValue("withPayment");
            if (this.props.form.getFieldValue("withPayment")) {
                this.props.fetchCashOrderNextId();
            }
        }
    }

    componentWillUnmount() {
        this.props.form.resetFields();
    }

    _submit = () => {
        const {
            form,
            onStatusChange,
            createCashOrder,
            resetModal,
            orderId,
            clientId,
            storeDocId,
            onSubmit,
            analytics,
        } = this.props;

        const smsMessage = form.getFieldValue("smsMessage");

        form.validateFields((err, values) => {
            if (!err) {
                if(onStatusChange) {
                    onStatusChange("success", void 0, {
                        smsMessage,
                    });
                }else if(onSubmit) {
                    onSubmit();
                }

                console.log(values)

                if (values.withPayment && Boolean(values.paymentSum)) {
                    createCashOrder({
                        cashBoxId: values.cashBoxId,
                        clientId: clientId,
                        datetime: moment(),
                        id: this.props.cashOrderNextId,
                        increase: values.paymentSum,
                        orderId: orderId,
                        type: cashOrderTypes.INCOME,
                        storeDocId: storeDocId,
                        analyticsUniqueId: analytics && analytics[0].analyticsUniqueId,
                    });
                }

                resetModal();
                form.resetFields();
            }
        });
    };

    _setPayment = event => {
        this.props.form.resetFields(["partialPayment"]);
        this.props.form.setFieldsValue({ paymentSum: this.props.remainPrice });
    };

    _setPartialPayment = event => {
        this.props.form.setFieldsValue({ paymentSum: this.props.remainPrice });
    };

    _hiddenFormItemStyles = type =>
        cx({
            hiddenFormItem: !type,
            styledFormItem: true,
        });

    render() {
        const {
            handleToSuccessModalSubmit,
            resetModal,
            businessName,
            remainPrice,
            cashboxes,
            storeDocId,
        } = this.props;

        const {
            getFieldDecorator,
            getFieldValue,
            resetFields,
        } = this.props.form;

        const { formatMessage } = this.props.intl;


        return (
            <Form layout="vertical">
                <div className={Styles.title}>
                    {!Boolean(storeDocId) ?
                        <FormattedMessage id="to_success.title" /> :
                        <FormattedMessage id="to_success_store_doc.title" />
                    }
                    
                </div>
                <div className={Styles.submit}>
                    <Button
                        onClick={() => this._submit()}
                        className={Styles.submitButton}
                        type="primary"
                    >
                        <FormattedMessage id="yes" />
                    </Button>
                    <Button
                        onClick={() => resetModal()}
                        className={Styles.submitButton}
                    >
                        <FormattedMessage id="no" />
                    </Button>
                </div>
                {!isForbidden(
                    this.props.user,
                    permissions.ACCESS_ACCOUNTING,
                ) && (
                    <div>
                        <DecoratedRadio
                            field="withPayment"
                            formItem
                            label={formatMessage({
                                id: "to_success.pay",
                            })}
                            getFieldDecorator={getFieldDecorator}
                            initialValue={false}
                            onChange={event => this._setPayment(event)}
                        >
                            <Radio value={true}>
                                {formatMessage({
                                    id: "yes",
                                })}
                            </Radio>
                            <Radio value={false}>
                                {formatMessage({
                                    id: "no",
                                })}
                            </Radio>
                        </DecoratedRadio>
                        <DecoratedSelect
                            field="cashBoxId"
                            getFieldDecorator={getFieldDecorator}
                            formItem
                            initialValue={_.get(cashboxes, "[0].id")}
                            label={formatMessage({
                                id: "cash-order-form.cashbox",
                            })}
                            placeholder={formatMessage({
                                id: "cash-order-form.cashbox.placeholder",
                            })}
                            rules={[
                                {
                                    required: Boolean(
                                        getFieldValue("withPayment"),
                                    ),
                                    message: formatMessage({
                                        id: "required_field",
                                    }),
                                },
                            ]}
                            getPopupContainer={trigger => trigger.parentNode}
                            className={this._hiddenFormItemStyles(
                                getFieldValue("withPayment"),
                            )}
                        >
                            {cashboxes.map(({ id, name }) => (
                                <Option value={id} key={id}>
                                    {name}
                                </Option>
                            ))}
                        </DecoratedSelect>
                        <DecoratedCheckbox
                            field="partialPayment"
                            formItem
                            getFieldDecorator={getFieldDecorator}
                            className={this._hiddenFormItemStyles(
                                getFieldValue("withPayment"),
                            )}
                            initialValue={false}
                            onChange={this._setPartialPayment}
                        >
                            <FormattedMessage id="to_success.partial_payment" />
                        </DecoratedCheckbox>
                        <DecoratedInputNumber
                            defaultGetValueProps
                            field="paymentSum"
                            formItem
                            colon={false}
                            label={formatMessage({ id: "sum" })}
                            getFieldDecorator={getFieldDecorator}
                            className={this._hiddenFormItemStyles(
                                getFieldValue("partialPayment"),
                            )}
                            initialValue={
                                getFieldValue("withPayment")
                                    ? void 0
                                    : Math.round(remainPrice*100)/100
                            }
                            rules={[
                                {
                                    required: Boolean(
                                        getFieldValue("withPayment"),
                                    ),
                                    type: "number",
                                    message: formatMessage({
                                        id: "required_field",
                                    }),
                                },
                            ]}
                            min={0}
                        />
                    </div>
                )}
                {!Boolean(storeDocId) &&
                    <div>
                        <div className={Styles.checkbox}>
                            <DecoratedCheckbox
                                field="smsMessage"
                                getFieldDecorator={getFieldDecorator}
                            >
                                <FormattedMessage id="to_success.send_message" />
                                {businessName && (
                                    <p className={Styles.text}>
                                        <FormattedMessage id="to_success.sms1" />
                                        {businessName}
                                        <FormattedMessage id="to_success.sms2" />
                                    </p>
                                )}
                            </DecoratedCheckbox>
                        </div>
                    </div>
                }
            </Form>
        );
    }
}
