// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import moment from 'moment';

// proj
import {
    initDashboard,
    fetchDashboard,
    dropDashboardOrder,
    setDashboardDate,
    setDashboardWeekDates,
    setDashboardMode,
} from 'core/dashboard/duck';

import { Layout, Spinner } from 'commons';
import { ArrowsWeekPicker, ArrowsDatePicker, Board } from 'components';
import { DashboardContainer } from 'containers';

// own
import Styles from './styles.m.css';
const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    orders:    state.dashboard.orders,
    mode:      state.dashboard.mode,
    stations:  state.dashboard.stations,
    date:      state.dashboard.date,
    startDate: state.dashboard.startDate,
    endDate:   state.dashboard.endDate,
    schedule:  state.dashboard.schedule,
    spinner:   state.ui.get('dashboardFetching'),
});

const mapDispatchToProps = {
    initDashboard,
    fetchDashboard,
    dropDashboardOrder,
    setDashboardDate,
    setDashboardWeekDates,
    setDashboardMode,
};

@connect(mapStateToProps, mapDispatchToProps)
class DashboardPage extends Component {
    componentDidMount() {
        const {
            initDashboard,
            fetchDashboard,
            setDashboardDate,
            date,
            startDate,
            mode,
        } = this.props;

        const stations = mode !== 'calendar';

        initDashboard({ stations, beginDate: startDate });
    }

    _onDayChange = date => this.props.setDashboardDate(date);

    _prevDay = () => {
        this.props.setDashboardDate(this.props.date.subtract(1, 'day'));
        this.setState({});
    };

    _nextDay = () => {
        this.props.setDashboardDate(this.props.date.add(1, 'day'));
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
        this.props.setDashboardWeekDates({
            startDate: this.props.startDate.subtract(1, 'weeks'),
            endDate:   this.props.endDate.subtract(1, 'weeks'),
        });
        this.setState({});
    };

    _nextWeek = () => {
        this.props.setDashboardWeekDates({
            startDate: this.props.startDate.add(1, 'weeks'),
            endDate:   this.props.endDate.add(1, 'weeks'),
        });
        this.setState({});
    };

    _setDashboardMode = mode => this.props.setDashboardMode(mode);

    render() {
        const {
            startDate,
            endDate,
            date,
            mode,
            stations,
            schedule,
            spinner,
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
                                stations={ stations }
                                mode={ this.props.mode }
                                schedule={ this.props.schedule }
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <FormattedMessage id='dashboard-page.stations_load' />
                            }
                            key='stations'
                        >
                            <DashboardContainer
                                stations={ stations }
                                mode={ mode }
                                schedule={ schedule }
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
