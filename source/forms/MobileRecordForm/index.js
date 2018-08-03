// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button, Slider } from 'antd';

// proj
import { onChangeMobileRecordForm } from 'core/forms/mobileRecordForm/duck';

import {
    DecoratedInput,
    DecoratedSelect,
    DecoratedTextArea,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';

import { withReduxForm } from 'utils';

@injectIntl
@withReduxForm({
    name:    'mobileRecordForm',
    actions: {
        change: onChangeMobileRecordForm,
    },
})
export class MobileRecordForm extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        return (
            <Form>
                <div>order num</div>
                <DecoratedInput
                    field='client'
                    formItem
                    label='client'
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInput
                    field='phone'
                    formItem
                    label='phone'
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedSelect
                    field='vehicle'
                    formItem
                    label='vehicle'
                    getFieldDecorator={ getFieldDecorator }
                    options={ [ 1, 2, 3 ] }
                />
                <hr />
                <div>Записать на:</div>
                <DecoratedSelect
                    field='station'
                    formItem
                    label='station'
                    getFieldDecorator={ getFieldDecorator }
                    options={ [ 1, 2, 3 ] }
                />
                <DecoratedDatePicker
                    field='date'
                    formItem
                    getFieldDecorator={ getFieldDecorator }
                    formatMessage={ formatMessage }
                />
                <DecoratedSelect
                    field='time'
                    formItem
                    label='time'
                    getFieldDecorator={ getFieldDecorator }
                    options={ [ 1, 2, 3 ] }
                />
                <div>
                    <Slider
                        min={ 0.5 }
                        step={ 0.5 }
                        max={ 8 }
                        defaultValue={ 1 }
                        onChange={ value =>
                            console.log('→ duration slider value', value)
                        }
                    />
                </div>
                <DecoratedTextArea
                    formItem
                    field='comment'
                    lable='comment'
                    getFieldDecorator={ getFieldDecorator }
                />
                <div>
                    <Button type='primary'>OK</Button>
                    <Button>Cancel</Button>
                </div>
            </Form>
        );
    }
}
