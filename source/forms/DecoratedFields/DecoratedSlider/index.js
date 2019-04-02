// vendor
import React from 'react';
import { Slider, Form } from 'antd';
import _ from 'lodash';

// own
const FormItem = Form.Item;

export class DecoratedSlider extends React.PureComponent {
    render() {
        const {
            //FormItem
            formItem,
            label,
            colon,
            className,
            cnStyles,
            width,
            hasFeedback,
            formItemLayout,

            getFieldDecorator,
            disabled,
            rules,
            field,
            initialValue,

            onChange,
            step,
            min,
            max,
            marks,
        } = this.props;

        const slider = getFieldDecorator(field, {
            ...initialValue
                ? { initialValue }
                : { initialValue: void 0 },
            rules,
        })(
            <Slider
                disabled={ disabled }
                min={ min }
                step={ step }
                max={ max }
                marks={ marks }
                onChange={ onChange }
                style={ { width: width || '100%' } }
                className={ cnStyles }
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
    }
}
