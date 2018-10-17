// vendor
import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

// own
const RangePicker = DatePicker.RangePicker;

export default class RangePickerField extends Component {
    render() {
        const { ranges, onChange, loading, startDate, endDate } = this.props;

        const defaultRanges = {
            Today:        [ moment(), moment() ],
            'This Month': [ moment(), moment().endOf('month') ],
        };
        // console.log('→ startDate', startDate);
        // console.log('→ endDate', endDate);

        return (
            <RangePicker
                ranges={ ranges || defaultRanges }
                onChange={ onChange }
                disabled={ loading }
                allowClear={ false }
                // value={ [ moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD') ] }
                value={ [ moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD') ] }
                format={ 'YYYY-MM-DD' }
            />
        );
    }
}
