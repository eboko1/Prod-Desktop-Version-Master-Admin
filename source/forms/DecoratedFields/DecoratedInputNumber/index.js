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

        formatter,
        parser,
        style,

        placeholder,
        icon,
        iconType,

        cnStyles,
    } = props;

    const defaultValue = [ initValue, initialValue ].find(_.isNumber);

    const inputNumber = getFieldDecorator(field, {
        rules,
        ..._.isNumber(defaultValue)
            ? { initialValue: defaultValue }
            : { initialValue: void 0 },
    })(
        <InputNumber
            className={ cnStyles }
            min={ min }
            max={ max }
            style={ style }
            disabled={ disabled }
            onChange={ onChange }
            placeholder={ placeholder }
            formatter={ formatter }
            parser={ parser }
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
