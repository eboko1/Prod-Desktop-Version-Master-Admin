// vendor
import React, { Component } from 'react';
import { DatePicker, Button } from 'antd';

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
        const { nextDay, prevDay, onDayChange, date, loading } = this.props;

        return (
            <div className={ Styles.container }>
                <Button
                    icon='left'
                    className={ Styles.icon }
                    onClick={ () => prevDay() }
                    disabled={ loading }
                />
                <DatePicker
                    allowClear={ false }
                    className={ Styles.datePicker }
                    value={ date }
                    onChange={ value => onDayChange(value) }
                    placeholder='Select Day'
                    format={ 'dddd, DD MMM YYYY' }
                    disabled={ loading }
                />
                <Button
                    icon='right'
                    className={ Styles.icon }
                    onClick={ () => nextDay() }
                    disabled={ loading }
                />
            </div>
        );
    }
}

export default ArrowsDatePicker;
