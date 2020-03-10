// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Tabs, Button } from 'antd';
import moment from 'moment';
import withSizes from 'react-sizes';

// proj
import {
    initDashboard,
    dropDashboardOrder,
    linkToDashboardStations,
    setDashboardDate,
    setDashboardWeekDates,
    setDashboardMode,
    selectDasboardData,
    updateDashboardOrder,
    transferOutdateRepairs,
} from 'core/dashboard/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { permissions, isForbidden } from 'utils';

import { Layout, Spinner, Loader } from 'commons';
import { ArrowsWeekPicker, ArrowsDatePicker } from 'components';
import { DashboardContainer } from 'containers';
import { ConfirmRescheduleModal } from 'modals';

// own
import Styles from './styles.m.css';
const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    orders:                state.dashboard.orders.orders,
    mode:                  state.dashboard.mode,
    stations:              state.dashboard.stations,
    date:                  state.dashboard.date,
    startDate:             state.dashboard.startDate,
    endDate:               state.dashboard.endDate,
    schedule:              state.dashboard.schedule,
    days:                  state.dashboard.days,
    load:                  state.dashboard.load,
    daysWithConflicts:     state.dashboard.daysWithConflicts,
    stationsWithConflicts: state.dashboard.stationsWithConflicts,
    modal:                 state.modals.modal,

    spinner: state.ui.dashboardInitializing,
    loading: state.ui.dashboardFetching,
    user:    state.auth,

    ...selectDasboardData(state),
});

const mapDispatchToProps = {
    initDashboard,
    dropDashboardOrder,
    setDashboardDate,
    setDashboardWeekDates,
    setDashboardMode,
    linkToDashboardStations,
    updateDashboardOrder,
    transferOutdateRepairs,
    setModal,
    resetModal,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
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

    _transferOutdateRepairs = () => this.props.transferOutdateRepairs();

    render() {
        const isMobile = window.innerWidth < 1200;
        const {
            startDate,
            endDate,
            date,
            mode,
            spinner,
            loading,
            user,
        } = this.props;

        const dashboardContainer = this._renderDashboardContainer();
        const rescheduleOrdersAllowed = !isForbidden(
            user,
            permissions.RESCHEDULE_ORDERS,
        );

        return spinner ? (
            <Spinner spin={ spinner } />
        ) : (
            <Layout
                // paper={ false }
                title={ <FormattedMessage id='dashboard-page.title' /> }
                description={
                    <FormattedMessage id='dashboard-page.description' />
                }
                controls={
                    rescheduleOrdersAllowed ? (
                        <Button
                            type='primary'
                            // onClick={ () => this._transferOutdateRepairs() }
                            onClick={ () =>
                                this.props.setModal(MODALS.CONFIRM_RESCHEDULE)
                            }
                        >
                            <FormattedMessage id='dashboard-page.transfer_outdated_repairs' />
                        </Button>
                    ) : (
                        <></>
                    )
                }
            >
                <section className={ Styles.dashboardPage }>
                    <Tabs
                        activeKey={ mode }
                        className={(isMobile ? Styles.dashboard_mobile_tabs : null)}
                        tabBarExtraContent={
                            (mode === 'calendar' && !isMobile) ? (
                                <ArrowsWeekPicker
                                    startDate={ startDate }
                                    endDate={ endDate }
                                    onWeekChange={ this._onWeekChange }
                                    prevWeek={ this._prevWeek }
                                    nextWeek={ this._nextWeek }
                                    loading={ loading }
                                />
                            ) : (
                                <ArrowsDatePicker
                                    startDate={ startDate }
                                    endDate={ endDate }
                                    onWeekChange={ this._onWeekChange }
                                    date={ date }
                                    onDayChange={ this._onDayChange }
                                    prevDay={ this._prevDay }
                                    nextDay={ this._nextDay }
                                    loading={ loading }
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
                            disabled={ loading }
                        >
                            { dashboardContainer }
                        </TabPane>
                        <TabPane
                            tab={
                                <FormattedMessage id='dashboard-page.stations_load' />
                            }
                            key='stations'
                            disabled={ loading }
                        >
                            { dashboardContainer }
                        </TabPane>
                    </Tabs>
                </section>
            </Layout>
        );
    }

    _renderDashboardContainer = () => {
        const {
            loading,
            orders,
            mode,
            load,
            days,
            stations,
            schedule,
            time,
            dashboard,
            linkToDashboardStations,
            updateDashboardOrder,
            date,
            user,
            daysWithConflicts,
            stationsWithConflicts,
        } = this.props;
        return loading ? (
            <Loader loading={ loading } />
        ) : (
            <>
                <DashboardContainer
                    user={ user }
                    mode={ mode }
                    date={ date }
                    days={ days }
                    stations={ stations }
                    orders={ orders }
                    load={ load }
                    schedule={ schedule }
                    time={ time }
                    dashboard={ dashboard }
                    linkToDashboardStations={ linkToDashboardStations }
                    updateDashboardOrder={ updateDashboardOrder }
                    daysWithConflicts={ daysWithConflicts }
                    stationsWithConflicts={ stationsWithConflicts }
                />
                <ConfirmRescheduleModal
                    // wrappedComponentRef={ this.saveFormRef }
                    visible={ this.props.modal }
                    confirm={ this._transferOutdateRepairs }
                    reset={ this.props.resetModal }
                />
            </>
        );
    };
}

export default DashboardPage;
