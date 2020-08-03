// vendor
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

// proj
import { onChangeLoginForm, login } from "core/forms/loginForm/duck";

import { DecoratedInput } from "forms/DecoratedFields";
import { withReduxForm } from "utils";
import book from "routes/book";

// own
import Styles from "./loginForm.m.css";

@injectIntl
@withReduxForm({
    name: "loginForm",
    actions: {
        change: onChangeLoginForm,
        login,
    },
})
export class LoginForm extends Component {
    _submit = event => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.login(values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        return (
            <Form className={Styles.loginForm}>
                <DecoratedInput
                    formItem
                    label={<FormattedMessage id="login_form.login" />}
                    field="login"
                    getFieldDecorator={getFieldDecorator}
                    rules={[
                        {
                            required: true,
                            message: formatMessage({
                                id: "login_form.login_is_required",
                            }),
                        },
                    ]}
                    placeholder={formatMessage({
                        id: "login_form.enter_login",
                    })}
                />
                <DecoratedInput
                    formItem
                    label={<FormattedMessage id="login_form.password" />}
                    field="password"
                    getFieldDecorator={getFieldDecorator}
                    rules={[
                        {
                            required: true,
                            message: formatMessage({
                                id: "login_form.password_is_required",
                            }),
                        },
                    ]}
                    placeholder={formatMessage({
                        id: "login_form.enter_password",
                    })}
                    type="password"
                />
                <Button type="primary" onClick={this._submit}>
                    <FormattedMessage id="enter" />
                </Button>
                <div style={{marginTop: 10}}>
                    <Link to={book.forgotPassword}>
                        <FormattedMessage id="login_form.forgot_password" />
                    </Link>
                </div>
            </Form>
        );
    }
}
