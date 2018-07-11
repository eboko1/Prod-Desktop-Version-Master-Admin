// vendor
import React, { Component } from 'react';
import { DatePicker, Icon } from 'antd';
import moment from 'moment';

// own
import Styles from './styles.m.css';
const WeekPicker = DatePicker.WeekPicker;

class ArrowsWeekPicker extends Component {
    state = {
        startDate: moment()
            .startOf('week')
            .isoWeekday(1),
        // .format('MM-DD'),
        endDate: moment()
            .endOf('week')
            .isoWeekday(7),
        // .format('MM-DD'),
    };

    onChange(date) {
        this.setState(() => ({
            startDate: moment(date)
                .startOf('week')
                .isoWeekday(1),
            endDate: moment(date)
                .endOf('week')
                .isoWeekday(7),
        }));
    }

    prevWeek() {
        this.setState(prevState => ({
            startDate: prevState.startDate.subtract(1, 'weeks'),
            endDate:   prevState.endDate.subtract(1, 'weeks'),
        }));
    }

    nextWeek() {
        this.setState(prevState => ({
            startDate: prevState.startDate.add(1, 'weeks'),
            endDate:   prevState.endDate.add(1, 'weeks'),
        }));
    }

    // formatDate(date) {
    //     const range = {
    //         startDate: moment(date)
    //             .startOf('week')
    //             .isoWeekday(1)
    //             .format('YYYY-MM-DD'),
    //         endDate: moment(date)
    //             .endOf('week')
    //             .isoWeekday(7)
    //             .format('YYYY-MM-DD'),
    //     };
    //     console.log('→ formatDate', `${range.startDate} ${range.endDate}`);
    //
    //     return `${range.startDate} ${range.endDate}`;
    // }

    render() {
        const { startDate, endDate } = this.state;

        return (
            <div className={ Styles.weekPicker }>
                <Icon
                    type='left'
                    className={ Styles.icon }
                    onClick={ () => this.prevWeek() }
                />
                <WeekPicker
                    // defaultValue={ moment() }
                    value={ moment(startDate) }
                    onChange={ (date, dateString) =>
                        this.onChange(date, dateString)
                    }
                    placeholder='Select Week'
                    // format={ date => this.formatDate(date) }
                />
                <div className={ Styles.weekDays }>
                    ({ `${startDate.format('MM-DD')} ~ ${endDate.format(
                        'MM-DD',
                    )}` })
                </div>
                <Icon
                    type='right'
                    className={ Styles.icon }
                    onClick={ () => this.nextWeek() }
                />
            </div>
        );
    }
}

export default ArrowsWeekPicker;
