//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button, Select } from 'antd';
import _ from 'lodash';

const Option = Select.Option;
// proj
import { onChangeBusinessPackageForm } from 'core/forms/addBusinessPackageForm/duck';

import {
    DecoratedDatePicker,
    DecoratedSelect,
    DecoratedTextArea,
    DecoratedInputNumber,
} from 'forms/DecoratedFields';
import { withReduxForm } from 'utils';

// own
import Styles from './styles.m.css';

@injectIntl
@withReduxForm({
    name:    'addBusinessPackageForm',
    actions: {
        change: onChangeBusinessPackageForm,
    },
})
export class AddBusinessPackageForm extends Component {
    render() {
        const { getFieldDecorator, validateFields } = this.props.form;
        const { businessId, businessName } = this.props;
        const { formatMessage } = this.props.intl;

        return (
            <Form layout={ 'horizontal' }>
                <FormattedMessage id='add-business-package-form.business' />:{ ' ' }
                <b>{ businessName }</b>
                <br />
                <DecoratedSelect
                    formItem
                    getPopupContainer={ trigger => trigger.parentNode }
                    getFieldDecorator={ getFieldDecorator }
                    label={
                        <FormattedMessage id='add-business-package-form.package' />
                    }
                    hasFeedback
                    field='packageId'
                    optionFilterProp='children'
                    allowClear
                    filterOption={ (input, option) =>
                        Boolean(
                            option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase() !== -1),
                        )
                    }
                    showSearch
                >
                    { this.props.rolesPackages.map(({ id, name }) => (
                        <Option key={ id } value={ id }>
                            { name }
                        </Option>
                    )) }
                </DecoratedSelect>
                <DecoratedDatePicker
                    field={ 'activationDatetime' }
                    formItem
                    showTime
                    format='YYYY-MM-DD HH:mm:ss'
                    getCalendarContainer={ trigger => trigger.parentNode }
                    formatMessage={ formatMessage }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id:
                                    'add-business-package-form.activation_datetime_error',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={
                        <FormattedMessage id='add-business-package-form.activation_datetime' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedDatePicker
                    field={ 'expirationDatetime' }
                    formItem
                    showTime
                    format='YYYY-MM-DD HH:mm:ss'
                    getCalendarContainer={ trigger => trigger.parentNode }
                    formatMessage={ formatMessage }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id:
                                    'add-business-package-form.expiration_datetime_error',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={
                        <FormattedMessage id='add-business-package-form.expiration_datetime' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedTextArea
                    field='comment'
                    formItem
                    rules={ [
                        {
                            max:     2000,
                            message: formatMessage({
                                id: 'field_should_be_below_2000_chars',
                            }),
                        },
                    ] }
                    getPopupContainer={ trigger => trigger.parentNode }
                    label={
                        <FormattedMessage id='add-business-package-form.comment' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInputNumber
                    field='amount'
                    formItem
                    style={ { width: '100%' } }
                    getPopupContainer={ trigger => trigger.parentNode }
                    label={
                        <FormattedMessage id='add-business-package-form.amount' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                />
                <Button
                    style={ { width: '100%' } }
                    onClick={ () =>
                        validateFields(
                            (err, values) =>
                                !err &&
                                this.props.createBusinessPackage(
                                    businessId,
                                    values.packageId,
                                    _.omit(values, [ 'packageId' ]),
                                ),
                        )
                    }
                >
                    <FormattedMessage id='add-business-package-form.create' />
                </Button>
            </Form>
        );
    }
}
