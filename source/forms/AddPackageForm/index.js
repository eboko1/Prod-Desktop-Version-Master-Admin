//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button, Select } from 'antd';
import _ from 'lodash';

// proj
import { onChangePackageForm } from 'core/forms/addPackageForm/duck';

import { DecoratedInput, DecoratedSelect } from 'forms/DecoratedFields';
import {
    withReduxForm,
    getPermissionsLabels,
    groupedPermissions,
    getGroupsLabels,
} from 'utils';

const OptGroup = Select.OptGroup;
const Option = Select.Option;

@injectIntl
@withReduxForm({
    name:    'addPackageForm',
    actions: {
        change: onChangePackageForm,
    },
})
export class AddPackageForm extends Component {
    render() {
        const { roles = [] } = this.props;
        const { getFieldDecorator, validateFields } = this.props.form;
        const groupsLabels = getGroupsLabels(this.props.intl);
        const permissionsLabels = getPermissionsLabels(this.props.intl);

        return (
            <Form layout={ 'horizontal' }>
                <DecoratedInput
                    field={ 'name' }
                    formItem
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
                        <FormattedMessage id='add-package-form.name_field' />
                    }
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
                                id: 'required_field',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={
                        <FormattedMessage id='add-package-form.grants_field' />
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
                    label={ <FormattedMessage id='add-package-form.roles_field' /> }
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
                    onClick={ () =>
                        validateFields(
                            (err, values) =>
                                !err && this.props.createPackage(values),
                        )
                    }
                >
                    <FormattedMessage id='add-package-form.create' />
                </Button>
            </Form>
        );
    }
}
