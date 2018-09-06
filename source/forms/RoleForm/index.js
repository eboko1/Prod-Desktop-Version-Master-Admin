//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button, Select } from 'antd';
import _ from 'lodash';

// proj
import { onChangeRoleForm } from 'core/forms/editRoleForm/duck';

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
    name:    'roleForm',
    actions: {
        change: onChangeRoleForm,
    },
})
export class RoleForm extends Component {
    render() {
        const { role } = this.props;
        const { getFieldDecorator, validateFields } = this.props.form;

        return (
            <Form>
                <DecoratedInput
                    field={ 'name' }
                    formItem
                    initialValue={ role.name }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'edit-role-form.name_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='edit-role-form.name_field' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedSelect
                    field={ 'grants' }
                    initialValue={ role.grants }
                    formItem
                    getPopupContainer={ trigger => trigger.parentNode }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'edit-role-form.grants_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={
                        <FormattedMessage id='edit-role-form.grants_field' />
                    }
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
                    field={ 'grantOther' }
                    initValue={ !!role.grantOther }
                    formItem
                    label={
                        <FormattedMessage id='edit-role-form.grant_other_field' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                    colon={ false }
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
                                !err && this.props.updateRole(role.id, values),
                        )
                    }
                >
                    <FormattedMessage id='edit-role-form.edit' />
                </Button>
            </Form>
        );
    }
}
