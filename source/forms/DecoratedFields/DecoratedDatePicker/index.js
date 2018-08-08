// vendor
import React from 'react';
import { DatePicker } from 'antd';
import { Form } from 'antd';

const FormItem = Form.Item;
// own
const { RangePicker } = DatePicker;

export const DecoratedDatePicker = props => {
    const {
        //formItem
        formItem,
        label,
        colon,
        className,
        hasFeedback,
        formItemLayout,

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
            placeholder:      formatMessage({ id: 'datepicker.placeholder' }),
            rangePlaceholder: [ formatMessage({ id: 'datepicker.range.start_date' }), formatMessage({ id: 'datepicker.range.end_date' }) ],
            today:            formatMessage({ id: 'datepicker.today' }),
            now:              formatMessage({ id: 'datepicker.now' }),
            backToToday:      formatMessage({ id: 'datepicker.back_to_today' }),
            ok:               formatMessage({ id: 'datepicker.ok' }),
            clear:            formatMessage({ id: 'datepicker.clear' }),
            month:            formatMessage({ id: 'datepicker.month' }),
            year:             formatMessage({ id: 'datepicker.year' }),
            timeSelect:       formatMessage({
                id: 'datepicker.timepicker.placeholder',
            }),
            dateSelect: formatMessage({
                id: 'datepicker.placeholder',
            }),
            monthSelect:     formatMessage({ id: 'datepicker.select_month' }),
            yearSelect:      formatMessage({ id: 'datepicker.select_year' }),
            decadeSelect:    'Choose a decade',
            yearFormat:      'YYYY',
            dateFormat:      'M/D/YYYY',
            dayFormat:       'D',
            dateTimeFormat:  'M/D/YYYY HH:mm:ss',
            monthFormat:     'MMMM',
            monthBeforeYear: true,
            previousMonth:   'Previous month (PageUp)',
            nextMonth:       'Next month (PageDown)',
            previousYear:    'Last year (Control + left)',
            nextYear:        'Next year (Control + right)',
            previousDecade:  'Last decade',
            nextDecade:      'Next decade',
            previousCentury: 'Last century',
            nextCentury:     'Next century',
        },
        timePickerLocale: {
            placeholder: formatMessage({
                id: 'datepicker.timepicker.placeholder',
            }),
        },
    };

    const datePicker = getFieldDecorator(field, {
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
                showTime={ showTime }
                disabledDate={ disabledDate }
                disabledTime={ disabledTime }
                locale={ locale }
            />
        ),
    );

    return formItem ? (
        <FormItem
            label={ label }
            hasFeedback={ hasFeedback }
            colon={ colon }
            className={ className }
            { ...formItemLayout }
        >
            { datePicker }
        </FormItem>
    ) :
        datePicker
    ;
};
