// vendor
import React, { Component } from 'react';
import { DatePicker, Icon } from 'antd';
import moment from 'moment';

// own
import Styles from './styles.m.css';

class ArrowsDatePicker extends Component {
    // formatDate(date) {
    //     const range = {
    //         startDate: moment(date)
    //             .startOf('week')
    //             .isoWeekdate(1)
    //             .format('YYYY-MM-DD'),
    //         endDate: moment(date)
    //             .endOf('week')
    //             .isoWeekdate(7)
    //             .format('YYYY-MM-DD'),
    //     };
    //     console.log('→ formatDate', `${range.startDate} ${range.endDate}`);
    //
    //     return `${range.startDate} ${range.endDate}`;
    // }

    render() {
        const { date, nextDay, prevDay, onDayChange } = this.props;

        return (
            <div className={ Styles.container }>
                <Icon
                    type='left'
                    className={ Styles.icon }
                    onClick={ () => prevDay() }
                />
                <DatePicker
                    // defaultValue={ moment() }
                    className={ Styles.datePicker }
                    value={ date }
                    onChange={ date => onDayChange(date) }
                    placeholder='Select Day'
                    format={ 'dddd, DD MMM YYYY' }
                />
                <Icon
                    type='right'
                    className={ Styles.icon }
                    onClick={ () => nextDay() }
                />
            </div>
        );
    }
}

export default ArrowsDatePicker;
