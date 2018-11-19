// vendor
import React from 'react';
import { Form, TimePicker } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// own
const FormItem = Form.Item;

export class DecoratedTimePicker extends React.PureComponent {
    render() {
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
            initialValue: initialInitialValue,
            defaultOpenValue: initialDefaultOpenValue,
            onChange,

            defaultGetValueProps,
            fieldValue: initialFieldValue,
        } = this.props;
        const defaultOpenValue = _.isString(initialDefaultOpenValue)
            ? moment(initialDefaultOpenValue)
            : initialDefaultOpenValue;
        const fieldValue = _.isString(initialFieldValue)
            ? moment(initialFieldValue)
            : initialFieldValue;
        const initialValue = _.isString(initialInitialValue)
            ? moment(initialInitialValue)
            : initialInitialValue;

        const timePicker = getFieldDecorator(field, {
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
                onChange={ onChange }
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
    }
}
