import React from 'react';
import { Icon } from 'antd';

export default props => {
    return (
        <Icon
            style={ {
                fontSize: 24,
                cursor:   'pointer',
            } }
            type='close'
            onClick={ props.onClick }
        />
    );
};
