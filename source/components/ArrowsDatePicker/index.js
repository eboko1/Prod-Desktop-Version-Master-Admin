// vendor
import React, { Component } from 'react';
import { DatePicker, Button } from 'antd';
import { injectIntl } from 'react-intl';

// own
import Styles from './styles.m.css';

@injectIntl
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
        const {
            nextDay,
            prevDay,
            onDayChange,
            date,
            loading,
            intl: { formatMessage },
        } = this.props;

        return (
            <div className={ Styles.container }>
                { prevDay && (
                    <Button
                        icon='left'
                        className={ Styles.icon }
                        onClick={ () => prevDay() }
                        disabled={ loading }
                    />
                ) }
                <DatePicker
                    allowClear={ false }
                    className={ Styles.datePicker }
                    value={ date }
                    onChange={ value => onDayChange(value) }
                    placeholder={ formatMessage({
                        id: 'select_date',
                    }) }
                    format={ 'dddd, DD MMM YYYY' }
                    disabled={ loading }
                />
                { nextDay && (
                    <Button
                        icon='right'
                        className={ Styles.icon }
                        onClick={ () => nextDay() }
                        disabled={ loading }
                    />
                ) }
            </div>
        );
    }
}

export default ArrowsDatePicker;
