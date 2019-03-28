//vendor
import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Form, Button, Slider, Tooltip, Icon, Radio, Tabs } from "antd";
import _ from "lodash";
import moment from "moment";

// proj
import { Numeral } from "commons";
import {
    DecoratedCheckbox,
    DecoratedRadio,
    DecoratedInputNumber,
    DecoratedSelect,
    DecoratedSearch,
    DecoratedInput,
    DecoratedDatePicker,
    DecoratedSlider,
} from "forms/DecoratedFields";
import { permissions, isForbidden, goTo } from "utils";
import book from "routes/book";

// own
import { CashlessToast, PromoCodeToast } from "./NotificationToasts";
import { paymentTypes } from "./config";
import Styles from "./styles.m.css";

const TabPane = Tabs.TabPane;

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
@Form.create()
export class SubscribeForm extends Component {
    state = {
        paymentType: "CASHLESS",
        promoCodeDiscount: void 0,
        subscribeStatus: void 0,
    };

    static getDerivedStateFromProps(props, state) {
        console.log("→ getDerivedStateFromProps props", props);
        if (props.promoCode !== state.promoCodeDiscount) {
            props.form.setFieldsValue({ promoCodeDiscount: props.promoCode });
            return {
                promoCodeDiscount: props.promoCode,
            };
        }
        return null;
    }

    componentWillUnmount() {
        this.props.form.resetFields();
    }

    _submit = () => {
        const { form, subscribe, resetModal } = this.props;

        form.validateFields((err, values) => {
            console.log("→ _submit values", values);
            if (!err) {
                subscribe(_.omit(values, ["period", "promoCodeDiscount"]));
                form.resetFields();
                resetModal();
                goTo(book.subscriptionHistoryPage);
                // if (this.props.subscribed) {
                //     this.setState({ subscribeStatus: "success" });
                //     console.log("→ delayed111");
                //     _.delay(function() {
                //         console.log("→ delayed222");
                //         form.resetFields();
                //         resetModal();
                //         goTo(book.subscriptionHistoryPage);
                //     }, 2000);
                //     console.log("→ delayed333");
                // } else {
                //     this.setState({ subscribeStatus: "error" });
                // }
            }
        });
    };

    _handleSubscriptionStartDate = startDatetime => {
        const startDatetimeClone = startDatetime.clone();
        const period = this.props.form.getFieldValue("period");
        const endDatetime = startDatetimeClone.add(period, "month");

        this.props.form.setFieldsValue({
            startDatetime,
            endDatetime,
        });
    };

    _handleSubscriptionPeriod = period => {
        const startDatetimeClone = this.props.form
            .getFieldValue("startDatetime")
            .clone();

        this.props.form.setFieldsValue({
            endDatetime: startDatetimeClone.add(period, "month"),
        });
    };

    _setPaymentType = key => {
        this.props.form.setFieldsValue({
            paymentType: key,
        });
    };

    _verifyPromoCode = value => {
        // console.log("→ rule, value, callback", rule, value, callback);
        this.props.verifyPromoCode(value);
        // return this.props.promoCode;
        // this.props.form.validateFields(["promoCode"], { force: true });
        // this.setState({
        //     promoCode: this.props.promoCode
        // })
    };

