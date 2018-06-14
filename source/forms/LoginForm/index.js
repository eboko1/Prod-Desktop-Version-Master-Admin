import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';

import Styles from './loginForm.m.css';

const FormItem = Form.Item;
const { create } = Form;

@create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        console.log('props', props);

        return {
            login: Form.createFormField({
                ...props.fields.login,
                value: props.fields.login.value,
            }),
            password: Form.createFormField({
                ...props.fields.password,
                value: props.fields.password.value,
            }),
            // type: Form.createFormField({
            //     ...props.fields.type,
            //     value: props.fields.type.value,
            // }),
        };
    },
    onValuesChange(_, values) {
        console.log(values); // eslint-disable-line
    },
})
export class LoginForm extends Component {
    _submit = event => {
        event.preventDefault();
        this.props.actions.login({
            login:    this.props.fields.login.value,
            password: this.props.fields.password.value,
            // type:     this.props.fields.type.value,
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { fields } = this.props;

        return (
            <Form
                className={ Styles.loginForm }
                onSubmit={ this._submit }
                { ...fields }
            >
                <FormItem label='Имя пользователя'>
                    { getFieldDecorator('login', {
                        rules: [{ required: true, message: 'Login is required!' }],
                    })(<Input placeholder='Введите имя пользователя' />) }
                </FormItem>
                <FormItem label='Пароль'>
                    { getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message:  'Password is required!',
                            },
                        ],
                    })(<Input placeholder='Введите пароль' type='password' />) }
                </FormItem>
                <Button type='primary' htmlType='submit'>
                    Войти
                </Button>
                { /* <pre className='language-bash'>
                    { JSON.stringify(fields, null, 2) }
                </pre> */ }
            </Form>
        );
    }
}
