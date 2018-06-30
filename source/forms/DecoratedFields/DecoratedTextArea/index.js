// vendor
import React from 'react';
import { Input } from 'antd';

// own
const { TextArea } = Input;

export const DecoratedTextArea = props => {
    const {
        getFieldDecorator,
        rules,
        field,
        disabled,
        placeholder,
        autosize,
    } = props;

    return getFieldDecorator(field, {
        rules,
    })(
        <TextArea
            disabled={ disabled }
            placeholder={ placeholder }
            autosize={ autosize } //{ minRows: 2, maxRows: 6 }
        />,
    );
};
