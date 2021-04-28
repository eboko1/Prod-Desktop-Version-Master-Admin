// vendor
import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Radio, Table } from "antd";
import _ from "lodash";
import { v4 } from 'uuid';

// proj
import { Catcher, Loader } from "commons";

//own
import { columnsConfig } from "./callsTableConfig.js";
import Styles from "./styles.m.css";
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@injectIntl
export default class CallsTable extends Component {
    _setCallsTableFilterMode = mode => {
        this.props.setCallsTableMode(mode);
        this.props.fetchCalls();
    };

    render() {
        const {
            calls,
            stats,
            filter,
            callsFetching,
            fetchRecordingLink,
            callsLinksCache,
        } = this.props;

        const columns = columnsConfig({ fetchRecordingLink, callsLinksCache });

        const pagination = {
            pageSize: 25,
            size: "small",
            total: Math.ceil(_.get(stats, "total") / 25) * 25,
            hideOnSinglePage: true,
            current: filter.page,
            onChange: page => {
                this.props.setCallsPageFilter(page);
                this.setState({ visiblePhones: [] });
                this.props.fetchCalls();
            },
        };

        const callsTableControls = this._renderCallsTableControls();

        return callsFetching ? (
            <Loader loading={callsFetching} />
        ) : (
            <Catcher>
                {callsTableControls}
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

    _renderCallsTableControls = () => {
        const { filter } = this.props;

        return (
            <RadioGroup value={filter.mode}>
                <RadioButton
                    value="answered"
                    onClick={() => this._setCallsTableFilterMode("answered")}
                >
                    <FormattedMessage id="calls-table.answered" />
                </RadioButton>
                <RadioButton
                    value="missed"
                    onClick={() => this._setCallsTableFilterMode("missed")}
                >
                    <FormattedMessage id="calls-table.missed" />
                </RadioButton>
            </RadioGroup>
        );
    };
}
