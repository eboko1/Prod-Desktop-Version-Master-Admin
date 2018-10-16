// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Tabs } from 'antd';

// proj
import { fetchCalls, fetchCallsChart } from 'core/calls/duck';

import { Catcher } from 'commons';

import {
    CallsTable,
    CallsStatistics,
    CallsPieChart,
    CallsChart,
} from 'components';

// own
const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    calls:  state.calls.calls,
    filter: state.calls.filter,
});

const mapDispatchToProps = {
    fetchCalls,
    fetchCallsChart,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class CallsContainer extends Component {
    componentDidMount() {
        // this.props.fetchCalls();
    }

    _fetchCallsTab = tab => {
        if (tab === 'callsTable') {
            this.props.fetchCalls();
        }
        if (tab === 'callsChart') {
            this.props.fetchCallsChart();
        }
    };

    /* eslint-enable complexity */
    render() {
        const {
            intl: { formatMessage },
        } = this.props;

        return (
            <Catcher>
                <Tabs type='cards' onTabClick={ tab => this._fetchCallsTab(tab) }>
                    <TabPane
                        tab={ formatMessage({
                            id: 'calls-page.statistics',
                        }) }
                        key='callsChart'
                    >
                        <CallsStatistics />
                        <CallsChart />
                    </TabPane>
                    <TabPane
                        tab={ formatMessage({
                            id: 'calls-page.calls',
                        }) }
                        key='callsTable'
                    >
                        <CallsTable { ...this.props } />
                    </TabPane>
                </Tabs>
            </Catcher>
        );
    }
}
