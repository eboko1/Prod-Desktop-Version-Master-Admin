// vendor
import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Radio, Table } from "antd";
import { connect } from "react-redux";
import _ from "lodash";
import { v4 } from 'uuid';

// proj
import { Catcher, Loader } from "commons";
import { setModal, resetModal, MODALS } from "core/modals/duck";
import { AddClientModal } from 'modals';

//own
import { columnsConfig } from "./callsTableConfig.js";
import Styles from "./styles.m.css";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const mapStateToProps = state => ({
    modal: state.modals.modal,
});

const mapDispatchToProps = {
    setModal,
    resetModal,
}

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class CallsTable extends Component {
    _setCallsTableFilterMode = mode => {
        this.props.setCallsTableMode(mode);
        this.props.fetchCalls();
    };

    /**
     * When "Create new client" button is pressed we have to open creating modal 
     */
     onAddClientModal = () => {
        this.props.setModal(MODALS.ADD_CLIENT);
    }

    render() {
        const {
            calls,
            stats,
            filter,
            callsFetching,
            fetchRecordingLink,
            callsLinksCache,
        } = this.props;

        const columns = columnsConfig({
            fetchRecordingLink,
            callsLinksCache,
            onAddClientModal: this.onAddClientModal
        });

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

                <AddClientModal
                    visible={this.props.modal}
                    resetModal={this.props.resetModal}
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
