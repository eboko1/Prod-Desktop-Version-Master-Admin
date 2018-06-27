// vendor
import React, { Component } from 'react';
import { formShape } from 'rc-form';
import PropTypes from 'prop-types';
import { Button, Form } from 'antd';

// proj
import Styles from './styles';
import { withReduxForm } from 'utils';

// own
import { DecoratedInput } from './DecoratedInput';

@withReduxForm
export default class AntReduxForm extends Component {
    static defaultProps = {
        test: true,
    };

    static propTypes = {
        form: formShape,
    };

    _handleSubmit = event => {
        const { form } = this.props;
        event.preventDefault();

        form.validateFields((err, values) => {
            !err && this.props.actions.login(values);
        });
    };

    render() {
        const {
            form: { getFieldsError, getFieldDecorator },
            authenticationFetching = false, // это булеввый флаг из редакс, true – когда загрузка, false – когда не загрузка
        } = this.props;

        // const config = {
        //     rules: [
        //         {
        //             type:     'object',
        //             required: true,
        //             message:  'Please select time!',
        //         },
        //     ],
        // };

        // const buttonDisabled =
        //     hasErrors(getFieldsError()) || authenticationFetching;
        console.log('INDEX_PROPS', this.props);

        return (
            <div className={ Styles.form }>
                <Form layout='vertical' onSubmit={ this._handleSubmit }>
                    <Form.Item>
                        <DecoratedInput
                            icon
                            iconType='user'
                            type='email'
                            placeholder='Почта'
                            getFieldDecorator={ getFieldDecorator }
                            disabled={ authenticationFetching }
                            rules={ [
                                {
                                    required: true,
                                    message:  'Нужно ввести почту.',
                                },
                            ] }
                        />
                    </Form.Item>
                    <Form.Item>
                        <DecoratedInput
                            icon
                            iconType='lock'
                            type='password'
                            placeholder='Пароль'
                            getFieldDecorator={ getFieldDecorator }
                            disabled={ authenticationFetching }
                            rules={ [
                                {
                                    required: true,
                                    message:  'Нужно ввести пароль.',
                                },
                                // {
                                //     validator: this.validatePass,
                                // },
                            ] }
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
