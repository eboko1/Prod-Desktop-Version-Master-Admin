// vendor
import React from 'react';
import { DatePicker } from 'antd';
import { Form } from 'antd';

// proj
import { getLocale } from 'utils';
import _ from 'lodash';
import moment from 'moment';

const FormItem = Form.Item;
// own
const { RangePicker } = DatePicker;

export class DecoratedDatePicker extends React.PureComponent {
    render() {
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
            initialValue: initialInitialValue,
            allowClear,

            onChange,
            cnStyles,

            defaultGetValueProps,
            fieldValue: initialFieldValue,
        } = this.props;
        const fieldValue = _.isString(initialFieldValue)
            ? moment(initialFieldValue)
            : initialFieldValue;
        const initialValue = _.isString(initialInitialValue)
            ? moment(initialInitialValue)
            : initialInitialValue;

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
                ...defaultGetValueProps
                    ? {
                        getValueProps: () => ({
                            value: _.find(
                                [ fieldValue, initialValue ],
                                value => !_.isNil(value),
                            ),
                        }),
                    }
                    : {},
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
    }
}
