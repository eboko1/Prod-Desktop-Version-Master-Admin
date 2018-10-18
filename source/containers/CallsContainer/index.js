// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Tabs } from 'antd';

// proj
import {
    fetchCalls,
    fetchCallsChart,
    setCallsChartMode,
    setCallsTableMode,
    setCallsPageFilter,
    selectCallsChartData,
    selectCallsPieData,
} from 'core/calls/duck';

import { Catcher } from 'commons';

import { CallsTable, CallsStatistics } from 'components';

// own
const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    calls:    state.calls.calls,
    stats:    state.calls.stats,
    pieStats: [ ...selectCallsPieData(state) ],
    chart:    [ ...selectCallsChartData(state) ],
    filter:   state.calls.filter,
});

const mapDispatchToProps = {
    fetchCalls,
    fetchCallsChart,
    setCallsChartMode,
    setCallsTableMode,
    setCallsPageFilter,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class CallsContainer extends Component {
    _fetchCallsTab = tab => {
        if (tab === 'callsTable') {
            // this.props.setCallsTableMode();
            this.props.fetchCalls();
        }
        if (tab === 'callsChart') {
            this.props.fetchCallsChart();
        }
    };

    /* eslint-enable complexity */
    render() {
        const {
            calls,
            chart,
            stats,
            pieStats,
            filter,
            intl: { formatMessage },
            fetchCalls,
            setCallsChartMode,
            setCallsTableMode,
            setCallsPageFilter,
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
                        <CallsStatistics
                            stats={ stats }
                            chart={ chart }
                            pieStats={ pieStats }
                            setCallsChartMode={ setCallsChartMode }
                        />
                    </TabPane>
                    <TabPane
                        tab={ formatMessage({
                            id: 'calls-page.calls',
                        }) }
                        key='callsTable'
                    >
                        <CallsTable
                            calls={ calls }
                            stats={ stats }
                            filter={ filter }
                            fetchCalls={ fetchCalls }
                            setCallsTableMode={ setCallsTableMode }
                            setCallsPageFilter={ setCallsPageFilter }
                        />
                    </TabPane>
                </Tabs>
            </Catcher>
        );
    }
}
