// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Button, Icon, Modal } from "antd";
import moment from "moment";
import _ from "lodash";

//proj
import { onChangeEmployeeForm } from "core/forms/employeeForm/duck";

import { Loader } from "commons";
import { PhoneNumberInput, Barcode } from "components";
import {
    DecoratedInput,
    DecoratedDatePicker,
    DecoratedCheckbox,
} from "forms/DecoratedFields";
import { withReduxForm2, permissions, isForbidden } from "utils";

// own
import Styles from "./styles.m.css";

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 8 },
        xl: { span: 6 },
        xxl: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 16 },
        xl: { span: 18 },
        xxl: { span: 20 },
    },
    colon: false,
};
const { confirm } = Modal;

@injectIntl
@withReduxForm2({
    name: "employeeForm",
    actions: {
        change: onChangeEmployeeForm,
    },
})
export class EmployeeForm extends Component {
    state = {
        passwordField: false,
    };

    componentDidMount() {
        const initialAccess = _.get(
            this.props.initialEmployee,
            "managerEnabled",
        );
        this.props.form.setFieldsValue({
            managerEnabled: initialAccess,
        });
    }

    _setPasswordField = () =>
        this.setState(state => ({
            passwordField: !state.passwordField,
        }));

    render() {
        const {
            adding,
            initialEmployee,
            saveEmployee,
            fireEmployee,
        } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { formatMessage } = this.props.intl;
        const managerEnabled = Boolean(getFieldValue("managerEnabled"));
        const passwordField = this._renderPasswordField();
        const barcode = getFieldValue("barcode");

        return (
            <Form layout="horizontal">
                <div className={Styles.formWrapper}>
                    <DecoratedInput
                        field="name"
                        label={<FormattedMessage id="employee.name" />}
                        placeholder={formatMessage({
                            id: "employee.name_placeholder",
                        })}
                        formItem
                        formItemLayout={formItemLayout}
                        initialValue={_.get(initialEmployee, "name")}
                        rules={[
                            {
                                required: true,
                                message: formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        className={Styles.selectMargin}
                        getPopupContainer={trigger => trigger.parentNode}
                        getFieldDecorator={getFieldDecorator}
                    />
                    <DecoratedInput
                        field="surname"
                        label={<FormattedMessage id="employee.surname" />}
                        placeholder={formatMessage({
                            id: "employee.surname_placeholder",
                        })}
                        formItem
                        formItemLayout={formItemLayout}
                        initialValue={_.get(initialEmployee, "surname")}
                        rules={[
                            {
                                required: true,
                                message: formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        className={Styles.selectMargin}
                        getPopupContainer={trigger => trigger.parentNode}
                        getFieldDecorator={getFieldDecorator}
                    />
                    <FormItem
                        label={<FormattedMessage id="employee.phone" />}
                        {...formItemLayout}
                        className={Styles.selectMargin}
                    >
                        <PhoneNumberInput
                            intl={this.props.intl}
                            fieldName="phone"
                            fieldTitle={
                                <FormattedMessage id="employee.phone" />
                            }
                            initialPhoneNumber={_.get(initialEmployee, "phone")}
                            form={this.props.form}
                            rules={[
                                {
                                    required: true,
                                    message: formatMessage({
                                        id: "required_field",
                                    }),
                                },
                            ]}
                        />
                    </FormItem>
                    <DecoratedDatePicker
                        field="hireDate"
                        label={<FormattedMessage id="employee.hireDate" />}
                        formItem
                        formItemLayout={formItemLayout}
                        formatMessage={formatMessage}
                        // className={ Styles.selectMargin }
                        getFieldDecorator={getFieldDecorator}
                        getCalendarContainer={trigger => trigger.parentNode}
                        initialValue={
                            initialEmployee && moment(initialEmployee.hireDate)
                        }
                        rules={[
                            {
                                required: true,
                                message: formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        format={"YYYY-MM-DD"}
                        placeholder={
                            <FormattedMessage id="order_task_modal.deadlineDate_placeholder" />
                        }
                    />
                    <DecoratedInput
                        field="email"
                        label={<FormattedMessage id="employee.email" />}
                        placeholder={formatMessage({
                            id: "employee.email_placeholder",
                        })}
                        formItem
                        formItemLayout={formItemLayout}
                        initialValue={_.get(initialEmployee, "email")}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        rules={[
                            {
                                required: managerEnabled,
                                message: formatMessage({
                                    id: "required_field",
                                }),
                            },
                            managerEnabled && {
                                validator: (rule, value, callback) => {
                                    let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; // eslint-disable-line
                                    /* eslint-disable */
                                    if (re.test(value)) {
                                        callback();
                                    } else {
                                        callback(
                                            new Error(
                                                formatMessage({
                                                    id:
                                                        "employee.enter_correct_email",
                                                }),
                                            ),
                                        );
                                    }

                                    /* eslint-enable */
                                    return true;
                                },
                                message: "",
                            },
                        ]}
                        className={Styles.selectMargin}
                        getPopupContainer={trigger => trigger.parentNode}
                        getFieldDecorator={getFieldDecorator}
                    />
                    <FormItem
                        label={<FormattedMessage id="navigation.barcode" />}
                        {...formItemLayout}
                        className={Styles.selectMargin}
                    >
                        <DecoratedInput
                            field="barcode"
                            placeholder={formatMessage({
                                id: "navigation.barcode",
                            })}
                            formItem
                            formItemLayout={formItemLayout}
                            initialValue={_.get(initialEmployee, "barcode")}
                            className={Styles.selectMargin}
                            getPopupContainer={trigger => trigger.parentNode}
                            getFieldDecorator={getFieldDecorator}
                            style={{minWidth: 240}}
                        />
                        <Barcode
                            value={barcode}
                            iconStyle={{
                                fontSize: 18,
                                marginLeft: 8
                            }}
                        />
                    </FormItem>
                    <DecoratedCheckbox
                        fields={{}}
                        field="managerEnabled"
                        formItem
                        label={
                            <FormattedMessage id="employee.manager_access" />
                        }
                        formItemLayout={formItemLayout}
                        getFieldDecorator={getFieldDecorator}
                        initialValue={Boolean(
                            _.get(initialEmployee, "managerEnabled"),
                        )}
                        onChange={() => this._setPasswordField()}
                    />
                    <DecoratedCheckbox
                        field="isMechanic"
                        formItem
                        label={<FormattedMessage id="employee.is_mechanic" />}
                        formItemLayout={formItemLayout}
                        getFieldDecorator={getFieldDecorator}
                        initialValue={Boolean(
                            _.get(initialEmployee, "isMechanic"),
                        )}
                    />
                    {passwordField}
                    <DecoratedInput
                        field="jobTitle"
                        label={<FormattedMessage id="employee.jobTitle" />}
                        placeholder={formatMessage({
                            id: "employee.jobTitle_placeholder",
                        })}
                        formItem
                        formItemLayout={formItemLayout}
                        initialValue={_.get(initialEmployee, "jobTitle")}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        rules={[
                            {
                                required: true,
                                max: 2000,
                                message: formatMessage({
                                    id: "required_field",
                                }),
                            },
                        ]}
                        className={Styles.selectMargin}
                        getPopupContainer={trigger => trigger.parentNode}
                        getFieldDecorator={getFieldDecorator}
                    />
                    <div className={Styles.ButtonGroup}>
                        {initialEmployee && !initialEmployee.fireDate ? (
                            <Button
                                type="danger"
                                disabled={isForbidden(
                                    this.props.user,
                                    permissions.CREATE_EDIT_DELETE_EMPLOYEES,
                                )}
                                onClick={() => {
                                    confirm({
                                        title: `${formatMessage({id: "employee.fire_confirm"})}`,
                                        onOk() {
                                            fireEmployee()
                                        },
                                    });
                                }}
                            >
                                <FormattedMessage id="employee.fire_employee" />
                            </Button>
                        ) : null}
                        <Button
                            disabled={isForbidden(
                                this.props.user,
                                permissions.CREATE_EDIT_DELETE_EMPLOYEES,
                            )}
                            type="primary"
                            onClick={() => saveEmployee()}
                        >
                            <FormattedMessage id="save" />
                        </Button>
                    </div>
                </div>
            </Form>
        );
    }

    _renderPasswordField = () => {
        const { adding, initialEmployee } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { formatMessage } = this.props.intl;
        const managerEnabled = Boolean(getFieldValue("managerEnabled"));

        return (
            getFieldValue("managerEnabled") && (
                <div
                    className={
                        this.state.passwordField && Styles.passwordFieldEditing
                    }
                >
                    {initialEmployee &&
                        (this.state.passwordField ? (
                            <div
                                className={Styles.cancelPasswordControl}
                                onClick={() => this._setPasswordField()}
                            >
                                <Icon type="close" />
                                <FormattedMessage id="cancel" />
                            </div>
                        ) : (
                            <Button
                                onClick={() => this._setPasswordField()}
                                className={Styles.changePasswordControl}
                            >
                                <FormattedMessage id="employee.change_password" />
                            </Button>
                        ))}
                    {this.state.passwordField && (
                        <DecoratedInput
                            fields={{}}
                            field="password"
                            type="password"
                            formItem
                            label={
                                adding ? (
                                    <FormattedMessage id="employee.password" />
                                ) : (
                                    <FormattedMessage id="employee.change_password" />
                                )
                            }
                            formItemLayout={formItemLayout}
                            getFieldDecorator={getFieldDecorator}
                            placeholder={formatMessage({
                                id: "employee.password.placeholder",
                            })}
                            rules={[
                                {
                                    required: managerEnabled,
                                    min: 6,
                                    message: formatMessage({
                                        id: "employee.password.lenght",
                                    }),
                                },
                            ]}
                        />
                    )}
                </div>
            )
        );
    };
}