    render() {
        const {
            handleToSuccessModalSubmit,
            resetModal,
            businessName,
            remainPrice,
            cashboxes,
            modalProps,
            user,
        } = this.props;

        const {
            getFieldDecorator,
            getFieldValue,
            resetFields,
        } = this.props.form;

        const { formatMessage } = this.props.intl;
        // console.log("→ this.props.form.fields", this.props.form);
        // console.log("→ this.props", this.props);
        const totalSum = modalProps.price * (getFieldValue("period") || 3);
        const promoCodeDiscount = getFieldValue("promoCodeDiscount");
        let totalSumWithDiscount = totalSum;
        if (promoCodeDiscount && promoCodeDiscount !== "error") {
            totalSumWithDiscount =
                totalSum - (totalSum / 100) * promoCodeDiscount;
        }
        console.log("→ totalSum", totalSum);
        console.log("→ promoCodeDiscount", promoCodeDiscount);
        console.log("→ totalSumWithDiscount", totalSumWithDiscount);

        return (
            <Form className={Styles.form} layout="vertical">
                {this.state.subscribeStatus === "success" && <div>AAAAA</div>}
                <div className={Styles.price}>
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
                    <DecoratedInput
                        field="productId"
                        initialValue={modalProps.id}
                        className={Styles.hiddenInput}
                        getFieldDecorator={getFieldDecorator}
                    />
                    <DecoratedDatePicker
                        fields={{}}
                        field="startDatetime"
                        getFieldDecorator={getFieldDecorator}
                        initialValue={moment()}
                        allowClear={false}
                        formatMessage={formatMessage}
                        getCalendarContainer={trigger => trigger.parentNode}
                        disabledDate={current =>
                            current && current <= moment().startOf("day")
                        }
                        onChange={startDatetime =>
                            this._handleSubscriptionStartDate(startDatetime)
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
                        field="endDatetime"
                        getFieldDecorator={getFieldDecorator}
                        initialValue={moment().add(3, "month")}
                        allowClear={false}
                        formatMessage={formatMessage}
                        getCalendarContainer={trigger => trigger.parentNode}
                    />
                </div>

                <Tabs
                    className={Styles.paymentType}
                    defaultActiveKey={paymentTypes.CASHLESS}
                    onChange={this._setPaymentType}
                >
                    <TabPane
                        tab={
                            <span>
                                <Icon type="credit-card" />
                                {formatMessage({
                                    id: "subscription.paymentTypes.PORTMONE",
                                })}
                            </span>
                        }
                        disabled
                        key={paymentTypes.PORTMONE}
                    >
                        <div className={Styles.tabContent}>Portmone</div>
                    </TabPane>
                    <TabPane
                        tab={formatMessage({
                            id: "subscription.paymentTypes.CASHLESS",
                        })}
                        key={paymentTypes.CASHLESS}
                    >
                        Оплатить Безналом
                    </TabPane>
                </Tabs>
                <DecoratedInput
                    field="paymentType"
                    initialValue={paymentTypes.CASHLESS}
                    className={Styles.hiddenInput}
                    getFieldDecorator={getFieldDecorator}
                />
                <DecoratedSearch
                    formItem
                    // validateStatus
                    fields={{}}
                    placeholder={formatMessage({
                        id: "subscription.promo_code",
                    })}
                    field="promoCode"
                    getFieldDecorator={getFieldDecorator}
                    className={Styles.promoCode}
                    enterButton={"Применить"}
                    // disabled={Boolean(getFieldValue("promoCode"))}
                    // onPressEnter={e => {
                    //     console.log("e", e);
                    //     this._verifyPromoCode();
                    // }}
                    // onPressEnter={e => console.log("e", e)}
                    onSearch={value => this._verifyPromoCode(value)}
                    // rules={[
                    //     {
                    //         required: this._verifyPromoCode,
                    //         message: "Промокод не очень",
                    //     },
                    // ]}
                />
                {this.state.promoCodeDiscount && (
                    <PromoCodeToast
                        promoCodeDiscount={this.props.form.getFieldValue(
                            "promoCodeDiscount",
                        )}
                    />
                )}
                <DecoratedInput
                    field="promoCodeDiscount"
                    initialValue={this.state.promoCodeDiscount}
                    className={Styles.hiddenInput}
                    getFieldDecorator={getFieldDecorator}
                />
                <div className={Styles.price}>
                    {formatMessage({
                        id: "subscription.total_sum",
                    })}
                    : &nbsp;
                    <Numeral currency={"грн."} className={Styles.totalSum}>
                        {totalSumWithDiscount}
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
