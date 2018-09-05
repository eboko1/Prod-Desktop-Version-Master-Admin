// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Select, Button } from 'antd';

// proj
import {
    onChangeProfileForm,
    submitProfileForm,
} from 'core/forms/profileForm/duck';

import { DecoratedInput, DecoratedSelect } from 'forms/DecoratedFields';
import { withReduxForm2 } from 'utils';

//own
import Styles from './styles.m.css';
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xs:  { span: 24 },
        sm:  { span: 24 },
        md:  { span: 24 },
        lg:  { span: 8 },
        xl:  { span: 8 },
        xxl: { span: 8 },
    },
    wrapperCol: {
        xs:  { span: 24 },
        sm:  { span: 24 },
        md:  { span: 24 },
        lg:  { span: 8 },
        xl:  { span: 8 },
        xxl: { span: 8 },
    },
    colon: false,
};

@injectIntl
@withReduxForm2({
    name:            'profileForm',
    actions:         { change: onChangeProfileForm, submitProfileForm },
    mapStateToProps: state => ({
        user:            state.auth,
        profileUpdating: state.ui.profileUpdating,
    }),
})
export class ProfileForm extends Component {
    _submitProfile = () => {
        const { form, submitProfileForm } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                submitProfileForm(values);
            }
        });
    };

    render() {
        const {
            user,
            form: { getFieldDecorator },
            intl: { formatMessage },
        } = this.props;

        return (
            <Form className={ Styles.profileForm }>
                <DecoratedInput
                    field='name'
                    formItem
                    getFieldDecorator={ getFieldDecorator }
                    formItemLayout={ formItemLayout }
                    label={ <FormattedMessage id='name' /> }
                    placeholder={ formatMessage({
                        id: 'profile-form.name.placeholder',
                    }) }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'profile-form.please_enter_your_name',
                            }),
                        },
                    ] }
                    initialValue={ user.name }
                />
                <DecoratedInput
                    field='surname'
                    formItem
                    getFieldDecorator={ getFieldDecorator }
                    formItemLayout={ formItemLayout }
                    label={ <FormattedMessage id='surname' /> }
                    rules={ [
                        {
                            required: true,
                            message:  'profile-form.please_enter_your_surname',
                        },
                    ] }
                    placeholder={ formatMessage({
                        id: 'profile-form.surname.placeholder',
                    }) }
                    initialValue={ user.surname }
                />
                <DecoratedSelect
                    field='language'
                    formItem
                    formItemLayout={ formItemLayout }
                    getFieldDecorator={ getFieldDecorator }
                    label={ <FormattedMessage id='profile-form.language' /> }
                    hasFeedback
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'profile-form.please_select_your_language',
                            }),
                        },
                    ] }
                    placeholder={ formatMessage({
                        id: 'profile-form.language.placeholder',
                    }) }
                    initialValue={ user.language }
                >
                    <Option value='en'>English</Option>
                    { /* ua should be uk (BE legacy) */ }
                    <Option value='ua'>Українська</Option>
                    <Option value='ru'>Русский</Option>
                </DecoratedSelect>
                <Button
                    type='primary'
                    className={ Styles.saveBtn }
                    onClick={ () => this._submitProfile() }
                >
                    <FormattedMessage id='save' />
                </Button>
            </Form>
        );
    }
}
