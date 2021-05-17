// vendor
import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Tabs } from "antd";

// proj
import {
    tabs,
    fetchCalls,
    fetchCallsChart,
    setCallsTab,
    setCallsChartMode,
    setCallsTableMode,
    setCallsPageFilter,
    selectCallsChartData,
    selectCallsPieData,
    selectCallsData,
    selectCallsFilter,
    selectCurrentTab,
    selectCallsStats,
    fetchRecordingLink,
    selectCallsLinksCache
} from "core/calls/duck";

import { Catcher } from "commons";

import { CallsTable, CallsStatistics } from "components";

// own
const TabPane = Tabs.TabPane;

const mapStateToProps = state => {
    return {
        calls: selectCallsData(state),
        stats: selectCallsStats(state),
        pieStats: [...selectCallsPieData(state)],
        chart: [...selectCallsChartData(state)],
        filter:             selectCallsFilter(state),
        currentTab:         selectCurrentTab(state),
        callsChartFetching: state.ui.callsChartFetching,
        callsLinksCache:    selectCallsLinksCache(state),
    };
};

const mapDispatchToProps = {
    fetchCalls,
    fetchCallsChart,
    setCallsTab,
    setCallsChartMode,
    setCallsTableMode,
    setCallsPageFilter,
    fetchRecordingLink,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class CallsContainer extends Component {
    _handleTab = tab => {
        if (tab === tabs.callsTable) {
            this.props.setCallsTab(tabs.callsTable);
            this.props.fetchCalls();
        }
        if (tab === tabs.callsChart) {
            this.props.setCallsTab(tabs.callsChart);
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
            currentTab,
            intl: { formatMessage },
            fetchCalls,
            setCallsChartMode,
            setCallsTableMode,
            setCallsPageFilter,
            fetchCallsChart,
            callsChartFetching,
            callsFetching,
            fetchRecordingLink,
            callsLinksCache,
        } = this.props;

        return (
            <Catcher>
                <Tabs activeKey={currentTab} type="cards" onTabClick={tab => this._handleTab(tab)}>
                <TabPane
                        tab={formatMessage({
                            id: "calls-page.calls",
                        })}
                        key={tabs.callsTable}
                    >
                        <CallsTable
                            calls={calls}
                            stats={stats}
                            filter={filter}
                            fetchCalls={fetchCalls}
                            setCallsTableMode={setCallsTableMode}
                            setCallsPageFilter={setCallsPageFilter}
                            callsFetching={callsFetching}
                            fetchRecordingLink={fetchRecordingLink}
                            callsLinksCache={callsLinksCache}
                        />
                    </TabPane>

                    <TabPane
                        tab={formatMessage({
                            id: "calls-page.statistics",
                        })}
                        key={tabs.callsChart}
                    >
                        <CallsStatistics
                            stats={stats}
                            chart={chart}
                            pieStats={pieStats}
                            setCallsChartMode={setCallsChartMode}
                            fetchCallsChart={fetchCallsChart}
                            callsChartFetching={callsChartFetching}
                        />
                    </TabPane>
                </Tabs>
            </Catcher>
        );
    }
}
