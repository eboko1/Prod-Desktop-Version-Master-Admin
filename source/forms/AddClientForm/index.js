// vendor
import React, { Component } from 'react';
import { Form, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';

// proj
import { onChangeAddClientForm } from 'core/forms/addClientForm/duck';

import { DecoratedSelect } from 'forms/DecoratedFields';

import { withReduxForm, getDaterange } from 'utils';

// own
// import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

@injectIntl
@withReduxForm({
    name:    'addClientForm',
    actions: {
        change: onChangeAddClientForm,
    },
})
export class AddClientForm extends Component {
    render() {
        const { handleAddClientModalSubmit, addClientFormData } = this.props;
        const { getFieldDecorator, getFieldsError } = this.props.form;
        const { formatMessage } = this.props.intl;

        const { years } = addClientFormData;

        return (
            <Form
                layout='vertical'
                onSubmit={ () => handleAddClientModalSubmit() }
            >
                <FormItem label='YEAR'>
                    { years && (
                        <DecoratedSelect
                            field='year'
                            showSearch
                            getFieldDecorator={ getFieldDecorator }
                            placeholder={ 'year' }
                            // optionFilterProp='children'
                            getPopupContainer={ trigger => trigger.parentNode }
                        >
                            { years.map(year => (
                                <Option value={ year } key={ v4() }>
                                    { year }
                                </Option>
                            )) }
                        </DecoratedSelect>
                    ) }
                </FormItem>
            </Form>
        );
    }
}
