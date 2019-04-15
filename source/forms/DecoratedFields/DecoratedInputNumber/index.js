// vendor
import React, { forwardRef, memo } from 'react';
import { InputNumber, Form } from 'antd';
import _ from 'lodash';

// proj
import { numeralFormatter, numeralParser } from 'utils';

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

            // formatter,
            //     parser,
            style,

            placeholder,

            cnStyles,
        } = props;

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
                formatter={ props.formatter || numeralFormatter }
                parser={ props.parser || numeralParser }
                ref={ ref }
                // TODO: move to onChange
                onKeyDown={ e => {
                    const validKeys = [
                        '0',
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                        '8',
                        '9',
                        '.',
                        ',',
                        'Tab',
                        'Enter',
                        'Backspace',
                        'Delete',
                    ];
                    if (validKeys.includes(e.key)) {
                        return (
                            e.key === 'Enter' && onPressEnter && onPressEnter()
                        );
                    }

                    return e.preventDefault();
                } }
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
