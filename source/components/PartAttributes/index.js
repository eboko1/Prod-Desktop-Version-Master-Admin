// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Radio } from 'antd';

// proj
import { Catcher } from 'commons';
import { ArrowsDatePicker } from 'components';
import { RangePickerField } from 'forms/_formkit';

// own
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class DatePickerGroup extends Component {
    render() {
        const {
            date,
            loading,
            period,
            className,
            onDateChange,
            onPeriodChange,
            startDate,
            endDate,
        } = this.props;

        return (
            <Catcher>
                <RangePickerField
                    onChange={ onDateChange }
                    loading={ loading }
                    startDate={ startDate }
                    endDate={ endDate }
                />
                <RadioGroup value={ period } className={ className }>
                    <RadioButton
                        value='day'
                        onClick={ () => onPeriodChange('day') }
                    >
                        <FormattedMessage id='day' />
                    </RadioButton>
                    <RadioButton
                        value='week'
                        onClick={ () => onPeriodChange('week') }
                    >
                        <FormattedMessage id='week' />
                    </RadioButton>
                    <RadioButton
                        value='month'
                        onClick={ () => onPeriodChange('month') }
                    >
                        <FormattedMessage id='month' />
                    </RadioButton>
                </RadioGroup>
            </Catcher>
        );
    }
}
