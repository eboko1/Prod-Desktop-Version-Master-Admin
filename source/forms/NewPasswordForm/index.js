// vendor
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, message } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
// import { onChangeLoginForm, login } from 'core/forms/loginForm/duck';

import { DecoratedInput } from 'forms/DecoratedFields';
// import { withReduxForm2 } from 'utils';
import book from 'routes/book.js';
import { fetchAPI } from 'utils';

// own
import Styles from '../LoginForm/loginForm.m.css';

@injectIntl
export class NewPassword extends Component {
    state = {
        confirmDirty:    false,
        passwordChanged: false,
    };

    _handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    _compareToFirstPassword = (rule, value, callback) => {
        /* eslint-disable */
        const form = this.props.form;
        if (value && value !== form.getFieldValue("password")) {
            callback("Two passwords that you enter is inconsistent!");
        } else {
            callback();
        }
        /* eslint-enable */
    };

    _validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields([ 'confirm' ], { force: true });
        }
        callback();
    };

    _submit = event => {
        event.preventDefault();
        const { getFieldValue } = this.props.form;
        try {
            fetchAPI(
                'POST',
                '/password/reset',
                null,
                {
                    login: getFieldValue('password'),
                },
                { handleErrorInternally: true },
            );
        } catch (error) {
            (function() {
                console.log('→ ERROR', error);
                message.error('This is a message of error');
            }());
        } finally {
            this.setState(() => {
                message.success('This is a message of success');

                return { passwordChanged: true };
            });
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        return (
            <Form className={ Styles.loginForm } onSubmit={ this._submit }>
                <DecoratedInput
                    formItem
                    label={ <FormattedMessage id='login_form.password' /> }
                    field='password'
                    getFieldDecorator={ getFieldDecorator }
                    type='password'
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'login_form.password_is_required',
                            }),
                        },
                        {
                            validator: this._validateToNextPassword,
                        },
                    ] }
                    placeholder={ formatMessage({
                        id: 'login_form.enter_password',
                    }) }
                />
                <DecoratedInput
                    formItem
                    label={ <FormattedMessage id='login_form.password' /> }
                    field='confirm'
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'login_form.password_is_required',
                            }),
                        },
                        {
                            validator: this._compareToFirstPassword,
                        },
                    ] }
                    placeholder={ formatMessage({
                        id: 'login_form.enter_password',
                    }) }
                    type='password'
                    onBlur={ this._handleConfirmBlur }
                />
                <Button type='primary' htmlType='submit'>
                    <FormattedMessage id='submit' />
                </Button>
            </Form>
        );
    }
}

export const NewPasswordForm = Form.create()(NewPassword);
