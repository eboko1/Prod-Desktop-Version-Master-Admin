// vendor
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'antd';
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
export class ForgotPassword extends Component {
    state = {
        noLogin:  false,
        goToMail: false,
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
        console.log('→ this.props', getFieldValue('login'));
        try {
            console.log('→ preCall');

            fetchAPI(
                'POST',
                '/password/reset/request',
                null,
                {
                    login: getFieldValue('login'),
                },
                { handleErrorInternally: true },
            );
            console.log('→ postCall');
        } catch (error) {
            console.error('error!', error); // eslint-disable line
            (function() {
                console.log('→ ERROR', error);
                message.error('This is a message of error');
            }());
            this.setState({ noLogin: true });
        } finally {
            console.log('→ finally');
            this.setState({ goToMail: true });
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        const { noLogin, goToMail } = this.state;

        return (
            <Form className={ Styles.loginForm } onSubmit={ this._submit }>
                { !noLogin || !goToMail ? 
                    <>
                        <DecoratedInput
                            formItem
                            label={ <FormattedMessage id='login_form.login' /> }
                            field='login'
                            getFieldDecorator={ getFieldDecorator }
                            rules={ [
                                {
                                    required: true,
                                    message:  formatMessage({
                                        id: 'login_form.login_is_required',
                                    }),
                                },
                            ] }
                            placeholder={ formatMessage({
                                id: 'login_form.enter_login',
                            }) }
                        />
                        <Button type='primary' htmlType='submit'>
                            <FormattedMessage id='submit' />
                        </Button>
                    </>
                    : null }
                { noLogin && <div>noLogin</div> }
                { goToMail && <div>goToMail</div> }
            </Form>
        );
    }
}

export const ForgotPasswordForm = Form.create()(ForgotPassword);
