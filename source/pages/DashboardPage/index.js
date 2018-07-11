// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Tabs } from 'antd';

// proj
import { Layout } from 'commons';
import { Dashboard } from 'containers';
import { ArrowsWeekPicker, ArrowsDatePicker } from 'components';

// own
import Styles from './styles.m.css';
const TabPane = Tabs.TabPane;

class DashboardPage extends Component {
    state = { mode: 'calendar' };

    _setDashboardMode = mode => this.setState({ mode });

    render() {
        const { mode } = this.state;

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
                                <ArrowsWeekPicker />
                            ) : (
                                <ArrowsDatePicker />
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
                            <Dashboard />
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
