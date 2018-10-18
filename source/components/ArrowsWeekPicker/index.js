// vendor
import React, { Component } from 'react';
import { DatePicker, Button } from 'antd';
import { injectIntl } from 'react-intl';

// own
import Styles from './styles.m.css';
const WeekPicker = DatePicker.WeekPicker;

@injectIntl
class ArrowsWeekPicker extends Component {
    render() {
        const {
            onWeekChange,
            prevWeek,
            nextWeek,
            startDate,
            endDate,
            loading,
            intl: { formatMessage },
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
                    placeholder={ formatMessage({
                        id: 'select_week',
                    }) }
                    disabled={ loading }
                />
                <div className={ Styles.weekDays }>
                    (
                    { `${startDate.format('MM-DD')} ~ ${endDate.format(
                        'MM-DD',
                    )}` }
                    )
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
