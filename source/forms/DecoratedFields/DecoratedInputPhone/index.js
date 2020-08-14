// vendor
import React from 'react';
import { Input, Icon, Form } from 'antd';

// own
const FormItem = Form.Item;
const InputGroup = Input.Group;

export const DecoratedInputPhone = props => {
    const {
        //FormItem
        formItem,
        label,
        colon,
        className,
        hasFeedback,
        formItemLayout,
        getFieldDecorator,
        disabled,
        rules,
        type,
        placeholder,
        icon,
        iconType,
        field,
        initialValue,
        onChange,
    } = props;
    const input = getFieldDecorator(field, {
        ...initialValue ? { initialValue } : {},
        rules,
    })(
        <Input
            prefix={
                icon ? (
                    <Icon
                        type={ iconType }
                        style={ {
                            color: 'rgba(0,0,0,.25)',
                        } }
                    />
                ) : null
            }
            style={ { width: '80%' } }
            type={ type }
            placeholder={ placeholder }
            disabled={ disabled }
            onChange={ onChange }
        />,
    );

    return formItem ? (
        <FormItem
            label={ label }
            hasFeedback={ hasFeedback }
            colon={ colon }
            className={ className }
            { ...formItemLayout }
        >
            <InputGroup compact>
                <Input style={ { width: '20%' } } defaultValue='+38' disabled />
                { input }
            </InputGroup>
        </FormItem>
    ) : (
        <InputGroup compact>
            <Input style={ { width: '20%' } } defaultValue='+38' disabled />
            { input }
        </InputGroup>
    );
};
