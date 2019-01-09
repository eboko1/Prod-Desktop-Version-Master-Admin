// vendor
import React from 'react';
import { Radio, Form } from 'antd';

// own
const FormItem = Form.Item;

export class DecoratedRadio extends React.PureComponent {
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
            initialValue,
            value,
            children,
            onChange,
            buttonStyle,
            cnStyles,
        } = this.props;

        const radio = getFieldDecorator(field, {
            valuePropName: 'checked',
            initialValue:  Boolean(initialValue),
            rules,
        })(
            <Radio.Group
                cnStyles={ cnStyles }
                onChange={ onChange }
                disabled={ disabled }
                buttonStyle={ buttonStyle }
                defaultValue={ initialValue }
            >
                { children }
            </Radio.Group>,
        );

        return formItem ? (
            <FormItem
                label={ label }
                hasFeedback={ hasFeedback }
                colon={ colon }
                className={ className }
                { ...formItemLayout }
            >
                { radio }
            </FormItem>
        ) : 
            radio
        ;
    }
}
