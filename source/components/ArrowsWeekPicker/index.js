// vendor
import React, { Component } from 'react';
import { DatePicker, Icon, Button } from 'antd';
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
            loading,
        } = this.props;

        return (
            <div className={ Styles.weekPicker }>
                <Button
                    icon='left'
                    className={ Styles.icon }
                    onClick={ () => prevWeek() }
                    disabled={ loading }
                />
                <WeekPicker
                    allowClear={ false }
                    value={ startDate }
                    onChange={ value => onWeekChange(value) }
                    placeholder='Select Week'
                    disabled={ loading }
                />
                <div className={ Styles.weekDays }>
                    ({ `${startDate.format('MM-DD')} ~ ${endDate.format(
                        'MM-DD',
                    )}` })
                </div>
                <Button
                    icon='right'
                    className={ Styles.icon }
                    onClick={ () => nextWeek() }
                    disabled={ loading }
                />
            </div>
        );
    }
}

export default ArrowsWeekPicker;
