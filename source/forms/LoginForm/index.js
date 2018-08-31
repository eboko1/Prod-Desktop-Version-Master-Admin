// vendor
import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
import { onChangeLoginForm, login } from 'core/forms/loginForm/duck';

import { DecoratedInput } from 'forms/DecoratedFields';
import { withReduxForm } from 'utils';

// own
import Styles from './loginForm.m.css';

@injectIntl
@withReduxForm({
    name:    'loginForm',
    actions: {
        change: onChangeLoginForm,
        login,
    },
})
export class LoginForm extends Component {
    _submit = event => {
        event.preventDefault();
        const { login, fields } = this.props;

        login({
            login:    fields.login.value,
            password: fields.password.value,
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        return (
            <Form className={ Styles.loginForm } onSubmit={ this._submit }>
                <DecoratedInput
                    formItem
                    label={ <FormattedMessage id='login_form.login' /> }
                    field='login'
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [{ required: true, message: formatMessage({id: 'login_form.login_is_required'}) }] }
                    placeholder={ formatMessage({id: 'login_form.enter_login'}) }
                />
                <DecoratedInput
                    formItem
                    label={ <FormattedMessage id='login_form.password' /> }
                    field='password'
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [{ required: true, message: formatMessage({id: 'login_form.password_is_required'}) }] }
                    placeholder={ formatMessage({id: 'login_form.enter_password'}) }
                    type='password'
                />
                <Button type='primary' htmlType='submit'>
                    <FormattedMessage id='enter' />
                </Button>
            </Form>
        );
    }
}
