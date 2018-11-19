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
            hasFeedback,
            formItemLayout,

            getFieldDecorator,
            disabled,
            rules,
            field,
            initDuration,

            step,
            min,
            max,
        } = this.props;

        const slider = getFieldDecorator(field, {
            ...initDuration
                ? { initialValue: initDuration }
                : { initialValue: void 0 },
            rules,
        })(
            <Slider
                disabled={ disabled }
                min={ min }
                step={ step }
                max={ max }
                // value={ initialValue }
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
    }
}
