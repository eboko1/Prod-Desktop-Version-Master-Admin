// vendor
import React, { Component } from 'react';
import { Form, Button } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { onChangeLoginForm, login } from 'core/forms/loginForm/duck';

import { DecoratedInput } from 'forms/DecoratedFields';
import { withReduxForm } from 'utils';

// own
import Styles from './loginForm.m.css';

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

        return (
            <Form className={ Styles.loginForm } onSubmit={ this._submit }>
                <DecoratedInput
                    formItem
                    label='Имя пользователя'
                    field='login'
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [{ required: true, message: 'Login is required!' }] }
                    placeholder='Введите имя пользователя'
                />
                <DecoratedInput
                    formItem
                    label='Пароль'
                    field='password'
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [{ required: true, message: 'Password is required!' }] }
                    placeholder='Введите имя пользователя'
                    type='password'
                />
                <Button type='primary' htmlType='submit'>
                    <FormattedMessage id='enter' />
                </Button>
            </Form>
        );
    }
}
