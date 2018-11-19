// vendor
import React from 'react';
import { InputNumber, Form } from 'antd';
import _ from 'lodash';

// own
const FormItem = Form.Item;

export class DecoratedInputNumber extends React.PureComponent {
    render() {
        const {
            //FormItem
            formItem,
            label,
            colon,
            className,
            hasFeedback,
            formItemLayout,
            innerRef,
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
            fieldValue,
            defaultGetValueProps,
        } = this.props;

        const defaultValue = [ initialValue ].find(_.isNumber);
        const numberInitialValue = _.isNumber(defaultValue)
            ? defaultValue
            : void 0;

        const inputNumber = getFieldDecorator(field, {
            rules,
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
                ref={ innerRef }
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
    }
}
