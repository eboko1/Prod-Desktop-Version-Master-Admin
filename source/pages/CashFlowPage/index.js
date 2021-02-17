// vendor
import React, { Component } from "react";
import { Icon } from "antd";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import _ from "lodash";

// proj
import {
    setCashOrdersPage,
    fetchCashOrders,
    selectCashOrdersFilters,
    printCashOrder,
} from "core/cash/duck";
import { clearCashOrderForm } from "core/forms/cashOrderForm/duck";
import { setModal, resetModal, MODALS } from "core/modals/duck";

import { Layout, Paper, StyledButton } from "commons";
import { CashOrderModal } from "modals";
import { CashOrdersFiltersForm } from "forms";
import { CashOrdersTable } from "components";
import { isForbidden, permissions } from "utils";
import {formModes} from 'core/forms/reportAnalyticsForm/duck';
import { ReportAnalyticsModal } from 'modals';

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    collapsed: state.ui.collapsed,
    cashOrders: state.cash.cashOrders,
    stats: state.cash.stats,
    user: state.auth,
    modal: state.modals.modal,
    modalProps: state.modals.modalProps,
    filters: selectCashOrdersFilters(state),
    cashFlowFilters: _.get(state, "router.location.state.cashFlowFilters"),
    isFetching: state.ui.cashOrdersFetching,
});

const mapDispatchToProps = {
    setModal,
    resetModal,
    setCashOrdersPage,
    fetchCashOrders,
    clearCashOrderForm,
    printCashOrder,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class CashFlowPage extends Component {
    state = {
        cashOrderModalMounted: false,
    };

    componentDidMount() {
        this.props.fetchCashOrders(this.props.cashFlowFilters);

        if(this.props.location.state && this.props.location.state.showForm) this._onOpenCashOrderModal();
    }

    _onOpenCashOrderModal = () => {
        this.props.setModal(MODALS.CASH_ORDER, {
            cashOrderEntity: {
                cashBoxId: this.props.filters.cashBoxId,
            }
        });
        this.setState({ cashOrderModalMounted: true });
    };

    _onCloseCashOrderModal = () => {
        this.props.resetModal();
        this.props.clearCashOrderForm();
        this.setState({ cashOrderModalMounted: false });
    };

    _onOpenPrintCashOrderModal = cashOrderEntity => {
        this.props.setModal(MODALS.CASH_ORDER, {
            printMode: true,
            editMode: false,
            cashOrderEntity: cashOrderEntity,
        });
        this.setState({ cashOrderModalMounted: true });
    };

    _onOpenEditCashOrderModal = cashOrderEntity => {
        this.props.setModal(MODALS.CASH_ORDER, {
            editMode: true,
            printMode: false,
            cashOrderEntity: cashOrderEntity,
        });
        this.setState({ cashOrderModalMounted: true });
    };

    //When we want to open analytics modal from the inside of a cash order modal
    _onOpenReportAnalyticsModal = ({editMode, printMode, cashOrderEntity, cashBoxId}) => {
        //Save previous modal's props
        this.setState({
            prevModalProps: {editMode, printMode, cashOrderEntity, cashBoxId}
        });

        //Close current cash order modal
        this.props.resetModal();
        this.setState({ cashOrderModalMounted: false });

        //Open analytics modal
        this.props.setModal(MODALS.REPORT_ANALYTICS, {
            mode: formModes.ADD
        });
    };

    _onCloseReportAnallyticsModalEventHandler = () => {
        const {editMode, printMode, cashOrderEntity, cashBoxId} = (this.state && this.state.prevModalProps) || {};

        //Open cash order modal with old params depending on mode
        if(editMode) 
            this._onOpenEditCashOrderModal(cashOrderEntity);
        else if(!printMode)
            this._onOpenCashOrderModal();
    };

    render() {
        const {
            isFetching,
            collapsed,
            stats,
            modal,
            modalProps,
            setCashOrdersPage,
            clearCashOrderForm,
            cashOrders,
            filters,
            user,
            fetchCashOrders,
            printCashOrder,
        } = this.props;

        const canEditCashOrders = !isForbidden(
            user,
            permissions.EDIT_CASH_ORDERS,
        );
        
        return (
            <Layout
                title={<FormattedMessage id="navigation.flow_of_money" />}
                controls={
                    <div className={Styles.buttonGroup}>
                        <Icon
                            type="printer"
                            className={Styles.printIcon}
                            onClick={() => printCashOrder()}
                        />
                        <StyledButton
                            type="secondary"
                            onClick={() => this._onOpenCashOrderModal()}
                        >
                            <FormattedMessage id="add" />
                        </StyledButton>
                    </div>
                }
                paper={false}
            >
                <section
                    className={`${Styles.filters} ${collapsed &&
                        Styles.filtersCollapsed}`}
                >
                    <CashOrdersFiltersForm
                        stats={_.omit(stats, "totalCount")}
                        filters={filters}
                    />
                </section>
                <Paper className={Styles.content}>
                    <CashOrdersTable
                        totalCount={stats.totalCount}
                        setCashOrdersPage={setCashOrdersPage}
                        fetchCashOrders={fetchCashOrders}
                        cashOrders={cashOrders}
                        cashOrdersFetching={isFetching}
                        filters={filters}
                        openPrint={this._onOpenPrintCashOrderModal}
                        // eslint-disable-next-line no-empty-function
                        openEdit={
                            canEditCashOrders
                                ? this._onOpenEditCashOrderModal
                                : null
                        }
                    />
                </Paper>
                {this.state.cashOrderModalMounted ? (
                    <CashOrderModal
                        resetModal={this._onCloseCashOrderModal}
                        visible={modal}
                        clearCashOrderForm={clearCashOrderForm}
                        onOpenAnalyticsModal={this._onOpenReportAnalyticsModal}
                        modalProps={modalProps}
                    />
                ) : null}

                <ReportAnalyticsModal 
                    visible={modal}
                    onOkTrigger={this._onCloseReportAnallyticsModalEventHandler}
                    onCancelTrigger={this._onCloseReportAnallyticsModalEventHandler}
                />
            </Layout>
        );
    }
}
