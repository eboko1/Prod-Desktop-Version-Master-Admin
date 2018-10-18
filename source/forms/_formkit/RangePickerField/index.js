// vendor
import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

// own
const RangePicker = DatePicker.RangePicker;

export default class RangePickerField extends Component {
    state = {
        startDate: this.props.startDate,
        endDate:   this.props.endDate,
    };

    static getDerivedStateFromProps(props, state) {
        if (
            props.startDate !== state.startDate ||
            props.endDate !== state.endDate
        ) {
            return {
                startDate: props.startDate,
                endDate:   props.endDate,
            };
        }

        return null;
    }

    render() {
        const { ranges, onChange, loading, startDate, endDate } = this.props;

        // const defaultRanges = {
        //     Today:        [ moment(), moment() ],
        //     'This Month': [ moment(), moment().endOf('month') ],
        // };

        return (
            <RangePicker
                // ranges={ ranges || defaultRanges }
                onChange={ value => onChange(value) }
                disabled={ loading }
                allowClear={ false }
                value={ [ moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD') ] }
                format={ 'YYYY-MM-DD' }
            />
        );
    }
}
