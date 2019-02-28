// vendor
import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Form, Button, Card, message } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";

// proj
import { Result } from "components";
import { DecoratedInput } from "forms/DecoratedFields";
import book from "routes/book.js";
import { fetchAPI } from "utils";

// own
import Styles from "../LoginForm/loginForm.m.css";
@withRouter
@injectIntl
export class NewPassword extends Component {
    state = {
        confirmDirty: false,
        passwordChanged: false,
        handleError: false,
    };

    componentDidMount() {
        this._checkRecoverySession();
    }

    _checkRecoverySession = async () => {
        const passwordResetId = this.props.location.search.split("=").pop();

        const checkExpiration = () => {
            const hide = message.loading("Session validation...", 0);
            setTimeout(hide, 2500);
        };

        const response = await fetchAPI(
            "GET",
            `password/reset/verify?passwordResetId=${passwordResetId}`,
            null,
            { handleErrorInternally: true },
        );

        if (response.status === "valid") checkExpiration();
        if (response.status !== "valid") this.setState({ handleError: true });
    };

    _handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    _compareToFirstPassword = (rule, value, callback) => {
        /* eslint-disable */
        const form = this.props.form;
        if (value && value !== form.getFieldValue("password")) {
            callback(
                this.props.intl.formatMessage({
                    id: "login_form.password_confirmation",
                }),
            );
        } else {
            callback();
        }
        /* eslint-enable */
    };

    _validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirm"], { force: true });
        }
        callback();
    };

    _submit = event => {
        event.preventDefault();

        this.props.form.validateFieldsAndScroll(async err => {
            if (!err) {
                this._checkRecoverySession();

                const passwordResetId = this.props.location.search
                    .split("=")
                    .pop();

                const response = await fetchAPI(
                    "POST",
                    "/password/reset",
                    null,
                    {
                        passwordResetId,
                        password: this.props.form.getFieldValue("password"),
                    },
                    { rawResponse: true, handleErrorInternally: true },
                );

                if (response.status === 200)
                    this.setState({ passwordChanged: true });
                if (response.status !== 200)
                    this.setState({ handleError: true });
            }
        });
    };

    _backToLogin = () =>
        this.setState({ handleError: false, passwordChanged: false });

    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        const { passwordChanged, handleError } = this.state;

        return (
            <Form className={Styles.loginForm} onSubmit={this._submit}>
                {!(passwordChanged || handleError) ? (
                    <>
                        <DecoratedInput
                            formItem
                            label={
                                <FormattedMessage id="login_form.password" />
                            }
                            field="password"
                            getFieldDecorator={getFieldDecorator}
                            type="password"
                            rules={[
                                {
                                    required: true,
                                    message: formatMessage({
                                        id:
                                            "login_form.password_is_required_min",
                                    }),
                                    min: 6,
                                },
                                {
                                    validator: this._validateToNextPassword,
                                },
                            ]}
                            placeholder={formatMessage({
                                id: "login_form.enter_password",
                            })}
                        />
                        <DecoratedInput
                            formItem
                            label={
                                <FormattedMessage id="login_form.confirm_password" />
                            }
                            field="confirm"
                            getFieldDecorator={getFieldDecorator}
                            rules={[
                                {
                                    required: true,
                                    message: formatMessage({
                                        id:
                                            "login_form.password_is_required_min",
                                    }),
                                    min: 6,
                                },
                                {
                                    validator: this._compareToFirstPassword,
                                },
                            ]}
                            placeholder={formatMessage({
                                id: "login_form.enter_password",
                            })}
                            type="password"
                            onBlur={this._handleConfirmBlur}
                        />
                        <Button type="primary" htmlType="submit">
                            <FormattedMessage id="submit" />
                        </Button>
                    </>
                ) : null}
                {handleError && (
                    <Card bordered={false}>
                        <Result
                            type="error"
                            title={<FormattedMessage id="login_form.error" />}
                            description={
                                <FormattedMessage id="login_form.password_expired" />
                            }
                            // extra={ extra }
                            actions={
                                <Link to={book.login}>
                                    <Button onClick={this._backToLogin}>
                                        <FormattedMessage id="login_form.back_to_login" />
                                    </Button>
                                </Link>
                            }
                            style={{ marginTop: 48, marginBottom: 16 }}
                        />
                    </Card>
                )}
                {passwordChanged && (
                    <Card bordered={false}>
                        <Result
                            type="success"
                            title={
                                <FormattedMessage id="login_form.congratulations" />
                            }
                            description={
                                <FormattedMessage id="login_form.password_changed" />
                            }
                            actions={
                                <Link to={book.login}>
                                    <Button onClick={this._backToLogin}>
                                        <FormattedMessage id="login_form.back_to_login" />
                                    </Button>
                                </Link>
                            }
                            style={{ marginTop: 48, marginBottom: 16 }}
                        />
                    </Card>
                )}
            </Form>
        );
    }
}

export const NewPasswordForm = Form.create()(NewPassword);
