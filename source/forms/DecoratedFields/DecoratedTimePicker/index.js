// vendor
import React from 'react';
import { Form, TimePicker } from 'antd';
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
    } = props;
    const timePicker = getFieldDecorator(field, {
        rules,
    })(
        <TimePicker
            format={ format || 'HH:mm' }
            disabled={ disabled }
            placeholder={
                placeholder ||
                formatMessage({ id: 'datepicker.timepicker.placeholder' })
            }
            getPopupContainer={ getPopupContainer }
            popupClassName={ popupClassName }
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
