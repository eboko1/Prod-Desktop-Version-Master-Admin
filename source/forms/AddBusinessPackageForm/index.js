//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button } from 'antd';

// proj
import { onChangeBusinessPackageForm } from 'core/forms/addBusinessPackageForm/duck';

import { DecoratedDatePicker } from 'forms/DecoratedFields';
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
        const { businessId, packageId, packageName, businessName } = this.props;
        const { formatMessage } = this.props.intl;

        return (
            <Form layout={ 'horizontal' }>
                <FormattedMessage id='add-business-package-form.business' />: <b>{ businessName }</b>
                <br />
                <FormattedMessage id='add-business-package-form.package' />: <b>{ packageName }</b>
                <br />
                <DecoratedDatePicker
                    field={ 'activationDatetime' }
                    formItem
                    showTime
                    format='YYYY-MM-DD HH:mm:ss'
                    getCalendarContainer={ trigger =>
                        trigger.parentNode
                    }
                    formatMessage={ formatMessage }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'add-business-package-form.activation_datetime_error',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='add-business-package-form.activation_datetime' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedDatePicker
                    field={ 'expirationDatetime' }
                    formItem
                    showTime
                    format='YYYY-MM-DD HH:mm:ss'
                    getCalendarContainer={ trigger =>
                        trigger.parentNode
                    }
                    formatMessage={ formatMessage }
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'add-business-package-form.activation_datetime_error',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='add-business-package-form.activation_datetime' /> }
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
                                    packageId,
                                    values,
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
