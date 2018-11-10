//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button, Select } from 'antd';
import _ from 'lodash';

// proj
import { onChangePackageForm } from 'core/forms/editPackageForm/duck';

import { DecoratedInput, DecoratedSelect } from 'forms/DecoratedFields';
import {
    withReduxForm,
    getPermissionsLabels,
    groupedPermissions,
    getGroupsLabels,
    permissions,
} from 'utils';

const OptGroup = Select.OptGroup;
const Option = Select.Option;

@injectIntl
@withReduxForm({
    name:    'packageForm',
    actions: {
        change: onChangePackageForm,
    },
})
export class PackageForm extends Component {
    render() {
        const { editPackageId, initPackageName, updatePackage, initPackage, roles } = this.props;
        const { getFieldDecorator } = this.props.form;

        const packageGrants = _.intersection(initPackage.grants, _.values(permissions));
        const groupsLabels = getGroupsLabels(this.props.intl);
        const permissionsLabels = getPermissionsLabels(this.props.intl);
        const roleIds = _.map(initPackage.roles, 'roleId');

        return (
            <Form layout={ 'horizontal' }>
                <DecoratedInput
                    initialValue={ initPackageName }
                    field={ 'name' }
                    formItem
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'edit-package-form.name_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={
                        <FormattedMessage id='edit-package-form.name_field' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedSelect
                    field={ 'grants' }
                    initialValue={ packageGrants }
                    formItem
                    getPopupContainer={ trigger => trigger.parentNode }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={
                        <FormattedMessage id='edit-package-form.grants_field' />
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
                <DecoratedSelect
                    field={ 'roles' }
                    initialValue={ roleIds }
                    formItem
                    getPopupContainer={ trigger => trigger.parentNode }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='edit-package-form.roles_field' /> }
                    mode={ 'multiple' }
                    getFieldDecorator={ getFieldDecorator }
                >
                    { roles.map(({ name, roleId }) => (
                        <Option value={ roleId } key={ roleId }>
                            { name }
                        </Option>
                    )) }
                </DecoratedSelect>
                <Button
                    style={ { width: '100%' } }
                    onClick={ () => {
                        this.props.form.validateFields((err, values) => {
                            if (!err) {
                                updatePackage(editPackageId, values);
                            }
                        });
                    } }
                >
                    <FormattedMessage id='edit-package-form.edit' />
                </Button>
            </Form>
        );
    }
}
