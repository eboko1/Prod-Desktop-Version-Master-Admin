// vendor
import React from 'react';
import { Checkbox, Form } from 'antd';
import _ from 'lodash';

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
        initValue,
        children,
    } = props;

    const checkbox = getFieldDecorator(field, {
        ..._.isBoolean(initValue)
            ? {
                initialValue:  !!initValue,
                valuePropName: 'checked',
            }
            : {},
        rules,
    })(<Checkbox disabled={ disabled }>{ children }</Checkbox>);

    return formItem ? (
        <FormItem
            label={ label }
            hasFeedback={ hasFeedback }
            colon={ colon }
            className={ className }
            { ...formItemLayout }
        >
            { checkbox }
        </FormItem>
    ) : 
        checkbox
    ;
};
