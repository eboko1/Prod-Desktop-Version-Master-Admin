// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import _ from 'lodash';

// proj
import { MODALS, resetModal, setModal } from 'core/modals/duck';
import {fetchAnalytics} from "core/cash/duck";
import {formModes} from 'core/forms/reportAnalyticsForm/duck';
import { clearCashOrderForm } from "core/forms/cashOrderForm/duck";
import { ReportAnalyticsModal } from 'modals';
import { CashOrderForm } from 'forms';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    modal: state.modals.modal,
});

const mapDispatchToProps = {
    setModal,
    resetModal,
    fetchAnalytics,
    clearCashOrderForm
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class CashOrderModal extends Component {
    constructor(props) {
        super(props);

        this.reopenCashOrderModal = this.reopenCashOrderModal.bind(this);
        this._onOpenReportAnalyticsModal = this._onOpenReportAnalyticsModal.bind(this);
        this._onCloseReportAnallyticsModalEventHandler = this._onCloseReportAnallyticsModalEventHandler.bind(this);
        this._onCloseModal = this._onCloseModal.bind(this);
    }

    reopenCashOrderModal() {
        const {editMode, printMode, cashOrderEntity, cashBoxId, fromOrder} = (this.state && this.state.prevModalProps) || {};

        this.props.setModal(MODALS.CASH_ORDER, {
            cashBoxId: cashBoxId,
            editMode: editMode,
            printMode: printMode,
            fromOrder: fromOrder,
            cashOrderEntity: cashOrderEntity,
        });
    }

    //When we want to open analytics modal from the inside of a cash order modal
    _onOpenReportAnalyticsModal = ({editMode, printMode, cashOrderEntity, cashBoxId, fromOrder}) => {
        //Save previous modal's props
        this.setState({
            prevModalProps: {editMode, printMode, cashOrderEntity, cashBoxId, fromOrder}
        });

        //Close current cash order modal
        this.props.resetModal();

        //Open analytics modal
        this.props.setModal(MODALS.REPORT_ANALYTICS, {
            mode: formModes.ADD
        });
    };

    //Reopen cash order modal after analytics modal was closed, and pass parameters from previous state
    _onCloseReportAnallyticsModalEventHandler = () => {
        const {fetchAnalytics} = this.props;

        this.reopenCashOrderModal(); // Open cash order modal with old params depending on mode
        fetchAnalytics();// Reload analytics for this page because we added new one (this is used by filter)
    };

    _onCloseModal() {
        const {clearCashOrderForm, resetModal} = this.props;

        clearCashOrderForm();
        resetModal();
    }
    
    render() {
        const { visible, modalProps, cashOrderEntity, fetchOrder, modal} = this.props;
        const printMode = _.get(modalProps, 'printMode');
        const editMode = _.get(modalProps, 'editMode');
        const fromOrder = _.get(modalProps, 'fromOrder'); //Used when we open this modal from order page

        return (
            <>
                <Modal
                    className={ Styles.modal }
                    visible={ visible === MODALS.CASH_ORDER }
                    footer={ null }
                    onCancel={ this._onCloseModal }
                    destroyOnClose
                    maskClosable={false}
                >
                    <CashOrderForm
                        onCloseModal={ this.onCloseModal }
                        printMode={ printMode }
                        editMode={ editMode }
                        fromOrder={ fromOrder }
                        cashOrderEntity={ cashOrderEntity }
                        fetchOrder={ fetchOrder }
                        onOpenAnalyticsModal={this._onOpenReportAnalyticsModal}
                    />
                </Modal>
                <ReportAnalyticsModal 
                    visible={modal}
                    onOkTrigger={this._onCloseReportAnallyticsModalEventHandler}
                    onCancelTrigger={this._onCloseReportAnallyticsModalEventHandler}
                />
            </>
        );
    }
}
