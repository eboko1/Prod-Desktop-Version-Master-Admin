// vendor
import React from 'react';
import { DatePicker } from 'antd';

// own
const { RangePicker } = DatePicker;

export const DecoratedDatePicker = props => {
    const {
        ranges,
        getFieldDecorator,
        rules,
        field,
        format,
        showTime,
        getCalendarContainer,
        placeholder,
    } = props;

    return getFieldDecorator(field, {
        rules,
    })(
        ranges ? (
            <RangePicker
                // ranges={ {
                //     Today:        [ moment(), moment() ],
                //     'This Month': [ moment(), moment().endOf('month') ],
                // } }
                ranges={ ranges }
                showTime={ showTime }
                format={ format }
                // onChange={ onChange }
                getCalendarContainer={ getCalendarContainer }
            />
        ) : (
            <DatePicker
                placeholder={ placeholder }
                getCalendarContainer={ getCalendarContainer }
                format={ format }
            />
        ),
    );
};
