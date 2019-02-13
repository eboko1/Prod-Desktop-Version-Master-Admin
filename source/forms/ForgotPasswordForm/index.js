// vendor
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Card } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";

// proj
import { Result } from "components";

import { DecoratedInput } from "forms/DecoratedFields";
// import { withReduxForm2 } from 'utils';
import book from "routes/book.js";
import { fetchAPI } from "utils";

// own
import Styles from "../LoginForm/loginForm.m.css";

@injectIntl
export class ForgotPassword extends Component {
    state = {
        noLogin: false,
        goToMail: false,
    };

    _submit = async event => {
        event.preventDefault();

        const response = await fetchAPI(
            "POST",
            "/password/reset/request",
            null,
            {
                login: this.props.form.getFieldValue("login"),
            },
            {
                rawResponse: true,
                handleErrorInternally: true,
            },
        );

        if (response.status === 200) this.setState({ goToMail: true });
        if (response.status !== 200) this.setState({ noLogin: true });
    };

    _backToForm = () => this.setState({ noLogin: false });
    _backToLogin = () => this.setState({ goToMail: false });

    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        const { noLogin, goToMail } = this.state;

        return (
            <Form className={Styles.loginForm} onSubmit={this._submit}>
                {!(noLogin || goToMail) ? (
                    <>
                        <DecoratedInput
                            formItem
                            label={
                                <FormattedMessage id="login_form.enter_your_registration_login" />
                            }
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
                        <Button type="primary" htmlType="submit">
                            <FormattedMessage id="submit" />
                        </Button>
                    </>
                ) : null}
                {noLogin && (
                    <Card bordered={false}>
                        <Result
                            type="error"
                            title={<FormattedMessage id="login_form.error" />}
                            description={
                                <FormattedMessage id="login_form.no_login_found" />
                            }
                            // extra={ extra }
                            actions={
                                <Button onClick={this._backToForm}>
                                    <FormattedMessage id="login_form.back_to_form" />
                                </Button>
                            }
                            style={{ marginTop: 48, marginBottom: 16 }}
                        />
                    </Card>
                )}
                {goToMail && (
                    <Card bordered={false}>
                        <Result
                            type="success"
                            title={
                                <FormattedMessage id="login_form.go_to_mail" />
                            }
                            description={
                                <FormattedMessage id="login_form.go_to_mail_description" />
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

export const ForgotPasswordForm = Form.create()(ForgotPassword);
