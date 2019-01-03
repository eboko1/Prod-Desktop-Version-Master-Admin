// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Select, Button } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
import { createCashbox } from 'core/cash/duck';
import { DecoratedInput, DecoratedSelect } from 'forms/DecoratedFields';

// own
import { cashboxTypes } from './config';
const Option = Select.Option;

@injectIntl
@Form.create()
@connect(
    null,
    { createCashbox },
)
export class CashCreationForm extends Component {
    _submit = e => {
        e.preventDefault();
        const { form, createCashbox } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                createCashbox(values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form layout='horizontal' onSubmit={ this._submit }>
                <DecoratedInput
                    field='name'
                    formItem
                    rules={ [
                        {
                            required: true,
                            message:  this.props.intl.formatMessage({
                                id: 'cash-creation-form.name.validation',
                            }),
                        },
                    ] }
                    hasFeedback
                    label={ <FormattedMessage id='cash-creation-form.name' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedSelect
                    field='type'
                    formItem
                    label={ <FormattedMessage id='cash-creation-form.type' /> }
                    getFieldDecorator={ getFieldDecorator }
                    initialValue={ cashboxTypes.CASH }
                >
                    { Object.values(cashboxTypes).map(item => (
                        <Option value={ item } key={ item }>
                            <FormattedMessage
                                id={ `cash-creation-form.type-${item}` }
                            />
                        </Option>
                    )) }
                </DecoratedSelect>
                <DecoratedInput
                    field='description'
                    formItem
                    label={ <FormattedMessage id='cash-creation-form.comment' /> }
                    getFieldDecorator={ getFieldDecorator }
                />
                <Form.Item>
                    <Button
                        type='primary'
                        htmlType='submit'
                        style={ { margin: '0 auto' } }
                    >
                        <FormattedMessage id='create' />
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}
