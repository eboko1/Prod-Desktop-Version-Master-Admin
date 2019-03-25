//vendor
import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Form, Button, Slider, Tooltip, Icon } from "antd";
import _ from "lodash";
import moment from "moment";

// proj
import { onChangeToSuccessForm } from "core/forms/toSuccessForm/duck";
import {
    createCashOrder,
    fetchCashOrderNextId,
    selectCashOrderNextId,
} from "core/forms/cashOrderForm/duck";
import { fetchCashboxes } from "core/cash/duck";

import { Numeral } from "commons";
import {
    DecoratedCheckbox,
    DecoratedRadio,
    DecoratedInputNumber,
    DecoratedSelect,
    DecoratedInput,
    DecoratedDatePicker,
    DecoratedSlider,
} from "forms/DecoratedFields";
import { cashOrderTypes } from "forms/CashOrderForm/config";
import { permissions, isForbidden, withReduxForm2 } from "utils";

// own
import Styles from "./styles.m.css";

const marks = {
    3: {
        style: {
            color: "rgb(255, 126, 126)",
        },
        label: <strong>3</strong>,
    },
    6: {
        style: {
            color: "rgb(251, 158, 62)",
        },
        label: 6,
    },
    9: {
        style: {
            color: "rgb(251, 158, 62)",
        },
        label: 9,
    },
    12: {
        style: {
            color: "rgb(76, 201, 105)",
        },
        label: <strong>12</strong>,
    },
};

@injectIntl
// @withReduxForm2({
//     name: "subscribeForm",
//     actions: {
//         change: onChangeToSuccessForm,
//         createCashOrder,
//         fetchCashboxes,
//         fetchCashOrderNextId,
//     },
//     mapStateToProps: state => ({
//         businessName: state.auth.businessName,
//         user: state.auth,
//         cashboxes: state.cash.cashboxes,
//         cashOrderNextId: selectCashOrderNextId(state),
//     }),
// })
@Form.create()
export class SubscribeForm extends Component {
    componentWillUnmount() {
        this.props.form.resetFields();
    }

    _submit = () => {
        const { form, subscribe, resetModal } = this.props;

        form.validateFields((err, values) => {
            console.log("→ _submit values", values);
            if (!err) {
                //subscribe();
                resetModal();
                form.resetFields();
            }
        });
    };

    _handleSubscriptionStartDate = startDate => {
        const period = this.props.form.getFieldValue("period");
        this.props.form.setFieldsValue({
            endDate: startDate.add(period, "month"),
        });
    };

    _handleSubscriptionPeriod = period => {
        const startDate = this.props.form.getFieldValue("startDate");
        this.props.form.setFieldsValue({
            endDate: startDate.add(period, "month"),
        });
    };

    render() {
        const {
            handleToSuccessModalSubmit,
            resetModal,
            businessName,
            remainPrice,
            cashboxes,
            modalProps,
        } = this.props;

        const {
            getFieldDecorator,
            getFieldValue,
            resetFields,
        } = this.props.form;

        const { formatMessage } = this.props.intl;

        return (
            <Form className={Styles.form} layout="vertical">
                <div className={Styles.price}>
                    {formatMessage({ id: "subscription.from" })} &nbsp;
                    <Numeral currency={"грн."}>{modalProps.price}</Numeral>{" "}
                    &nbsp;/&nbsp;
                    {formatMessage({ id: "subscription.monthly" })} &nbsp;
                    <Tooltip
                        // placement="topLeft"
                        title={formatMessage({ id: "subscription.tooltip" })}
                        getPopupContainer={trigger => trigger.parentNode}
                    >
                        <Icon type="question-circle-o" />
                    </Tooltip>
                </div>
                <div className={Styles.fieldsBlock}>
                    <DecoratedDatePicker
                        fields={{}}
                        field="startDate"
                        getFieldDecorator={getFieldDecorator}
                        initialValue={moment()}
                        allowClear={false}
                        formatMessage={formatMessage}
                        getCalendarContainer={trigger => trigger.parentNode}
                        disabledDate={current =>
                            current && current <= moment().startOf("day")
                        }
                        onChange={startDate =>
                            this._handleSubscriptionStartDate(startDate)
                        }
                    />
                    <DecoratedSlider
                        fields={{}}
                        field="period"
                        getFieldDecorator={getFieldDecorator}
                        initialValue={modalProps.period || 3}
                        tooltipVisible
                        min={3}
                        max={12}
                        step={3}
                        onChange={period =>
                            this._handleSubscriptionPeriod(period)
                        }
                        cnStyles={Styles.slider}
                        marks={marks}
                    />
                    <DecoratedDatePicker
                        disabled
                        field="endDate"
                        getFieldDecorator={getFieldDecorator}
                        initialValue={moment().add(3, "month")}
                        allowClear={false}
                        formatMessage={formatMessage}
                        getCalendarContainer={trigger => trigger.parentNode}
                    />
                </div>
                <DecoratedInput
                    placeholder={formatMessage({
                        id: "subscription.promo_code",
                    })}
                    field="promo"
                    getFieldDecorator={getFieldDecorator}
                    className={Styles.promoCode}
                />
                <div className={Styles.price}>
                    {formatMessage({
                        id: "subscription.total_sum",
                    })}
                    : &nbsp;
                    <Numeral currency={"грн."} className={Styles.totalSum}>
                        {modalProps.price * (getFieldValue("period") || 3)}
                    </Numeral>
                </div>
                <Button
                    className={Styles.purchaseButton}
                    onClick={() => this._submit()}
                    type="primary"
                >
                    {formatMessage({
                        id: "subscription.proceed_with_the_payment",
                    })}
                </Button>
            </Form>
        );
    }
}
