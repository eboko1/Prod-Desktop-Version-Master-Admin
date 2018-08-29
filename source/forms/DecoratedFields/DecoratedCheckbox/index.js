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
        initialValue,
        children,
        onChange,
    } = props;

    const checkbox = getFieldDecorator(field, {
        valuePropName: 'checked',
        initialValue:  Boolean(initValue || initialValue),
        rules,
    })(
        <Checkbox disabled={ disabled } onChange={ onChange }>
            { children }
        </Checkbox>,
    );

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
