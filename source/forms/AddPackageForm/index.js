//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button } from 'antd';

// proj
import { onChangePackageForm } from 'core/forms/addPackageForm/duck';

import { DecoratedInput } from 'forms/DecoratedFields';
import { withReduxForm } from 'utils';

@injectIntl
@withReduxForm({
    name:    'addPackageForm',
    actions: {
        change: onChangePackageForm,
    },
})
export class AddPackageForm extends Component {
    render() {
        const { getFieldDecorator, validateFields } = this.props.form;

        return (
            <Form layout={ 'horizontal' }>
                <DecoratedInput
                    field={ 'name' }
                    formItem
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'add-package-form.name_field_required',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={
                        <FormattedMessage id='add-package-form.name_field' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                />
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
