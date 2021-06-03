// vendor
import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Tabs } from "antd";

// proj
import {
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
        filter: { ...selectCallsFilter(state) },
        callsChartFetching: state.ui.callsChartFetching,
        callsLinksCache: selectCallsLinksCache(state),
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
        if (tab === "callsTable") {
            this.props.setCallsTab("callsTable");
            this.props.fetchCalls();
        }
        if (tab === "callsChart") {
            this.props.setCallsTab("callsChart");
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
            fetchCallsChart,
            callsChartFetching,
            callsFetching,
            fetchRecordingLink,
            callsLinksCache,
        } = this.props;

        return (
            <Catcher>
                <Tabs type="cards" onTabClick={tab => this._handleTab(tab)}>
                    <TabPane
                        tab={formatMessage({
                            id: "calls-page.statistics",
                        })}
                        key="callsChart"
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
                    <TabPane
                        tab={formatMessage({
                            id: "calls-page.calls",
                        })}
                        key="callsTable"
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
                </Tabs>
            </Catcher>
        );
    }
}
