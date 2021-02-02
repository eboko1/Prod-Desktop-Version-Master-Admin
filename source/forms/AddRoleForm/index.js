//vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Button, Select } from "antd";
import _ from "lodash";

// proj
import { onChangeRoleForm } from "core/forms/addRoleForm/duck";

import {
    DecoratedInput,
    DecoratedSelect,
    DecoratedCheckbox,
} from "forms/DecoratedFields";
import {
    withReduxForm,
    getPermissionsLabels,
    groupedPermissions,
    getGroupsLabels,
} from "utils";

// own
const OptGroup = Select.OptGroup;
const Option = Select.Option;

@injectIntl
@withReduxForm({
    name: "addRoleForm",
    actions: {
        change: onChangeRoleForm,
    },
})
export class AddRoleForm extends Component {
    render() {
        const { getFieldDecorator, validateFields } = this.props.form;
        const groupsLabels = getGroupsLabels(this.props.intl);
        const permissionsLabels = getPermissionsLabels(this.props.intl);

        return (
            <Form>
                <DecoratedInput
                    field={"name"}
                    formItem
                    rules={[
                        {
                            required: true,
                            message: this.props.intl.formatMessage({
                                id: "add-role-form.name_field_required",
                            }),
                        },
                    ]}
                    hasFeedback
                    label={<FormattedMessage id="add-role-form.name_field" />}
                    getFieldDecorator={getFieldDecorator}
                />
                <DecoratedSelect
                    field={"grants"}
                    formItem
                    getPopupContainer={trigger => trigger.parentNode}
                    rules={[
                        {
                            required: true,
                            message: this.props.intl.formatMessage({
                                id: "add-role-form.grants_field_required",
                            }),
                        },
                    ]}
                    hasFeedback
                    label={<FormattedMessage id="add-role-form.grants_field" />}
                    mode={"multiple"}
                    getFieldDecorator={getFieldDecorator}
                    filterOption={(input, option)=>{
                        return option.props.children &&
                              String(option.props.children)
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                    }}
                >
                    {_.toPairs(groupedPermissions).map(([name, value]) => (
                        <OptGroup label={groupsLabels[name]}>
                            {value.map(value => (
                                <Option value={value} key={value}>
                                    {permissionsLabels[value]}
                                </Option>
                            ))}
                        </OptGroup>
                    ))}
                </DecoratedSelect>
                <DecoratedCheckbox
                    initialValue={false}
                    field={"grantOther"}
                    formItem
                    colon={false}
                    label={
                        <FormattedMessage id="add-role-form.grant_other_field" />
                    }
                    getFieldDecorator={getFieldDecorator}
                    formItemLayout={{
                        labelCol: { span: 14 },
                        wrapperCol: { span: 6 },
                    }}
                />
                <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={() =>
                        validateFields(
                            (err, values) =>
                                !err && this.props.createRole(values),
                        )
                    }
                >
                    <FormattedMessage id="add-role-form.create" />
                </Button>
            </Form>
        );
    }
}
