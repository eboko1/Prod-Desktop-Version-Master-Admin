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
            { props.type === 'expenses' ? (
                <>
                    <RadioButton
                        key={ 'NEW' }
                        value={ 'NEW' }
                        onClick={ () => props.setFilters({ status: 'NEW' }) }
                    >
                        <FormattedMessage id='storage.status.NEW' />
                    </RadioButton>
                    <RadioButton
                        key={ 'DONE' }
                        value={ 'DONE' }
                        onClick={ () => props.setFilters({ status: 'DONE' }) }
                    >
                        <FormattedMessage id='storage.status.OFF' />
                    </RadioButton>
                </>
            ) : 
                props.statuses.map(status => (
                    <RadioButton
                        key={ status }
                        value={ status }
                        onClick={ () => props.setFilters({ status }) }
                    >
                        <FormattedMessage id={ `storage.status.${status}` } />
                    </RadioButton>
                ))
            }
        </RadioGroup>
    );
};
