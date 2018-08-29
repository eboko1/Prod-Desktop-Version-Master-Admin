// vendor
import React from 'react';
import { InputNumber, Icon, Form } from 'antd';
import _ from 'lodash';

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
        initialValue,
        onChange,

        placeholder,
        icon,
        iconType,
    } = props;

    const defaultValue = [ initValue, initialValue ].find(_.isNumber);

    const inputNumber = getFieldDecorator(field, {
        rules,
        initialValue: defaultValue,
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
