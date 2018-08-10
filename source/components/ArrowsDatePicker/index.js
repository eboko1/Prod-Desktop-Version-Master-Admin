// vendor
import React, { Component } from 'react';
import { DatePicker, Icon } from 'antd';
import moment from 'moment';

// own
import Styles from './styles.m.css';

class ArrowsDatePicker extends Component {
    state = {
        date: this.props.date,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.date !== state.date) {
            return {
                date: props.date,
            };
        }

        return null;
    }

    render() {
        const { nextDay, prevDay, onDayChange, date } = this.props;

        return (
            <div className={ Styles.container }>
                <Icon
                    type='left'
                    className={ Styles.icon }
                    onClick={ () => prevDay() }
                />
                <DatePicker
                    allowClear={ false }
                    className={ Styles.datePicker }
                    value={ date }
                    onChange={ value => onDayChange(value) }
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
