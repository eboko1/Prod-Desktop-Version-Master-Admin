// vendor
import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';

// proj
import { onChangeLoginForm, login } from 'core/forms/loginForm/duck';

import { DecoratedInput } from 'forms/DecoratedFields';
import { withReduxForm } from 'utils';

// own
import Styles from './loginForm.m.css';
const FormItem = Form.Item;
const { create } = Form;

// @create({
//     onFieldsChange(props, changedFields) {
//         props.onChange(changedFields);
//     },
//     mapPropsToFields(props) {
//         console.log('props', props);
//
//         return {
//             login: Form.createFormField({
//                 ...props.fields.login,
//                 value: props.fields.login.value,
//             }),
//             password: Form.createFormField({
//                 ...props.fields.password,
//                 value: props.fields.password.value,
//             }),
//             // type: Form.createFormField({
//             //     ...props.fields.type,
//             //     value: props.fields.type.value,
//             // }),
//         };
//     },
//     onValuesChange(_, values) {
//         console.log(values); // eslint-disable-line
//     },
// })
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
        // console.log('→ props', this.props);

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
                    Войти
                </Button>
            </Form>
        );
    }
}
