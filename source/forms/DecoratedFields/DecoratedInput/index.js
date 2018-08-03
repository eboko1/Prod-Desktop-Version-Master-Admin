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
    } = props;

    const input = getFieldDecorator(field, {
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
            type={ type }
            placeholder={ placeholder }
            disabled={ disabled }
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
