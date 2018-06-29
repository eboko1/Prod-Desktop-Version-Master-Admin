// vendor
import React from 'react';
import { InputNumber, Icon } from 'antd';

export const DecoratedInputNumber = props => {
    const {
        getFieldDecorator,
        disabled,
        rules,
        field,
        min,
        // TODO
        // defaultValue,
        initValue,
        onChange,

        placeholder,
        icon,
        iconType,
    } = props;

    return getFieldDecorator(field, {
        rules,
        initValue,
    })(
        <InputNumber
            disabled={ disabled }
            min={ min }
            // defaultValue={ defaultValue }
            onChange={ onChange }
            // onChange={ value =>
            //     this.onCellChange(record.key, value, 'price')
            // }
        />,
    );
};
