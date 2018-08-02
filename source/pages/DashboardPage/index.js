// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import moment from 'moment';

// proj
import {
    initDashboard,
    dropDashboardOrder,
    setDashboardDate,
    setDashboardWeekDates,
    setDashboardMode,
    selectDasboardData,
} from 'core/dashboard/duck';

import { Layout, Spinner } from 'commons';
import { ArrowsWeekPicker, ArrowsDatePicker } from 'components';
import { DashboardContainer } from 'containers';

// own
import Styles from './styles.m.css';
const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    orders:    state.dashboard.orders.orders,
    mode:      state.dashboard.mode,
    stations:  state.dashboard.stations,
    date:      state.dashboard.date,
    startDate: state.dashboard.startDate,
    endDate:   state.dashboard.endDate,
    schedule:  state.dashboard.schedule,
    days:      state.dashboard.days,
    load:      state.dashboard.load,
    spinner:   state.ui.get('dashboardFetching'),

    ...selectDasboardData(state),
    // currentDay: moment().format('YYYY-MM-DD'),
    // time:       [],
    // dashboard:  {
    //     rows:    2,
    //     columns: 4,
    // },
});

const mapDispatchToProps = {
    initDashboard,
    dropDashboardOrder,
    setDashboardDate,
    setDashboardWeekDates,
    setDashboardMode,
};

@connect(mapStateToProps, mapDispatchToProps)
class DashboardPage extends Component {
    componentDidMount() {
        const { initDashboard } = this.props;

        initDashboard();
    }

    _onDayChange = date => this.props.setDashboardDate(date);

    _prevDay = () => {
        const { setDashboardDate, date } = this.props;
        setDashboardDate(date.subtract(1, 'day'));
        this.setState({});
    };

    _nextDay = () => {
        const { setDashboardDate, date } = this.props;
        setDashboardDate(date.add(1, 'day'));
        this.setState({});
    };

    _onWeekChange = date =>
        this.props.setDashboardWeekDates({
            startDate: moment(date)
                .startOf('week')
                .isoWeekday(1),
            endDate: moment(date)
                .endOf('week')
                .isoWeekday(7),
        });

    _prevWeek = () => {
        const { setDashboardWeekDates, startDate, endDate } = this.props;
        setDashboardWeekDates({
            startDate: startDate.subtract(1, 'weeks'),
            endDate:   endDate.subtract(1, 'weeks'),
        });
    };

    _nextWeek = () => {
        const { setDashboardWeekDates, startDate, endDate } = this.props;

        setDashboardWeekDates({
            startDate: startDate.add(1, 'weeks'),
            endDate:   endDate.add(1, 'weeks'),
        });
    };

    _setDashboardMode = mode => this.props.setDashboardMode(mode);

    render() {
        const {
            orders,
            startDate,
            endDate,
            date,
            mode,
            load,
            days,
            stations,
            schedule,
            spinner,
            time,
            dashboard,
            dashboardGridColumns,
        } = this.props;

        return !spinner ? (
            <Layout
                // paper={ false }
                title={ <FormattedMessage id='dashboard-page.title' /> }
                description={
                    <FormattedMessage id='dashboard-page.description' />
                }
            >
                <section className={ Styles.dashboardPage }>
                    <Tabs
                        tabBarExtraContent={
                            mode === 'calendar' ? (
                                <ArrowsWeekPicker
                                    startDate={ startDate }
                                    endDate={ endDate }
                                    onWeekChange={ this._onWeekChange }
                                    prevWeek={ this._prevWeek }
                                    nextWeek={ this._nextWeek }
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
                                spinner={ spinner }
                                orders={ orders }
                                stations={ stations }
                                days={ days }
                                mode={ mode }
                                load={ load }
                                schedule={ schedule }
                                time={ time }
                                dashboard={ dashboard }
                                dashboardGridColumns={ dashboardGridColumns }
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <FormattedMessage id='dashboard-page.stations_load' />
                            }
                            key='stations'
                        >
                            <DashboardContainer
                                spinner={ spinner }
                                orders={ orders }
                                stations={ stations }
                                days={ days }
                                mode={ mode }
                                load={ load }
                                schedule={ schedule }
                                time={ time }
                                dashboard={ dashboard }
                                dashboardGridColumns={ dashboardGridColumns }
                            />
                        </TabPane>
                    </Tabs>
                </section>
            </Layout>
        ) : (
            <Spinner spin={ spinner } />
        );
    }
}

export default DashboardPage;
