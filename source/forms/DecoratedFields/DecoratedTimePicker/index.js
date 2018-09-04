// vendor
import React from 'react';
import { Form, TimePicker, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
// import moment from 'moment';

// own
const FormItem = Form.Item;

export const DecoratedTimePicker = props => {
    const {
        //formItem
        formItem,
        label,
        colon,
        className,
        hasFeedback,
        formItemLayout,
        getPopupContainer,
        getFieldDecorator,
        rules,
        field,
        format,
        placeholder,
        disabled,
        formatMessage,
        popupClassName,
        minuteStep,
        disabledHours,
        disabledMinutes,
        disabledSeconds,
        inputReadOnly,
        allowEmpty,
        initialValue,
        defaultOpenValue,
    } = props;

    const timePicker = getFieldDecorator(field, {
        ...initialValue ? { initialValue } : {},
        rules,
    })(
        <TimePicker
            defaultOpenValue={ defaultOpenValue }
            format={ format || 'HH:mm' }
            disabled={ disabled }
            disabledHours={ disabledHours }
            disabledMinutes={ disabledMinutes }
            disabledSeconds={ disabledSeconds }
            placeholder={
                placeholder ||
                formatMessage({ id: 'datepicker.timepicker.placeholder' })
            }
            getPopupContainer={ getPopupContainer }
            popupClassName={ popupClassName }
            minuteStep={ minuteStep }
            inputReadOnly={ inputReadOnly }
            allowEmpty={ allowEmpty }
        />,
    );

    return formItem ? (
        <FormItem
            label={ label }
            hasFeedback={ hasFeedback }
            colon={ colon }
            className={ className }
            { ...formItemLayout }
        >
            { timePicker }
        </FormItem>
    ) : 
        timePicker
    ;
};
