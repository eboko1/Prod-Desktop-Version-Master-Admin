// vendor
import React from 'react';
import { DatePicker } from 'antd';

// own
const { RangePicker } = DatePicker;

export const DecoratedDatePicker = props => {
    const {
        formatMessage,
        ranges,
        getFieldDecorator,
        rules,
        field,
        format,
        showTime,
        disabled,
        disabledDate,
        disabledTime,
        getCalendarContainer,
        placeholder,
    } = props;

    const locale = {
        lang: {
            placeholder:      formatMessage({ id: 'select_date' }),
            rangePlaceholder: [ 'Start date', 'End date' ],
            today:            'Сегодня',
            now:              'Сейчас',
            backToToday:      'Back to today',
            ok:               'Ok',
            clear:            'Clear',
            month:            'Month',
            year:             'Year',
            timeSelect:       'Select time',
            dateSelect:       'Select date',
            monthSelect:      'Choose a month',
            yearSelect:       'Choose a year',
            decadeSelect:     'Choose a decade',
            yearFormat:       'YYYY',
            dateFormat:       'M/D/YYYY',
            dayFormat:        'D',
            dateTimeFormat:   'M/D/YYYY HH:mm:ss',
            monthFormat:      'MMMM',
            monthBeforeYear:  true,
            previousMonth:    'Previous month (PageUp)',
            nextMonth:        'Next month (PageDown)',
            previousYear:     'Last year (Control + left)',
            nextYear:         'Next year (Control + right)',
            previousDecade:   'Last decade',
            nextDecade:       'Next decade',
            previousCentury:  'Last century',
            nextCentury:      'Next century',
        },
        timePickerLocale: {
            placeholder: 'Select time',
        },
    };

    return getFieldDecorator(field, {
        rules,
    })(
        ranges ? (
            <RangePicker
                // ranges={ {
                //     Today:        [ moment(), moment() ],
                //     'This Month': [ moment(), moment().endOf('month') ],
                // } }
                locale={ locale }
                ranges={ ranges }
                showTime={ showTime }
                format={ format }
                getCalendarContainer={ getCalendarContainer }
            />
        ) : (
            <DatePicker
                getCalendarContainer={ getCalendarContainer }
                format={ format }
                disabled={ disabled }
                disabledDate={ disabledDate }
                disabledTime={ disabledTime }
                locale={ locale }
            />
        ),
    );
};
