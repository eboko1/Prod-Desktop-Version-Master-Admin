// vendor
import React, { forwardRef } from 'react';
import { Input, Icon, Form } from 'antd';
import _ from 'lodash';

// own
const FormItem = Form.Item;

export const DecoratedInput = forwardRef(
    class extends React.PureComponent {
        render() {
            const {
                //FormItem
                formItem,
                label,
                colon,
                className,
                hasFeedback,
                formItemLayout,
                ref,
                onPressEnter,

                cnStyles,
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
            } = this.props;

            const input = getFieldDecorator(field, {
                ...initialValue ? { initialValue } : { initialValue: void 0 },
                rules,
            })(
                <Input
                    className={ cnStyles || className }
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
                    placeholder={ placeholder }
                    disabled={ disabled }
                    onChange={ onChange }
                    ref={ ref }
                    onPressEnter={ onPressEnter }
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
        }
    },
);
