// vendor
import React from 'react';
import { Slider, Form } from 'antd';

// own
const FormItem = Form.Item;

export const DecoratedSlider = props => {
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
    } = props;

    const slider = getFieldDecorator(field, {
        rules,
    })(
        <Slider
            disabled={ disabled }
            min={ 0.5 }
            step={ 0.5 }
            max={ 8 }
            // defaultValue={ 1 }
            // onChange={ value => console.log('→ duration slider value', value) }
            style={ { width: '100%' } }
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
            { slider }
        </FormItem>
    ) : 
        slider
    ;
};
