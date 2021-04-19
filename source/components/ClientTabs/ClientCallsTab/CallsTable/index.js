// vendor
import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Table } from "antd";
import _ from "lodash";
import { v4 } from 'uuid';

// proj
import { Catcher, Loader } from "commons";
import {
    fetchCalls,
    setCallsPageFilter,
    selectCallsData,
    selectCallsFilter,
    selectCallsStats,
    fetchRecordingLink,
    selectCallsLinksCache
} from "core/calls/duck";

//own
import { columnsConfig } from "./config.js";
import Styles from "./styles.m.css";

const mapStateToProps = state => {
    return {
        calls: selectCallsData(state),
        stats: selectCallsStats(state),
        filter: { ...selectCallsFilter(state) },
        callsLinksCache: selectCallsLinksCache(state),
        callsFetching:     state.ui.callsFetching,
    };
};

const mapDispatchToProps = {
    fetchCalls,
    setCallsPageFilter,
    fetchRecordingLink,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class CallsTable extends Component {
    render() {
        const {
            calls,
            stats,
            filter,
            intl: { formatMessage },
            callsFetching,
            fetchRecordingLink,
            callsLinksCache,
        } = this.props;

        const columns = columnsConfig({
            formatMessage,
            fetchRecordingLink,
            callsLinksCache
        });

        const pagination = {
            pageSize: 25,
            size: "small",
            total: Math.ceil(_.get(stats, "total") / 25) * 25,
            current: filter.page,
            onChange: page => {
                this.props.setCallsPageFilter(page);
                this.props.fetchCalls();
            },
        };

        return callsFetching ? (
            <Loader loading={callsFetching} />
        ) : (
            <Catcher>
                <Table
                    size="small"
                    className={Styles.table}
                    columns={columns}
                    dataSource={calls}
                    loading={callsFetching}
                    locale={{
                        emptyText: <FormattedMessage id="no_data" />,
                    }}
                    pagination={pagination}
                    scroll={{ x: 1080 }}
                    rowKey={() => v4()}
                />
            </Catcher>
        );
    }
}
