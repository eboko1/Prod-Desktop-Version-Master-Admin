//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button, Select } from 'antd';
import _ from 'lodash';

// proj
import { onChangeRoleForm } from 'core/forms/addRoleForm/duck';

import {
    DecoratedInput,
    DecoratedSelect,
    DecoratedCheckbox,
} from 'forms/DecoratedFields';
import { withReduxForm, rolesOptionValues } from 'utils';

// own
import Styles from './styles.m.css';

const Option = Select.Option;

@injectIntl
@withReduxForm({
    name:    'addRoleForm',
    actions: {
        change: onChangeRoleForm,
    },
})
export class AddRoleForm extends Component {
    render() {
        const { getFieldDecorator, validateFields } = this.props.form;

        return (
            <Form>
                <DecoratedInput
                    field={ 'name' }
                    formItem
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'add-role-form.name_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='add-role-form.name_field' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedSelect
                    field={ 'grants' }
                    formItem
                    getPopupContainer={ trigger => trigger.parentNode }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'add-role-form.grants_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='add-role-form.grants_field' /> }
                    mode={ 'multiple' }
                    getFieldDecorator={ getFieldDecorator }
                >
                    { _.toPairs(rolesOptionValues(this.props.intl)).map(([ key, value ]) => (
                        <Option value={ key } key={ key }>
                            { value }
                        </Option>
                    )) }
                </DecoratedSelect>
                <DecoratedCheckbox
                    initValue={ false }
                    field={ 'grantOther' }
                    formItem
                    colon={ false }
                    label={
                        <FormattedMessage id='add-role-form.grant_other_field' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                    formItemLayout={ {
                        labelCol:   { span: 14 },
                        wrapperCol: { span: 6 },
                    } }
                />
                <Button
                    type='primary'
                    style={ { width: '100%' } }
                    onClick={ () =>
                        validateFields(
                            (err, values) =>
                                !err && this.props.createRole(values),
                        )
                    }
                >
                    <FormattedMessage id='add-role-form.create' />
                </Button>
            </Form>
        );
    }
}
