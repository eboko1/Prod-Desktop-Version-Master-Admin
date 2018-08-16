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
import { withReduxForm } from 'utils';

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

        const options = {
            ACCESS_ORDER_BODY: this.props.intl.formatMessage({
                id: 'role-container.access_order_body',
            }),
            ACCESS_ORDER_CALLS: this.props.intl.formatMessage({
                id: 'role-container.access_order_calls',
            }),
            ACCESS_ORDER_COMMENTS: this.props.intl.formatMessage({
                id: 'role-container.access_order_comments',
            }),
            ACCESS_ORDER_DETAILS: this.props.intl.formatMessage({
                id: 'role-container.access_order_details',
            }),
            ACCESS_ORDER_HISTORY: this.props.intl.formatMessage({
                id: 'role-container.access_order_history',
            }),
            ACCESS_ORDER_SERVICES: this.props.intl.formatMessage({
                id: 'role-container.access_order_services',
            }),
            ACCESS_ORDER_STATUS: this.props.intl.formatMessage({
                id: 'role-container.access_order_status',
            }),
            ACCESS_ORDER_TASKS: this.props.intl.formatMessage({
                id: 'role-container.access_order_tasks',
            }),
            CREATE_INVITE_ORDER: this.props.intl.formatMessage({
                id: 'role-container.create_invite_order',
            }),
            CREATE_ORDER: this.props.intl.formatMessage({
                id: 'role-container.create_order',
            }),
            PRINT_ORDERS: this.props.intl.formatMessage({
                id: 'role-container.print_orders',
            }),
            SHOW_FILTERS: this.props.intl.formatMessage({
                id: 'role-container.show_filters',
            }),
            SHOW_ORDERS: this.props.intl.formatMessage({
                id: 'role-container.show_orders',
            }),
            UPDATE_SUCCESS_ORDER: this.props.intl.formatMessage({
                id: 'role-container.update_success_order',
            }),
        };

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
                    getPopupContainer={ trigger =>
                        trigger.parentNode
                    }
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
                    { _.toPairs(options).map(([ key, value ]) => (
                        <Option value={ key } key={ key }>
                            { value }
                        </Option>
                    )) }
                </DecoratedSelect>
                <DecoratedCheckbox
                    initValue={ false }
                    field={ 'grantOther' }
                    formItem
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'add-role-form.grant_other_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='add-role-form.grant_other_field' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <Button
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
