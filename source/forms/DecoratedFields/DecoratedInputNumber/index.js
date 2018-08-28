// vendor
import React from 'react';
import { InputNumber, Icon, Form } from 'antd';

// own
const FormItem = Form.Item;

export const DecoratedInputNumber = props => {
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
        field,
        min,
        max,
        // defaultValue,

        initValue,
        onChange,

        placeholder,
        icon,
        iconType,
    } = props;

    const inputNumber = getFieldDecorator(field, {
        rules,
        initialValue: initValue,
    })(
        <InputNumber
            disabled={ disabled }
            min={ min }
            max={ max }
            // defaultValue={ defaultValue }
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
            { inputNumber }
        </FormItem>
    ) : 
        inputNumber
    ;
};
