// vendor
import React from 'react';
import { Input, Form } from 'antd';

// own
const { TextArea } = Input;
const FormItem = Form.Item;

export class DecoratedTextArea extends React.PureComponent {
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
        } = this.props;

        const textArea = getFieldDecorator(field, {
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
