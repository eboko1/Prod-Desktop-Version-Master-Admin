// vendor
import React from 'react';
import { Input, Icon } from 'antd';

export const DecoratedInput = props => {
    const {
        getFieldDecorator,
        disabled,
        rules,
        type,
        placeholder,
        icon,
        iconType,
    } = props;

    return getFieldDecorator(type, {
        rules,
    })(
        <Input
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
            type={ type }
            placeholder={ placeholder }
            disabled={ disabled }
        />,
    );
};
