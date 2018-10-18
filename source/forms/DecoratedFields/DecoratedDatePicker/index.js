// vendor
import React from 'react';
import { DatePicker } from 'antd';
import { Form } from 'antd';

// proj
import { getLocale } from 'utils';

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

        // formatMessage,
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
        // placeholder,
        initialValue,
        allowClear,

        onChange,
        cnStyles,
    } = props;

    const renderRangePicker = (
        <RangePicker
            locale={ getLocale() }
            ranges={ ranges }
            showTime={ showTime }
            onChange={ onChange }
            format={ format }
            getCalendarContainer={ getCalendarContainer }
            allowClear={ allowClear }
            className={ cnStyles }
        />
    );

    const renderDatePicker = (
        <DatePicker
            getCalendarContainer={ getCalendarContainer }
            format={ format }
            disabled={ disabled }
            showTime={ showTime }
            onChange={ onChange }
            disabledDate={ disabledDate }
            disabledTime={ disabledTime }
            locale={ getLocale() }
            allowClear={ allowClear }
        />
    );

    let datePicker = void 0;

    if (getFieldDecorator) {
        datePicker = getFieldDecorator(field, {
            ...initialValue ? { initialValue } : { initialValue: void 0 },
            rules,
        })(ranges ? renderRangePicker : renderDatePicker);
    } else {
        datePicker = ranges ? renderRangePicker : renderDatePicker;
    }

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
