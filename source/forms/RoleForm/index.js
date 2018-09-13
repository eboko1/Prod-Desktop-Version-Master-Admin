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
import {
    withReduxForm,
    getPermissionsLabels,
    groupedPermissions,
    getGroupsLabels,
    permissions,
} from 'utils';

// own
import Styles from './styles.m.css';

const OptGroup = Select.OptGroup;
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
        const roleGrants = _.intersection(role.grants, _.values(permissions));
        const { getFieldDecorator, validateFields } = this.props.form;
        const groupsLabels = getGroupsLabels(this.props.intl);
        const permissionsLabels = getPermissionsLabels(this.props.intl);

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
                    initialValue={ roleGrants }
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
                    { _.toPairs(groupedPermissions).map(([ name, value ]) => (
                        <OptGroup label={ groupsLabels[ name ] }>
                            { value.map(value => (
                                <Option value={ value } key={ value }>
                                    { permissionsLabels[ value ] }
                                </Option>
                            )) }
                        </OptGroup>
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
