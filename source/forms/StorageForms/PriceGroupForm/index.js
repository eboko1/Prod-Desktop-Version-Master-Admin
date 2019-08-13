// vendor
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Form, Button } from 'antd';
import styled from 'styled-components';
import schema from 'async-validator';

// proj
import { createPriceGroup } from 'core/storage/priceGroups';
import { DecoratedInputNumber } from 'forms/DecoratedFields';

const StyledInput = styled(DecoratedInputNumber)`
    & .ant-input-number {
        width: 240px;
    }

    &.ant-form-item {
        margin-bottom: 0;
        margin-right: 24px;
    }
`;

const StyledForm = styled(Form)`
    display: flex;
    align-items: center;
`;

const PriceGroup = props => {
    const _submit = () => {
        props.form.validateFields((err, values) => {
            if (!err) {
                props.createPriceGroup(values);
                props.form.resetFields();
            }
        });
    };

    const descriptor = {
        name: {
            type:      'number',
            required:  true,
            validator: (rule, value) => !value.match(/[a-zA-Z]+/),
        },
    };

    const _handleErrors = (errors, fields) =>
        console.error('_handleErrors(errors, fields)', errors, fields);

    const validator = new schema(descriptor);

    validator.validate({ name: 'multiplier' }, (errors, fields) => {
        if (errors) {
            // validation failed, errors is an array of all errors
            // fields is an object keyed by field name with an array of
            // errors per field
            return _handleErrors(errors, fields);
        }
        // validation passed
    });

    return (
        <StyledForm>
            <StyledInput
                fields={ {} }
                field='multiplier'
                formItem
                getFieldDecorator={ props.form.getFieldDecorator }
                min={ 0.1 }
                placeholder={ props.intl.formatMessage({ id: 'storage.markup' }) }
                rules={ [
                    {
                        required: true,
                        message:  props.intl.formatMessage({
                            id: 'required_field',
                        }),
                    },
                ] }
                onPressEnter={ () => _submit() }
            />
            <Button type='primary' onClick={ () => _submit() }>
                { props.intl.formatMessage({ id: 'create' }) }
            </Button>
        </StyledForm>
    );
};

export const PriceGroupForm = injectIntl(
    connect(
        null,
        { createPriceGroup },
    )(Form.create()(PriceGroup)),
);
