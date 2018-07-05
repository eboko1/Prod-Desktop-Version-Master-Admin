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
        max,
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
            max={ max }
            // defaultValue={ defaultValue }
            onChange={ onChange }
            // onChange={ value =>
            //     this.onCellChange(record.key, value, 'price')
            // }
        />,
    );
};
