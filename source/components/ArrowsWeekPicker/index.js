// vendor
import React, { Component } from 'react';
import { DatePicker, Icon } from 'antd';
import moment from 'moment';

// own
import Styles from './styles.m.css';
const WeekPicker = DatePicker.WeekPicker;

class ArrowsWeekPicker extends Component {
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
        const {
            onWeekChange,
            prevWeek,
            nextWeek,
            startDate,
            endDate,
        } = this.props;

        return (
            <div className={ Styles.weekPicker }>
                <Icon
                    type='left'
                    className={ Styles.icon }
                    onClick={ () => prevWeek() }
                />
                <WeekPicker
                    // defaultValue={ moment() }
                    value={ startDate }
                    onChange={ value => onWeekChange(value) }
                    placeholder='Select Week'
                    // format={ date => this.formatDate(date) }
                />
                { /* <div className={ Styles.weekDays }>
                    ({ `${startDate.format('MM-DD')} ~ ${endDate.format(
                        'MM-DD',
                    )}` })
                </div> */ }
                <Icon
                    type='right'
                    className={ Styles.icon }
                    onClick={ () => nextWeek() }
                />
            </div>
        );
    }
}

export default ArrowsWeekPicker;
