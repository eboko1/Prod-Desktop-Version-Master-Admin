// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Select, Icon } from "antd";
import classNames from "classnames/bind";
import moment from "moment";
import _ from "lodash";

// proj
import {
    DecoratedDatePicker,
    DecoratedTimePicker,
    DecoratedSelect,
    DecoratedSlider,
} from "forms/DecoratedFields";
import { Numeral } from "commons";
import book from "routes/book";
import {
    getDateTimeConfig,
    permissions,
    isForbidden,
    mergeDateTime,
    addDuration,
    goTo,
} from "utils";

// own
import { formHeaderItemLayout } from "../layouts";
import Styles from "./styles.m.css";
const FormItem = Form.Item;
const Option = Select.Option;

const cx = classNames.bind(Styles);

// TODO: move it into utils
// blocks hours for time picker
const getAvailableHoursDisabledHours = propsAvailableHours => () => {
    const availableHours = _.get(propsAvailableHours, "0", []);

    return _.difference(
        Array(24)
            .fill(1)
            .map((value, index) => index),
        availableHours.map(availableHour =>
            Number(moment(availableHour).format("HH")),
        ),
    );
};

// TODO: move it into utils
// blocks minutes for time picker
const getAvailableHoursDisabledMinutes = propsAvailableHours => hour => {
    const availableHours = _.get(propsAvailableHours, "0", []);

    const availableMinutes = availableHours
        .map(availableHour => moment(availableHour))
        .filter(availableHour => Number(availableHour.format("HH")) === hour)
        .map(availableHour => Number(availableHour.format("mm")));

    return _.difference([0, 30], availableMinutes);
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
export default class OrderFormHeader extends Component {
    constructor(props) {
        super(props);

        const {
            intl: { formatMessage },
        } = props;

        // reusable validation rule
        this.requiredRule = [
            {
                required: true,
                message: formatMessage({
                    id: "required_field",
                }),
            },
        ];

        const stationsOptions = this._getStationsOptions();
        const managersOptions = this._getManagersOptions();
        const employeesOptions = this._getEmployeesOptions();

        const paymentMethodOptions = [
            <Option value="cash" key="cash">
                <Icon type="wallet" />
                <FormattedMessage id="add_order_form.cash" />
            </Option>,
            <Option value="noncash" key="noncash">
                <Icon type="credit-card" />
                <FormattedMessage id="add_order_form.non-cash" />
            </Option>,
            <Option value="visa" key="visa">
                <Icon type="credit-card" />
                <FormattedMessage id="add_order_form.visa" />
            </Option>,
        ];
        // TODO: move into utils
        // <FormatMessage id=''> triggers re-render cuz it is creating new obj
        // use formatMassage({id: }) instead
        this._localizationMap = {};

        const deliveryDatetimeConfig = this._getDeliveryDatetimeConfig();
        const beginDatetimeConfig = this._getBeginDatetimeConfig();
        // we write all data to state to handle updates correctly
        this.state = {
            deliveryDatetimeConfig,
            beginDatetimeConfig,
            stationsOptions,
            employeesOptions,
            managersOptions,
            paymentMethodOptions,
        };

        this.stationRef = React.createRef();
        this.employeeRef = React.createRef();
        this.requisitesRef = React.createRef();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(nextProps, this.props) ||
            !_.isEqual(nextState, this.state)
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps.stations !== this.props.stations) {
            const stationsOptions = this._getStationsOptions();
            this.setState({ stationsOptions });
        }

        if (prevProps.managers !== this.props.managers) {
            const managersOptions = this._getManagersOptions();
            this.setState({ managersOptions });
        }

        if (prevProps.employees !== this.props.employees) {
            const employeesOptions = this._getEmployeesOptions();
            this.setState({ employeesOptions });
        }
        // check all fields related for deliveryDatetime
        const deliveryFields = [
            "schedule",
            "zeroStationLoadBeginDate",
            "zeroStationLoadBeginTime",
            "zeroStationLoadDuration",
            "deliveryDate",
        ];
        // check deliveryDatetime depended properties changes
        // if moment -> toISOString to check moment objects as strings to prevent re-renders
        const deliveryConfigUpdate = deliveryFields.reduce((prev, cur) => {
            const parsedThisProps = moment.isMoment(this.props[cur])
                ? this.props[cur].toISOString()
                : this.props[cur];
            const parsedPrevProps = moment.isMoment(prevProps[cur])
                ? prevProps[cur].toISOString()
                : prevProps[cur];

            return prev || parsedThisProps !== parsedPrevProps;
        }, false);
        // if deliveryDatetime fields have been updated
        // get new config and set it to local state to trigger componentUpdate with new config
        if (deliveryConfigUpdate) {
            this.setState({
                deliveryDatetimeConfig: this._getDeliveryDatetimeConfig(),
            });
        }
        // update check for beginDatetime
        const currentZeroStationLoadBeginDate = this.props
            .zeroStationLoadBeginDate
            ? this.props.zeroStationLoadBeginDate.toISOString()
            : void 0;
        const prevZeroStationLoadBeginDate = prevProps.zeroStationLoadBeginDate
            ? prevProps.zeroStationLoadBeginDate.toISOString()
            : void 0;

        if (
            this.props.schedule !== prevProps.schedule ||
            currentZeroStationLoadBeginDate !== prevZeroStationLoadBeginDate
        ) {
            this.setState({
                beginDatetimeConfig: this._getBeginDatetimeConfig(),
            });
        }

        if(prevProps.focusedRef != this.props.focusedRef) {
            if(this.props.focusedRef == 'HEADER_STATION') {
                this.stationRef.current.focus();
                this.props.focusOnRef(undefined);
            }
            if(this.props.focusedRef == 'HEADER_EMPLOYEE') {
                this.employeeRef.current.focus();
                this.props.focusOnRef(undefined);
            }
            if(this.props.focusedRef == 'HEADER_REQUISITES') {
                this.requisitesRef.current.focus();
                this.props.focusOnRef(undefined);
            }
        }
    }
    // TODO: move into utils
    bodyUpdateIsForbidden() {
        return isForbidden(this.props.user, permissions.ACCESS_ORDER_BODY);
    }

    _getBeginDatetimeConfig() {
        const { schedule } = this.props;
        const { disabledDate } = getDateTimeConfig(void 0, schedule);
        const { beginTime } = getDateTimeConfig(void 0, schedule) || moment().add( (30 - (moment().minute() % 30)) , "minutes").format('YYYY-MM-DD HH:00');

        return {
            disabledDate,
            beginTime,
        };
    }

    _getDeliveryDatetimeConfig() {
        const {
            schedule,
            zeroStationLoadBeginDate,
            zeroStationLoadBeginTime,
            zeroStationLoadDuration,
            deliveryDate,
        } = this.props;

        const excludeConfig = [
            {
                momentDate: zeroStationLoadBeginDate,
                momentTime: zeroStationLoadBeginTime,
                duration: zeroStationLoadDuration,
            },
        ];

        const {
            disabledHours,
            disabledMinutes,
            disabledSeconds,
            disabledDate: dateTimeDisabledDate,
            beginTime,
        } = getDateTimeConfig(moment(deliveryDate), schedule, excludeConfig);

        const initialBeginDatetime = moment(zeroStationLoadBeginDate).set({
            hours: 0,
            minutes: 0,
            milliseconds: 0,
            seconds: 0,
        });

        const sameOfBeforeDisabledDate = date =>
            dateTimeDisabledDate(date) ||
            (date && date.isSameOrBefore(initialBeginDatetime));

        const initialDeliveryDatetime =
            zeroStationLoadBeginDate &&
            zeroStationLoadBeginTime &&
            zeroStationLoadDuration
                ? addDuration(
                      mergeDateTime(
                          zeroStationLoadBeginDate,
                          zeroStationLoadBeginTime,
                      ),
                      zeroStationLoadDuration,
                  )
                : void 0;

        return {
            disabledHours,
            disabledMinutes,
            disabledSeconds,
            disabledDate: sameOfBeforeDisabledDate,
            beginTime,
            initialDeliveryDatetime,
        };
    }

    // prevent re-renders
    _getLocalization(key) {
        if (!this._localizationMap[key]) {
            this._localizationMap[key] = this.props.intl.formatMessage({
                id: key,
            });
        }

        return this._localizationMap[key];
    }

    _getStationsOptions = () => {
        return _.get(this.props, "stations", []).map(({ name, num }) => {
            return (
                <Option value={num} key={String(num)}>
                    {name || String(num)}
                </Option>
            );
        });
    };

    _getManagersOptions = () => {
        return _.get(this.props, "managers", []).map(manager => (
            <Option
                disabled={manager.disabled}
                value={manager.id}
                key={`manager-${manager.id}`}
            >
                {`${manager.managerName} ${manager.managerSurname}`}
            </Option>
        ));
    };

    _getEmployeesOptions = () => {
        return _.get(this.props, "employees", []).map(employee => {
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
        });
    };

    _redirectToCashFlow = () => {
        if (!isForbidden(this.props.user, permissions.ACCESS_ACCOUNTING)) {
            goTo(book.cashFlowPage, {
                cashFlowFilters: { ...this.props.cashFlowFilters },
            });
        }
    };

    _totalStyles = disabled =>
        cx({
            totalDisabled: disabled,
            total: true,
        });

    render() {
        // TODO: decomposite for separate view components
        const dateBlock = this._renderDateBlock();
        const masterBlock = this._renderMasterBlock();
        const totalBlock = this._renderTotalBlock();
        const duration = this._renderDuration();

        return (
            <div className={Styles.formHeader} id='OrderFormHeader'>
                <div className={Styles.headerColumns}>
                    {dateBlock} {masterBlock} {totalBlock}
                </div>
                {duration}
            </div>
        );
    }

    _renderDuration = () => {
        const {
            fetchedOrder,
            totalHours,
            fields,
            zeroStationLoadDuration,
            deliveryDate,
            form: { getFieldDecorator },
            intl: { formatMessage },
            errors,
        } = this.props;
        const {
            disabledDate,
            disabledHours,
            disabledMinutes,
            disabledSeconds,
            beginTime,
            initialDeliveryDatetime: calculatedDeliveryDatetime,
        } = this.state.deliveryDatetimeConfig;

        const initialDeliveryDatetime = _.get(
            fetchedOrder,
            "order.deliveryDatetime",
        );

        return (
            <div className={Styles.durationBlock}>
                <DecoratedSlider
                    errors={errors}
                    fieldValue={_.get(fields, "stationLoads[0].duration")}
                    defaultGetValueProps
                    field="stationLoads[0].duration"
                    formItem
                    formItemLayout={formHeaderItemLayout}
                    className={`${Styles.duration} ${Styles.deliveryDatetime}`}
                    colon={false}
                    disabled={this.bodyUpdateIsForbidden()}
                    initialValue={
                        _.get(fetchedOrder, "order.duration") || totalHours
                    }
                    label={
                        <>
                            <span>
                                {`${this._getLocalization(
                                    "time",
                                )} (${zeroStationLoadDuration}${this._getLocalization(
                                    "add_order_form.hours_shortcut",
                                )})`}
                            </span>
                            <span style={{ marginLeft: 10 }}>
                                <Icon
                                    className={Styles.updateDurationIcon}
                                    type="redo"
                                    title="Пересчитать длительность"
                                    onClick={() => this.props.updateOrderField('duration')}
                                    title={this.props.intl.formatMessage({
                                        id: "duration.recalculate",
                                    })}
                                />
                            </span>
                        </>
                    }
                    getFieldDecorator={getFieldDecorator}
                    min={0}
                    step={0.5}
                    max={8}
                />
                <DecoratedDatePicker
                    errors={errors}
                    defaultGetValueProps
                    fieldValue={
                        _.get(fields, "deliveryDate")
                            ? _.get(fields, "deliveryDate").toISOString()
                            : void 0
                    }
                    getFieldDecorator={getFieldDecorator}
                    disabled={this.bodyUpdateIsForbidden()}
                    field="deliveryDate"
                    hasFeedback
                    formItem
                    formItemLayout={formHeaderItemLayout}
                    label={this._getLocalization(
                        "add_order_form.delivery_date",
                    )}
                    colon={false}
                    className={Styles.deliveryDatetime}
                    rules={this.requiredRule}
                    placeholder={this._getLocalization(
                        "add_order_form.select_date",
                    )}
                    disabledDate={disabledDate}
                    format={"YYYY-MM-DD"} // HH:mm
                    showTime={false}
                    initialValue={
                        initialDeliveryDatetime
                            ? moment(initialDeliveryDatetime).toISOString()
                            : calculatedDeliveryDatetime
                            ? calculatedDeliveryDatetime.toISOString()
                            : void 0
                    }
                />
                <DecoratedTimePicker
                    errors={errors}
                    defaultGetValueProps
                    fieldValue={
                        _.get(fields, "deliveryTime")
                            ? _.get(fields, "deliveryTime").toISOString()
                            : void 0
                    }
                    formItem
                    disabled={Boolean(
                        this.bodyUpdateIsForbidden() || !deliveryDate,
                    )}
                    disabledHours={disabledHours}
                    disabledMinutes={disabledMinutes}
                    disabledSeconds={disabledSeconds}
                    formItemLayout={formHeaderItemLayout}
                    defaultOpenValue={moment(
                        `${beginTime}:00`,
                        "HH:mm:ss",
                    ).toISOString()}
                    field="deliveryTime"
                    hasFeedback
                    label={this._getLocalization(
                        "add_order_form.delivery_time",
                    )}
                    formatMessage={formatMessage}
                    className={Styles.deliveryDatetime}
                    getFieldDecorator={getFieldDecorator}
                    rules={this.requiredRule}
                    placeholder={this._getLocalization(
                        "add_order_form.provide_time",
                    )}
                    initialValue={
                        initialDeliveryDatetime
                            ? moment(initialDeliveryDatetime).toISOString()
                            : calculatedDeliveryDatetime
                            ? calculatedDeliveryDatetime.toISOString()
                            : void 0
                    }
                    minuteStep={30}
                />
            </div>
        );
    };

    _renderDateBlock = () => {
        const {
            location,
            fetchedOrder,
            schedule,
            zeroStationLoadBeginDate,
            zeroStationLoadStation,
            fields,
            errors,
        } = this.props;
        const { formatMessage } = this.props.intl;
        const { getFieldDecorator } = this.props.form;

        const { disabledDate, beginTime } = this.state.beginDatetimeConfig;

        const beginDatetime =
            _.get(fetchedOrder, "order.beginDatetime") ||
            (this.bodyUpdateIsForbidden()
                ? void 0
                : _.get(location, "state.beginDatetime"));

        const momentBeginDatetime = beginDatetime
            ? moment(beginDatetime).toISOString()
            : void 0;

        const dayNumber = moment(_.get(fields, "stationLoads[0].beginDate")).day();
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
                schedule[index].beginTime.split(/[.:]/)[0],
                schedule[index].endTime.split(/[.:]/)[0]
            )
        }

        return (
            <div className={Styles.headerCol}>
                <DecoratedDatePicker
                    errors={errors}
                    defaultGetValueProps
                    fieldValue={
                        _.get(fields, "stationLoads[0].beginDate")
                            ? _.get(
                                  fields,
                                  "stationLoads[0].beginDate",
                              ).toISOString()
                            : void 0
                    }
                    getFieldDecorator={getFieldDecorator}
                    disabled={this.bodyUpdateIsForbidden()}
                    field="stationLoads[0].beginDate"
                    hasFeedback
                    formItem
                    formItemLayout={formHeaderItemLayout}
                    // formatMessage={ formatMessage }
                    label={this._getLocalization(
                        "add_order_form.enrollment_date",
                    )}
                    allowClear={false}
                    colon={false}
                    className={Styles.datePanelItem}
                    //rules={this.requiredRule}
                    placeholder={this._getLocalization(
                        "add_order_form.select_date",
                    )}
                    //disabledDate={disabledDate}
                    format={"YYYY-MM-DD"} // HH:mm
                    showTime={false}
                    initialValue={momentBeginDatetime}
                />
                <DecoratedSelect
                    errors={errors}
                    colon={false}
                    className={Styles.datePanelItem}
                    getFieldDecorator={getFieldDecorator}
                    field="stationLoads[0].station"
                    fieldValue={_.get(fields, "stationLoads[0].station")}
                    defaultGetValueProps
                    formItem
                    formItemLayout={formHeaderItemLayout}
                    rules={this.requiredRule}
                    label={this._getLocalization("add_order_form.station")}
                    placeholder={this._getLocalization(
                        "add_order_form.select_station",
                    )}
                    disabled={this.bodyUpdateIsForbidden()}
                    initialValue={
                        _.get(fetchedOrder, "order.stationNum") ||
                        (this.bodyUpdateIsForbidden()
                            ? void 0
                            : _.get(location, "state.stationNum"))
                    }
                    ref={this.stationRef}
                    showAction={['focus', 'click']}
                >
                    {this.state.stationsOptions}
                </DecoratedSelect>
                <DecoratedTimePicker
                    errors={errors}
                    defaultGetValueProps
                    fieldValue={
                        _.get(fields, "stationLoads[0].beginTime")
                            ? _.get(
                                  fields,
                                  "stationLoads[0].beginTime",
                              ).toISOString()
                            : void 0
                    }
                    formItem
                    disabled={this.bodyUpdateIsForbidden() || !_.get(fields, "stationLoads[0].beginDate")}
                    formItemLayout={formHeaderItemLayout}
                    defaultOpenValue={moment(
                        `${beginTime}:00`,
                        "HH:mm:ss",
                    ).toISOString()}
                    field="stationLoads[0].beginTime"
                    disabledHours={()=>disabledHours}
                    label={this._getLocalization("add_order_form.applied_on")}
                    formatMessage={formatMessage}
                    className={Styles.datePanelItem}
                    getFieldDecorator={getFieldDecorator}
                    rules={this.requiredRule}
                    placeholder={this._getLocalization(
                        "add_order_form.provide_time",
                    )}
                    minuteStep={30}
                    initialValue={momentBeginDatetime}
                    hideDisabledOptions
                />
            </div>
        );
    };

    _renderMasterBlock = () => {
        const {
            fetchedOrder,
            managers,
            authentificatedManager,
            fields,
            errors,
            location,
        } = this.props;

        const isOwnBusiness =
            _.find(managers, {
                id: authentificatedManager,
            }) || void 0;

        const { getFieldDecorator } = this.props.form;
        return (
            <div className={Styles.headerCol}>
                <DecoratedSelect
                    errors={errors}
                    fieldValue={_.get(fields, "manager")}
                    defaultGetValueProps
                    field="manager"
                    formItem
                    getFieldDecorator={getFieldDecorator}
                    rules={this.requiredRule}
                    label={this._getLocalization("add_order_form.manager")}
                    hasFeedback
                    colon={false}
                    className={Styles.datePanelItem}
                    initialValue={
                        _.get(fetchedOrder, "order.managerId") ||
                        (this.bodyUpdateIsForbidden()
                            ? void 0
                            : isOwnBusiness && authentificatedManager)
                    }
                    disabled={this.bodyUpdateIsForbidden()}
                    placeholder={this._getLocalization(
                        "add_order_form.select_manager",
                    )}
                    formItemLayout={formHeaderItemLayout}
                >
                    {this.state.managersOptions}
                </DecoratedSelect>
                <DecoratedSelect
                    errors={errors}
                    formItem
                    fieldValue={_.get(fields, "employee")}
                    defaultGetValueProps
                    field="employee"
                    label={this._getLocalization("order_form_table.master")}
                    className={Styles.durationPanelItem}
                    disabled={this.bodyUpdateIsForbidden()}
                    getFieldDecorator={getFieldDecorator}
                    initialValue={
                        _.get(fetchedOrder, "order.employeeId") ||
                        (location.state ? location.state.employeeId : undefined)
                    }
                    placeholder={this._getLocalization(
                        "order_form_table.select_master",
                    )}
                    formItemLayout={formHeaderItemLayout}
                    ref={this.employeeRef}
                    showAction={['focus', 'click']}
                >
                    {this.state.employeesOptions}
                </DecoratedSelect>
                <DecoratedSelect
                    errors={errors}
                    formItem
                    fieldValue={_.get(fields, "appurtenanciesResponsible")}
                    defaultGetValueProps
                    field="appurtenanciesResponsible"
                    label={this._getLocalization(
                        "order_form_table.appurtenancies_responsible",
                    )}
                    className={Styles.durationPanelItem}
                    disabled={this.bodyUpdateIsForbidden()}
                    getFieldDecorator={getFieldDecorator}
                    initialValue={_.get(
                        fetchedOrder,
                        "order.appurtenanciesResponsibleId",
                    )}
                    placeholder={this._getLocalization(
                        "add_order_form.select_appurtenancies_responsible",
                    )}
                    formItemLayout={formHeaderItemLayout}
                >
                    {this.state.employeesOptions}
                </DecoratedSelect>
            </div>
        );
    };

    _renderTotalBlock = () => {
        const { fetchedOrder, fields } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { errors, totalPrice, cashSum, remainPrice, totalSumWithTax, isTaxPayer } = this.props;
        const mask = "0,0.00";

        return (
            <div className={Styles.headerCol}>
                <FormItem className={Styles.sumBlock}>
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
                                {totalPrice}
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
                    <div
                        className={this._totalStyles(
                            isForbidden(
                                this.props.user,
                                permissions.ACCESS_ACCOUNTING,
                            ),
                        )}
                        onClick={() => this._redirectToCashFlow()}
                    >
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
                </FormItem>
                <DecoratedSelect
                    errors={errors}
                    fieldValue={_.get(fields, "paymentMethod")}
                    defaultGetValueProps
                    field="paymentMethod"
                    disabled={this.bodyUpdateIsForbidden()}
                    initialValue={_.get(fetchedOrder, "order.paymentMethod")}
                    formItem
                    colon={false}
                    getFieldDecorator={getFieldDecorator}
                    formItemLayout={formHeaderItemLayout}
                    label={this._getLocalization(
                        "add_order_form.payment_method",
                    )}
                    placeholder={this._getLocalization(
                        "add_order_form.select_payment_method",
                    )}
                >
                    {this.state.paymentMethodOptions}
                </DecoratedSelect>
                <DecoratedSelect
                    allowClear={true}
                    errors={errors}
                    field="requisite"
                    fieldValue={_.get(fields, "requisite")}
                    defaultGetValueProps
                    disabled={this.bodyUpdateIsForbidden()}
                    initialValue={_.get(
                        fetchedOrder,
                        "order.businessRequisiteId",
                    )}
                    formItem
                    label={this._getLocalization(
                        "add_order_form.service_requisites",
                    )}
                    formItemLayout={formHeaderItemLayout}
                    getFieldDecorator={getFieldDecorator}
                    placeholder={this._getLocalization(
                        "add_order_form.select_requisites",
                    )}
                    options={this.props.requisites}
                    optionValue="id"
                    optionLabel="name"
                    optionDisabled="disabled"
                    ref={this.requisitesRef}
                    showAction={['focus', 'click']}
                />
            </div>
        );
    };
}
