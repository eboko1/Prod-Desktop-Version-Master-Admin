// vendor
import React from 'react';
import { Checkbox, Form } from 'antd';
import _ from 'lodash';

// own
const FormItem = Form.Item;

export class DecoratedCheckbox extends React.PureComponent {
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
            children,
            onChange,

            fieldValue,
            defaultGetValueProps,
        } = this.props;

        const checkbox = getFieldDecorator(field, {
            valuePropName: 'checked',
            initialValue:  Boolean(initialValue),
            ...defaultGetValueProps
                ? {
                    getValueProps: () => ({
                        value: _.find(
                            [ fieldValue ],
                            value => !_.isNil(value),
                        ),
                    }),
                }
                : {},
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
    }
}
