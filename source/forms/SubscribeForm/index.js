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
    DecoratedInput,
    DecoratedDatePicker,
    DecoratedSlider,
} from "forms/DecoratedFields";
import { permissions, isForbidden } from "utils";

// own
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
    state = {
        paymentType: "support",
    };

    componentWillUnmount() {
        this.props.form.resetFields();
    }

    _submit = () => {
        const { form, subscribe, resetModal } = this.props;

        form.validateFields((err, values) => {
            console.log("→ _submit values", values);
            if (!err) {
                subscribe(_.omit(values, ["period"]));
                resetModal();
                form.resetFields();
            }
        });
    };

    _handleSubscriptionStartDate = startDatetime => {
        const period = this.props.form.getFieldValue("period");
        this.props.form.setFieldsValue({
            endDatetime: startDatetime.add(period, "month"),
        });
    };

    _handleSubscriptionPeriod = period => {
        const startDatetime = this.props.form.getFieldValue("startDatetime");
        this.props.form.setFieldsValue({
            endDatetime: startDatetime.add(period, "month"),
        });
    };

    _setPaymentType = event => {
        const paymentType = event.target.value;
        this.setState(prevState => {
            this.props.form.setFieldsValue({
                paymentType,
                [prevState.paymentType]: null,
            });

            return { paymentType };
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
            user,
        } = this.props;

        const {
            getFieldDecorator,
            getFieldValue,
            resetFields,
        } = this.props.form;

        const { formatMessage } = this.props.intl;
        console.log("→ modalProps", modalProps);
        return (
            <Form className={Styles.form} layout="vertical">
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
                <Tabs className={Styles.paymentType} defaultActiveKey="2">
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
                        key="1"
                    >
                        <div className={Styles.tabContent}>Portmone</div>
                    </TabPane>
                    <TabPane
                        tab={formatMessage({
                            id: "subscription.paymentTypes.TERMINAL",
                        })}
                        key="2"
                    >
                        <div className={Styles.tabContent}>
                            <p>
                                № Карти ПриватБанка: 5169 3305 1764 9940
                                <br />
                                <br />
                                Ніколенко Наталія Григорівна
                                <br />
                                № Рахунку: 26002056120889
                                <br />
                                В призначенні платежу вкажіть, будь ласка:
                                <br />«{user.businessId} {user.businessName}»
                            </p>
                        </div>
                    </TabPane>
                    <TabPane
                        tab={formatMessage({
                            id: "subscription.paymentTypes.LTD_WITHOUT_VAT",
                        })}
                        disabled
                        key="3"
                    >
                        <div className={Styles.tabContent}>
                            <p>
                                ТОВ «КАРБУК» 02002,
                                <br />
                                Україна, м. Київ, вул. Є.Сверстюка 11А, оф.608
                                <br />
                                р/р 26004513922 в АТ «Райффайзен Банк Аваль»
                                <br />
                                МФО 380805 Код ЄДРПОУ 40336808
                                <br />
                                ІПН 10000000579859
                                <br />
                                Директор Ніколенко О.В.
                            </p>
                        </div>
                    </TabPane>
                    <TabPane
                        tab={formatMessage({
                            id: "subscription.paymentTypes.LTD_WITH_VAT",
                        })}
                        disabled
                        key="4"
                    >
                        <div className={Styles.tabContent}>
                            <p>
                                ТОВ «КАРБУК Україна»
                                <br />
                                Коміссіонер ЄДРПОУ 42408931
                                <br />
                                Р/р 26006612348 в АТ «Райффайзен Банк Аваль»
                                <br />
                                МФО 380805 тел. "02002,
                                <br />
                                м. Київ вул. Є.Сверстюка, 11А, офіс № 608
                                <br />
                                Директор Ніколенко О.В.
                            </p>
                        </div>
                    </TabPane>
                    <TabPane
                        tab={formatMessage({
                            id:
                                "subscription.paymentTypes.INDIVIDUAL_ENTREPRENEUR",
                        })}
                        key="5"
                    >
                        <div className={Styles.tabContent}>
                            <p>
                                ФОП Ніколенко Наталя Григорівна
                                <br />
                                тел. 0679836991
                                <br />
                                Р/Р 26002056120889 в Фiлiя "КИЇВСIТI" АТ КБ
                                "ПРИВАТБАНК"
                                <br />
                                ЄДРПОУ 2852101228, МФО 380775
                                <br />
                                тел. "Адреса: 07364, Київська обл.,
                                Вишгородський р-н,
                                <br />
                                с. Новосілки, урочище "Участок", вул. Райдужна,
                                буд. 20
                            </p>
                        </div>
                    </TabPane>
                </Tabs>
                <DecoratedInput
                    fields={{}}
                    placeholder={formatMessage({
                        id: "subscription.promo_code",
                    })}
                    field="promoCode"
                    getFieldDecorator={getFieldDecorator}
                    className={Styles.promoCode}
                />
                {/* <DecoratedRadio
                    field="paymentType"
                    formItem
                    getFieldDecorator={getFieldDecorator}
                    onChange={event => this._setPaymentType(event)}
                    initialValue={this.state.paymentType}
                >
                    <Radio value="card">
                        {formatMessage({
                            id: "cash-order-form.increase",
                        })}
                    </Radio>
                    <Radio value="support">
                        {formatMessage({
                            id: "cash-order-form.decrease",
                        })}
                    </Radio>
                </DecoratedRadio>
                 */}

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
