// vendor
import React, { Component } from "react";
import { DatePicker } from "antd";
import { injectIntl } from "react-intl";

@injectIntl
export default class DatePickerField extends Component {
    state = {
        date: this.props.date,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.date !== state.date) {
            return {
                date: props.date,
            };
        }

        return null;
    }

    render() {
        const {
            onChange,
            date,
            loading,
            className,
            style,
            intl: { formatMessage },
        } = this.props;

        return (
            <DatePicker
                style={style}
                allowClear={false}
                value={date}
                onChange={value => onChange(value)}
                placeholder={formatMessage({
                    id: "select_date",
                })}
                format={"dddd, DD MMM YYYY"}
                disabled={loading}
                className={className}
            />
        );
    }
}
