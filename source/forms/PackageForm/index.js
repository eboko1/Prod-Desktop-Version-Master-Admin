//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button } from 'antd';

// proj
import { onChangePackageForm } from 'core/forms/editPackageForm/duck';

import { DecoratedInput } from 'forms/DecoratedFields';
import { withReduxForm } from 'utils';

@injectIntl
@withReduxForm({
    name:    'packageForm',
    actions: {
        change: onChangePackageForm,
    },
})
export class PackageForm extends Component {
    render() {
        const { editPackageId, initPackageName, updatePackage } = this.props;
        const { getFieldDecorator } = this.props.form;

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
