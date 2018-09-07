//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button, Select } from 'antd';

// proj
import { onChangeClientRequisiteForm } from 'core/forms/editClientRequisiteForm/duck';

import {
    DecoratedInput,
    DecoratedCheckbox,
} from 'forms/DecoratedFields';
import { withReduxForm } from 'utils';

// own
import Styles from './styles.m.css';

@injectIntl
@withReduxForm({
    name:    'clientRequisiteForm',
    actions: {
        change: onChangeClientRequisiteForm,
    },
})
export class RequisiteForm extends Component {
    render() {
        const {
            requisite,
            updateRequisite,
        } = this.props;
        const { getFieldDecorator, validateFields } = this.props.form;


        return (
            <Form>
                <DecoratedCheckbox
                    field={ 'enabled' }
                    initValue={ !!requisite.enabled }
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
                    initialValue={ requisite.name }
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
                    initialValue={ requisite.address }
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
                    initialValue={ requisite.bank }
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
                    initialValue={ requisite.ifi }
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
                    initialValue={ requisite.ca }
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
                    initialValue={ requisite.itn }
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
                                !err && updateRequisite(requisite.id, values),
                        )
                    }
                >
                    <FormattedMessage id='edit_requisite_form.edit' />
                </Button>
            </Form>
        );
    }
}
