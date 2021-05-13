// vendor
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Table } from "antd";
import _ from "lodash";

// proj
// import book from "routes/book";
import { DatePickerField } from "forms/_formkit";
import { ResponsiveView } from "commons";
import { BREAKPOINTS } from "utils";
// import { BREAKPOINTS, linkTo } from "utils";
import { clearCashOrderForm } from "core/forms/cashOrderForm/duck";
import { setModal, resetModal, MODALS } from "core/modals/duck";
import { ServiceInputModal, ServiceOutputModal, CashOrderModal } from 'modals';
import {
    fetchCashboxesBalance,
    setCashAccountingFilters,
    selectCashAccountingFilters,
    setCashOrdersFilters,
    openShift,
    closeShift,
    fetchXReport,
} from "core/cash/duck";


// own
import { columnsConfig } from "./config";
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    user:     state.auth,
    data:     state.cash.balance,
    filters:  selectCashAccountingFilters(state),
    modal: state.modals.modal,
    modalProps: state.modals.modalProps,
});

const mapDispatchToProps = {
    fetchCashboxesBalance,
    setCashAccountingFilters,
    setCashOrdersFilters,
    clearCashOrderForm,
    openShift,
    closeShift,
    fetchXReport,
    setModal,
    resetModal
};

@connect(mapStateToProps, mapDispatchToProps)
/**
 * Table shows balance on the cahbox at the specific date, also contains functionality to work with RST cashboxes.
 */
export class CashBalanceTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig({
            onOpenServiceInputModal:  this.onOpenServiceInputModal,
            onOpenServiceOutputModal: this.onOpenServiceOutputModal,
            onOpenCashOrderModal:     this.onOpenCashOrderModal,
            openShift:    props.openShift,
            closeShift:   props.closeShift,
            fetchXReport: props.fetchXReport,
            user:         props.user,
        });
    }

    componentDidMount() {
        this.props.fetchCashboxesBalance();
    }

    /**
     * Open modal to make service input into cashbox with RST
     * @param {*} cashboxId 
     */
	onOpenServiceInputModal = (cashboxId) => {
        this.props.setModal(MODALS.SERVICE_INPUT, {cashboxId});
    }

    /**
     * Open modal to make service output from cashbox with RST
     * @param {*} cashboxId 
     */
	onOpenServiceOutputModal = (cashboxId) => {
        this.props.setModal(MODALS.SERVICE_OUTPUT, {cashboxId});
    }

    /**
     * Open cash order modal to create new cash order
     * @param {*} param.cashboxId
     */
    onOpenCashOrderModal = ({cashboxId}) => {
        this.props.setModal(MODALS.CASH_ORDER, {
            cashOrderEntity: {
                cashBoxId: cashboxId,
            }
        });
    };

    onCloseCashOrderModal = () => {
        this.props.resetModal();
        this.props.clearCashOrderForm();
    };

    _handleDatePicker = date => {
        this.props.setCashAccountingFilters({ date });
        this.props.fetchCashboxesBalance();
    };

    //I commented it beacause it is very useful code to learn
    // _onRowClick = data => {
    //     const { filters, setCashOrdersFilters } = this.props;
    //     linkTo(book.cashFlowPage);
    //     setCashOrdersFilters({
    //         cashBoxId: data.id,
    //         startDate: "2019-01-01",
    //         endDate: filters.date.format("YYYY-MM-DD"),
    //     });
    // };

    render() {
        const {
            cashboxesFetching,
            data,
            filters,
			clearCashOrderForm,
			modalProps,
			modal
		} = this.props;

        return (
            <div className={Styles.tableWrapper}>
                <div className={Styles.tableHead}>
                    <ResponsiveView
                        view={{ min: BREAKPOINTS.xxl.min, max: null }}
                    >
                        <h3 className={Styles.tableHeadText}>
                            <FormattedMessage id="cash-table.leftovers" />
                        </h3>
                    </ResponsiveView>
                    <DatePickerField
                        allowClear={false}
                        date={_.get(filters, "date")}
                        onChange={this._handleDatePicker}
                    />
                </div>

                <Table
                    className={Styles.table}
                    size="small"
                    columns={this.columns}
                    dataSource={data}
                    loading={cashboxesFetching}
                    pagination={false}
                    // onRow={record => ({
                    //     onClick: () => this._onRowClick(record),
                    // })}
                    locale={{
                        emptyText: <FormattedMessage id="no_data" />,
                    }}
                />

				<ServiceInputModal />
                <ServiceOutputModal />

                <CashOrderModal
                    resetModal={this.onCloseCashOrderModal}
                    visible={modal}
                    clearCashOrderForm={clearCashOrderForm}
                    modalProps={modalProps}
                />
            </div>
        );
    }
}
