// vendor
import React, { Component } from 'react';
import { Form } from 'antd';

// proj
import { onChangeMobileRecordForm } from 'core/forms/mobileRecordForm/duck';
import { withReduxForm } from 'utils';

@withReduxForm({
    name:    'mobileRecordForm',
    actions: {
        change: onChangeMobileRecordForm,
    },
})
export class MobileRecordForm extends Component {
    render() {
        return <Form>mobileRecordForm</Form>;
    }
}
