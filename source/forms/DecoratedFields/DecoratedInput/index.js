// vendor
import React from 'react';
import { Input, Icon, Form } from 'antd';

// own
const FormItem = Form.Item;

export const DecoratedInput = props => {
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
        style,
        onChange,
    } = props;

    const input = getFieldDecorator(field, {
        ...initialValue ? { initialValue } : { initialValue: void 0 },
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
            style={ style }
            type={ type }
            className={ className }
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
            { input }
        </FormItem>
    ) : 
        input
    ;
};
