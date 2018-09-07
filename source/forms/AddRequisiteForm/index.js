//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button, Select } from 'antd';
import _ from 'lodash';

// proj
import { onChangeClientRequisiteForm } from 'core/forms/addClientRequisiteForm/duck';

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
    name:    'addClientRequisiteForm',
    actions: {
        change: onChangeClientRequisiteForm,
    },
})
export class AddRequisiteForm extends Component {
    render() {
        const {
            createRequisite,
        } = this.props;
        const { getFieldDecorator, validateFields } = this.props.form;

        return (
            <Form>
                <DecoratedCheckbox
                    field={ 'enabled' }
                    formItem
                    label={
                        <FormattedMessage id='edit_requisite_form.enabled' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                    colon={ false }
                    formItemLayout={ {
                        labelCol:   { span: 14 },
                        wrapperCol: { span: 6 },
                    } }
                />
                <DecoratedInput
                    field={ 'name' }
                    formItem
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'edit_requisite_form.name_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='edit_requisite_form.name_field' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInput
                    field={ 'address' }
                    formItem
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'edit_requisite_form.address_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='edit_requisite_form.address_field' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInput
                    field={ 'bank' }
                    formItem
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'edit_requisite_form.bank_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='edit_requisite_form.bank_field' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInput
                    field={ 'ifi' }
                    formItem
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'edit_requisite_form.ifi_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='edit_requisite_form.ifi_field' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInput
                    field={ 'ca' }
                    formItem
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'edit_requisite_form.ca_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='edit_requisite_form.ca_field' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInput
                    field={ 'itn' }
                    formItem
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'edit_requisite_form.itn_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='edit_requisite_form.itn_field' /> }
                    getFieldDecorator={ getFieldDecorator }
                />

                <Button
                    type='primary'
                    style={ { width: '100%' } }
                    onClick={ () =>
                        validateFields(
                            (err, values) =>
                                !err && createRequisite(values),
                        )
                    }
                >
                    <FormattedMessage id='edit_requisite_form.create' />
                </Button>
            </Form>
        );
    }
}
