// vendor
import React from 'react';
import { Checkbox, Form } from 'antd';

// own
const FormItem = Form.Item;

export const DecoratedCheckbox = props => {
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

        children,
    } = props;

    const checkbox = getFieldDecorator(field, {
        rules,
    })(<Checkbox disabled={ disabled }>{ children }</Checkbox>);

    return formItem ? (
        <FormItem
            label={ label }
            hasFeedback={ hasFeedback }
            colon={ colon }
            className={ className }
            formItemLayout={ formItemLayout }
        >
            { checkbox }
        </FormItem>
    ) : 
        checkbox
    ;
};
