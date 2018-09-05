//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button, Select } from 'antd';
import _ from 'lodash';

// proj
import { onChangeManagerRoleForm } from 'core/forms/managerRoleForm/duck';

import { DecoratedSelect } from 'forms/DecoratedFields';
import { withReduxForm } from 'utils';

// own
const Option = Select.Option;

@injectIntl
@withReduxForm({
    name:    'managerRoleForm',
    actions: {
        change: onChangeManagerRoleForm,
    },
})
export class ManagerRoleForm extends Component {
    render() {
        const { getFieldDecorator, validateFields } = this.props.form;
        const {
            managerRole: { roles, availableRoles, managerId, businessId } = {},
        } = this.props;

        return (
            <Form>
                <DecoratedSelect
                    field={ 'roleIds' }
                    initialValue={ _.map(roles, 'roleId') }
                    formItem
                    getPopupContainer={ trigger => trigger.parentNode }
                    hasFeedback
                    label={
                        <FormattedMessage id='manager-role-form.roles_field' />
                    }
                    mode={ 'multiple' }
                    getFieldDecorator={ getFieldDecorator }
                >
                    { availableRoles.map(({ roleId, roleName }) => (
                        <Option value={ roleId } key={ roleId }>
                            { roleName }
                        </Option>
                    )) }
                </DecoratedSelect>
                <Button
                    style={ { width: '100%' } }
                    onClick={ () =>
                        validateFields(
                            (err, values) =>
                                !err &&
                                this.props.updateManagerRole(
                                    managerId,
                                    values.roleIds || [],
                                    businessId,
                                ),
                        )
                    }
                >
                    <FormattedMessage id='manager-role-form.edit' />
                </Button>
            </Form>
        );
    }
}
