// vendor
import React, { forwardRef, memo } from 'react';
import { Input, Icon, Form } from 'antd';
import styled from 'styled-components';

// own
// const FormItem = Form.Item;
const FormItem = styled(Form.Item)`
    display: ${props => props.hiddenField && 'none'};
`;

const StyledInput = styled(Input)`
    display: ${props => props.hiddeninput && 'none'};
`;

export const DecoratedInput = memo(
    forwardRef((props, ref) => {
        const {
            //FormItem
            formItem,
            label,
            colon,
            className,
            hasFeedback,
            formItemLayout,
            onPressEnter,
            // styles
            hiddenField,
            hiddeninput,
            cnStyles,
            style,
            // input
            getFieldDecorator,
            disabled,
            rules,
            type,
            placeholder,
            icon,
            iconType,
            field,
            initialValue,
            onChange,
        } = props;

        const input = getFieldDecorator(field, {
            ...initialValue ? { initialValue } : { initialValue: void 0 },
            rules,
        })(
            <StyledInput
                hiddeninput={ hiddeninput }
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
                hiddenField={ hiddenField }
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
    }),
);
