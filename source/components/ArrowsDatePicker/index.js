// vendor
import React, { Component } from 'react';
import { DatePicker, Icon } from 'antd';
import moment from 'moment';

// own
import Styles from './styles.m.css';

class ArrowsDatePicker extends Component {
    state = {
        date: moment(),
    };

    onChange = date => this.setState({ date });

    prevDay() {
        this.setState(prevState => ({
            date: prevState.date.subtract(1, 'day'),
        }));
    }

    nextDay() {
        this.setState(prevState => ({
            date: prevState.date.add(1, 'day'),
        }));
    }

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
        const { date } = this.state;

        return (
            <div className={ Styles.container }>
                <Icon
                    type='left'
                    className={ Styles.icon }
                    onClick={ () => this.prevDay() }
                />
                <DatePicker
                    // defaultValue={ moment() }
                    className={ Styles.datePicker }
                    value={ date }
                    onChange={ date => this.onChange(date) }
                    placeholder='Select Day'
                    format={ 'dddd, DD MMM YYYY' }
                />
                <Icon
                    type='right'
                    className={ Styles.icon }
                    onClick={ () => this.nextDay() }
                />
            </div>
        );
    }
}

export default ArrowsDatePicker;
