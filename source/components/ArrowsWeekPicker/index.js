// vendor
import React, { Component } from 'react';
import { connect } from "react-redux";
import { DatePicker, Button } from 'antd';
import { injectIntl } from 'react-intl';

// own
import Styles from './styles.m.css';
const WeekPicker = DatePicker.WeekPicker;

const mapStateToProps = state => ({
    isMobile: state.ui.views.isMobile,
});

@injectIntl
@connect(mapStateToProps)
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
            isMobile,
        } = this.props;

        return isMobile ? (
            <div className={ Styles.mobileWeekPicker }>
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
                <Button
                    icon='right'
                    className={ Styles.icon }
                    onClick={ () => nextWeek() }
                    disabled={ loading }
                />
            </div>
        ) : (
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
