// vendor
import React, { Component } from 'react';
import { DatePicker, Icon } from 'antd';
import moment from 'moment';

// own
import Styles from './styles.m.css';
const WeekPicker = DatePicker.WeekPicker;

class ArrowsWeekPicker extends Component {
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
                    allowClear={ false }
                    value={ startDate }
                    onChange={ value => onWeekChange(value) }
                    placeholder='Select Week'
                />
                <div className={ Styles.weekDays }>
                    ({ `${startDate.format('MM-DD')} ~ ${endDate.format(
                        'MM-DD',
                    )}` })
                </div>
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
