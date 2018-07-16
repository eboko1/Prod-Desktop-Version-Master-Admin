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
    // componentDidUpdate(prevProps, prevState) {
    //     console.log('→ DidUpdate');
    //     if (prevProps.date !== this.props.date) {
    //         this.setState({ date: this.props.date });
    //     }
    // }

    static getDerivedStateFromProps(props, state) {
        console.log('→getDerivedStateFromProps props', props);
        if (props.date !== state.date) {
            return {
                date: props.date,
            };
        }

        return null;
    }
    //
    // componentDidMount() {
    //     console.log('→ did');
    // }
    //
    // shouldComponentUpdate(nextProps) {
    //     console.log('→scu');
    //     if (this.props.date !== nextProps.date) {
    //         return true;
    //     }
    //
    //     return false;
    // }

    render() {
        const { nextDay, prevDay, onDayChange, date } = this.props;
        // const { date } = this.state;

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
                    // onChange={ ({ target: { value } }) => onDayChange(value) }
                    onChange={ value => {
                        onDayChange(value);
                    } }
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
