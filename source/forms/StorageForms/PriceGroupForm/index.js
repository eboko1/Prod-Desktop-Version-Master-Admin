// vendor
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Form, Button } from 'antd';
import styled from 'styled-components';

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
    const _submit = event => {
        event.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                props.createPriceGroup(values);
                props.form.resetFields();
            }
        });
    };

    return (
        <StyledForm onSubmit={ _submit }>
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
            />
            <Button type='primary' htmlType='submit'>
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
