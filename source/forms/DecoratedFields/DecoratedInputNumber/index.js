// vendor
import React, { forwardRef, memo } from 'react';
import { InputNumber, Form } from 'antd';
import _ from 'lodash';

// own
const FormItem = Form.Item;

export const DecoratedInputNumber = memo(
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

            getFieldDecorator,
            disabled,
            rules,
            field,
            min,
            max,
            // defaultValue,

            initialValue,
            onChange,

            formatter,
            parser,
            style,

            placeholder,

            cnStyles,
        } = props;
        console.log('→ INPUTNUMBER ref', ref);
        const defaultValue = [ initialValue ].find(_.isNumber);
        const numberInitialValue = _.isNumber(defaultValue)
            ? defaultValue
            : void 0;

        const inputNumber = getFieldDecorator(field, {
            rules,
            initialValue: numberInitialValue,
        })(
            <InputNumber
                className={ cnStyles }
                min={ min }
                max={ max }
                style={ style }
                disabled={ disabled }
                onChange={ onChange }
                placeholder={ placeholder }
                formatter={ formatter }
                parser={ parser }
                ref={ ref }
                onKeyDown={ e => e.key === 'Enter' && onPressEnter() }
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
                { inputNumber }
            </FormItem>
        ) : 
            inputNumber
        ;
    }),
);
