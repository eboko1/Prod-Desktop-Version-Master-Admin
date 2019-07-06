// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Radio } from 'antd';
import _ from 'lodash';

// own
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default props => {
    return (
        // <RadioGroup value={ filterStatus }>
        <RadioGroup value={ props.status }>
            <RadioButton
                value={ null }
                onClick={ () => props.setFilters({ status: null }) }
            >
                <FormattedMessage id='all' />
            </RadioButton>
            { !_.isEmpty(props.statuses) &&
                props.statuses.map(status => (
                    <RadioButton
                        key={ status }
                        value={ status }
                        onClick={ () => props.setFilters({ status }) }
                    >
                        <FormattedMessage id={ status } />
                    </RadioButton>
                )) }
        </RadioGroup>
    );
};
