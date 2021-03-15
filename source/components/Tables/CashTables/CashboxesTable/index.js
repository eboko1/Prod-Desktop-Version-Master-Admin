// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Table } from "antd";
import { v4 } from 'uuid'

// proj
import { permissions, isForbidden } from 'utils';
import {
    fetchCashboxes,
    deleteCashbox,
    openShift,
    closeShift,
    fetchXReport,
} from "core/cash/duck";

// own
import { columnsConfig } from "./config";

const mapStateToProps = state => ({
    cashboxes: state.cash.cashboxes,
    user: state.auth,
});

const mapDispatchToProps = {
    fetchCashboxes,
    deleteCashbox,
    openShift,
    closeShift,
    fetchXReport,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export class CashboxesTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig({
            deleteCashbox:      props.deleteCashbox,
            formatMessage:      props.intl.formatMessage,
            isCRUDForbidden:    isForbidden(props.user, permissions.ACCESS_CATALOGUE_CASH_CRUD),
            onOpenServiceInputModal: props.onOpenServiceInputModal,
            openShift: props.openShift,
            closeShift: props.closeShift,
            fetchXReport: props.fetchXReport,
        });
    }

    

    componentDidMount() {
        this.props.fetchCashboxes();
    }

    render() {
        const { cashboxesFetching, cashboxes, onOpenServiceInputModal } = this.props;

        //Temp
        this.columns = columnsConfig({
            deleteCashbox:      this.props.deleteCashbox,
            formatMessage:      this.props.intl.formatMessage,
            isCRUDForbidden:    false,
            onOpenServiceInputModal: onOpenServiceInputModal,
            openShift: this.props.openShift,
            closeShift: this.props.closeShift,
            fetchXReport: this.props.fetchXReport,
        });

        return (
            <Table
                size="small"
                columns={this.columns}
                dataSource={cashboxes}
                loading={cashboxesFetching}
                rowKey={() => v4()}
                pagination={false}
                locale={{
                    emptyText: <FormattedMessage id="no_data" />,
                }}
            />
        );
    }
}
