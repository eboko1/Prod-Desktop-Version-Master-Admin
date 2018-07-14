// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Tabs } from 'antd';
import moment from 'moment';

// proj
import { Layout } from 'commons';
import { DashboardContainer } from 'containers';
import { ArrowsWeekPicker, ArrowsDatePicker } from 'components';

// own
import Styles from './styles.m.css';
const TabPane = Tabs.TabPane;

class DashboardPage extends Component {
    // state = {
    //     mode:      'calendar',
    //     date:      moment(),
    //     startDate: moment()
    //         .startOf('week')
    //         .isoWeekday(1),
    //     endDate: moment()
    //         .endOf('week')
    //         .isoWeekday(7),
    // };
    constructor(props) {
        super(props);
        this.state = {
            mode:      'calendar',
            date:      moment(),
            startDate: moment()
                .startOf('week')
                .isoWeekday(1),
            endDate: moment()
                .endOf('week')
                .isoWeekday(7),
        };
    }

    _onDayChange = date => this.setState({ date });

    _prevDay() {
        this.setState(prevState => ({
            date: prevState.date.subtract(1, 'day'),
        }));
    }

    _nextDay() {
        this.setState(prevState => ({
            date: prevState.date.add(1, 'day'),
        }));
    }

    _onWeekChange(date) {
        console.log('→ onWeekChange(date)');
        this.setState(() => ({
            startDate: moment(date)
                .startOf('week')
                .isoWeekday(1),
            endDate: moment(date)
                .endOf('week')
                .isoWeekday(7),
        }));
    }

    _prevWeek() {
        console.log('→ prev Week() click');
        this.setState(prevState => ({
            startDate: prevState.startDate.subtract(1, 'weeks'),
            endDate:   prevState.endDate.subtract(1, 'weeks'),
        }));
    }

    _nextWeek() {
        this.setState(prevState => ({
            startDate: prevState.startDate.add(1, 'weeks'),
            endDate:   prevState.endDate.add(1, 'weeks'),
        }));
    }

    _setDashboardMode = mode => this.setState({ mode });

    render() {
        const { startDate, endDate, date, mode } = this.state;
        console.log('→ this.state', this.state);

        return (
            <Layout
                paper={ false }
                title={ <FormattedMessage id='dashboard-page.title' /> }
                description={
                    <FormattedMessage id='dashboard-page.description' />
                }
            >
                <section className={ Styles.dashboardPage }>
                    <Tabs
                        // type='card'
                        tabBarExtraContent={
                            mode === 'calendar' ? (
                                <ArrowsWeekPicker
                                    startDate={ startDate }
                                    endDate={ endDate }
                                    onWeekChange={ () => this._onWeekChange() }
                                    prevWeek={ () => this._prevWeek() }
                                    nextWeek={ () => this._nextWeek() }
                                />
                            ) : (
                                <ArrowsDatePicker
                                    date={ date }
                                    onDayChange={ this._onDayChange }
                                    prevDay={ this._prevDay }
                                    nextDay={ this._nextDay }
                                />
                            )
                        }
                        onChange={ mode => this._setDashboardMode(mode) }
                    >
                        <TabPane
                            tab={
                                <FormattedMessage id='dashboard-page.calendar' />
                            }
                            key='calendar'
                        >
                            <DashboardContainer
                                beginDate={
                                    mode === 'calendar' ? startDate : date
                                }
                                mode={ mode }
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <FormattedMessage id='dashboard-page.stations_load' />
                            }
                            key='stations'
                        >
                            stations
                        </TabPane>
                    </Tabs>
                </section>
            </Layout>
        );
    }
}

export default DashboardPage;
