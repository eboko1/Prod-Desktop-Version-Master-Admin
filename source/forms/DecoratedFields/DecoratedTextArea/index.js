// vendor
import React from 'react';
import { Input, Form } from 'antd';
import _ from 'lodash';

// own
const { TextArea } = Input;
const FormItem = Form.Item;

export default class DecoratedTextArea extends React.PureComponent {
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
            rules,
            field,
            disabled,
            placeholder,
            autosize,
            initialValue,

            fieldValue,
            defaultGetValueProps,
        } = this.props;

        const textArea = getFieldDecorator(field, {
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
            ...initialValue ? { initialValue } : { initialValue: void 0 },
        })(
            <TextArea
                disabled={ disabled }
                placeholder={ placeholder }
                autosize={ autosize } //{ minRows: 2, maxRows: 6 }
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
                { textArea }
            </FormItem>
        ) : 
            { textArea }
        ;
    }
}
