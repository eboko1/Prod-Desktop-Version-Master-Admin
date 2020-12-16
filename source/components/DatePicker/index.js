// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { DatePicker, Icon, Radio, Button, Dropdown, Menu, Popover, Select } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
const { RangePicker } = DatePicker;

@injectIntl
export class DateRangePicker extends React.Component {
    constructor(props) {
        super(props);
    }

    verifyDate(dateRange) {
        if (dateRange && dateRange.length != 2) {
            const thisYear = moment().startOf('year');
            const defaultDateRange = [ moment(thisYear, this.props.dateFormat), moment(new Date(), this.props.dateFormat) ];

            return defaultDateRange;
        }

        return dateRange;
    }

    updateDimensions = () => {
        this.setState({});
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        const {
            dateRange,
            onDateChange,
            minimize,
            autoMinimize,
            style,
            intl: { formatMessage }
        } = this.props;

        const maxWidth = typeof autoMinimize == "number" ? autoMinimize : 1440;
        const minimizeMode = autoMinimize ? window.innerWidth < maxWidth : minimize;

        const dateFormat = this.props.dateFormat || 'DD.MM.YYYY';
        const currentYear = new Date().getFullYear();
        const yearOptions = [];

        for(let year = currentYear-1; year > currentYear - 4; year--) {
            yearOptions.push(year);
        }

        const datePicker = (
            <div className={ Styles.filterDatePicker }>
                <RangePicker
                    allowClear={ false }
                    style={{width: '100%'}}
                    value={ this.verifyDate(dateRange) }
                    popupStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                    format={ dateFormat }
                    onChange={ newDate => {
                        onDateChange(newDate);
                    } }
                />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Dropdown
                        className={Styles.datePickerButton}
                        overlayStyle={{zIndex: 9999}}
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment(new Date(), dateFormat),
                                            moment(new Date(), dateFormat)
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.today' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-1, 'day'),
                                            moment().add(-1, 'day'),
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.yesterday' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(1, 'day'),
                                            moment().add(1, 'day'),
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.tomorrow' />
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button>
                            <FormattedMessage id="datepicker.day"/>
                        </Button>
                    </Dropdown>
                    <Dropdown
                        className={Styles.datePickerButton}
                        overlayStyle={{zIndex: 9999}}
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().startOf('week'),
                                            moment().endOf('week'),
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.current_week' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().startOf('week').add(-1, 'week'),
                                            moment().endOf('week').add(-1, 'week')
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.previous_week' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().startOf('week').add(1, 'week'),
                                            moment().endOf('week').add(1, 'week')
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.next_week' />
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button>
                            <FormattedMessage id="datepicker.week"/>
                        </Button>
                    </Dropdown>
                    <Dropdown
                        className={Styles.datePickerButton}
                        overlayStyle={{zIndex: 9999}}
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().startOf('month'),
                                            moment().endOf('month'),
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.current' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-1, 'month').startOf('month'),
                                            moment().add(-1, 'month').endOf('month')
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.previous' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-2, 'month').startOf('month'),
                                            moment().add(-2, 'month').endOf('month')
                                        ]);
                                    }}
                                >
                                    2 <FormattedMessage id='datepicker.month_before' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-3, 'month').startOf('month'),
                                            moment().add(-3, 'month').endOf('month')
                                        ]);
                                    }}
                                >
                                    3 <FormattedMessage id='datepicker.month_before' />
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button>
                            <FormattedMessage id="datepicker.month"/>
                        </Button>
                    </Dropdown>
                    <Dropdown
                        className={Styles.datePickerButton}
                        overlayStyle={{zIndex: 9999}}
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().startOf('quarter'),
                                            moment().endOf('quarter'),
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.current' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-1, 'quarter').startOf('quarter'),
                                            moment().add(-1, 'quarter').endOf('quarter')
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.previous' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-2, 'quarter').startOf('quarter'),
                                            moment().add(-2, 'quarter').endOf('quarter')
                                        ]);
                                    }}
                                >
                                    2 <FormattedMessage id='datepicker.quarters_before' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-3, 'quarter').startOf('quarter'),
                                            moment().add(-3, 'quarter').endOf('quarter')
                                        ]);
                                    }}
                                >
                                    3 <FormattedMessage id='datepicker.quarters_before' />
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button>
                            <FormattedMessage id="datepicker.quarter"/>
                        </Button>
                    </Dropdown>
                    <Dropdown
                        className={Styles.datePickerButton}
                        overlayStyle={{zIndex: 9999}}
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().startOf('year'),
                                            moment().endOf('year'),
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.current' />
                                </Menu.Item>
                                {yearOptions.map((year, key)=>{
                                    return (
                                        <Menu.Item
                                            style={{
                                                textDecoration: 'lowercase'
                                            }}
                                            key={key}
                                            onClick={()=>{
                                                onDateChange([
                                                    moment(new Date('1/1/' + year), dateFormat),
                                                    moment(new Date('1/1/' + year), dateFormat).endOf('year')
                                                ]);
                                            }}
                                        >
                                            {year} <FormattedMessage id='datepicker.year' />
                                        </Menu.Item>
                                    )
                                })}
                            </Menu>
                        }
                    >
                        <Button>
                            <FormattedMessage id="datepicker.year"/>
                        </Button>
                    </Dropdown>
                </div>
            </div>
        )

        return minimizeMode ? (
            <div className={Styles.minimized} style={style} title={formatMessage({id: 'date'})}>
                <Popover content={datePicker} trigger="click">
                    <Button>
                        <Icon style={{fontSize: 16}} type='calendar' />
                    </Button>
                </Popover>
            </div>
        ) : (
            datePicker
        );
    }
}

@injectIntl
export class SingleDatePicker extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            date,
            onDateChange,
            style,
            intl: { formatMessage },
            minimize
        } = this.props;

        const dateFormat = this.props.dateFormat || 'DD.MM.YYYY';

        const datePicker = (
            <div className={ Styles.filterDatePicker }>
                <DatePicker
                    allowClear={ false }
                    style={{width: '100%'}}
                    value={ date }
                    format={ dateFormat }
                    onChange={ newDate => {
                        onDateChange(newDate);
                    } }
                />
            </div>
        );

        return minimize ? (
            <div className={Styles.minimized} style={style} title={formatMessage({id: 'date'})}>
                <Popover content={datePicker} trigger="click">
                    <Button>
                        <Icon style={{fontSize: 16}} type='calendar' />
                    </Button>
                </Popover>
            </div>
        ) : (
            <div style={style}>
                {datePicker}
            </div>
        );
    }
}