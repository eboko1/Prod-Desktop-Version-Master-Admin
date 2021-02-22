/*
Analytics is used to create report about different types of expenses.
This page has functionality to create, edit or delete them.
For example: We have a "Computers and other stuff like that" analytics, and want a report about how much money it costs for business per year,
all we have to do is to calculate all expenses which were marked with this analytics.

Release date: 28.01.2021;
Author: Anatolii Kotvytskyi;
*/

// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

// proj
import { ReportAnalyticsModal, ConfirmModal } from 'modals';
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { Layout, StyledButton } from "commons";
import {
    fetchReportAnalytics,
    deleteReportAnalytics,
    resetAllReportAnalytics,
} from 'core/reports/reportAnalytics/duck';
import { updateAnalytics } from 'core/forms/reportAnalyticsForm/duck';


// own
import Styles from "./styles.m.css";
import AnalyticsDropdown from './AnalyticsDropdown';

const mapStateToProps = state => ({
    analytics: state.reportAnalytics.analytics,
    modal: state.modals.modal,

    modalProps: state.modals.modalProps,
});

const mapDispatchToProps = {
    fetchReportAnalytics,
    deleteReportAnalytics,
    resetAllReportAnalytics,
    updateAnalytics,

    setModal,
    resetModal
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class ReportAnalyticsPage extends Component {
    constructor(props) {
        super(props);

        this.openAnalyticsModal = this.openAnalyticsModal.bind(this);
        this._onDeleteAnalytics = this._onDeleteAnalytics.bind(this);
        this.onOpenConfirm = this.onOpenConfirm.bind(this);
        this._onResettingAllAnalyticsConfirmed = this._onResettingAllAnalyticsConfirmed.bind(this);
        this.onResettingAllAnalyticsCanceled = this.onResettingAllAnalyticsCanceled.bind(this);
        this.onUpdateAnalytics = this.onUpdateAnalytics.bind(this);

    }

    componentDidMount() {
        this.props.fetchReportAnalytics();
    }
    
    openAnalyticsModal(mode, initialTab, analyticsEntity) {
        this.props.setModal(MODALS.REPORT_ANALYTICS, {mode, initialTab, analyticsEntity});
    }

    /**
     * Very danger zone, be carefull. If you will not provide correct analytics Id
     * you will receive error, if you want to reset all analytics(remove all) use anothe action
     * @param {int} analyticsId Analytics or analytics catalog Id
     */
    _onDeleteAnalytics(analyticsId) {
        const {deleteReportAnalytics} = this.props;

        analyticsId && deleteReportAnalytics(analyticsId); //Delete specific analytics
    }

    onOpenConfirm(e) {
        this.props.setModal(MODALS.CONFIRM, {});
    }

    _onResettingAllAnalyticsConfirmed() {
        this.props.resetAllReportAnalytics({areYouSureToDeleteAll: true})
        this.props.resetModal();
    }

    onResettingAllAnalyticsCanceled() {
        this.props.resetModal();
    }

    onUpdateAnalytics({analyticsId, newAnalyticsEntity}) {
        this.props.updateAnalytics({analyticsId, newAnalyticsEntity});
    }
    
    render() {

        const {
            analytics,
            modal,
            intl: {formatMessage}
        } = this.props;
        
        
        return (
            <Layout
                title={
                    <div>
                        <div><FormattedMessage id="navigation.report_analytics" /></div>
                    </div>
                }
                controls={
                    <div className={Styles.buttonGroup}>
                        <StyledButton type="primary" onClick={this.onOpenConfirm}><FormattedMessage id="report_analytics_page.reset_all" /></StyledButton>
                        <StyledButton type="secondary" onClick={() => this.openAnalyticsModal()/*Call with defaults*/}><FormattedMessage id="report_analytics_page.add" /></StyledButton>
                    </div>
                }
                paper={false}
            >
                <AnalyticsDropdown
                    analytics={analytics}
                    onDeleteAnalytics={this._onDeleteAnalytics}
                    openAnalyticsModal={this.openAnalyticsModal}
                    onUpdateAnalytics={this.onUpdateAnalytics}
                />

                <ConfirmModal
                    visible={modal}
                    title={formatMessage({id: 'report_analytics_page.confirm_dialog'})}
                    modalContent={formatMessage({id: 'report_analytics_page.confirm_dialog_content'})}
                    onOk={this._onResettingAllAnalyticsConfirmed}
                    onCancel={this.onResettingAllAnalyticsCanceled}
                />

                <ReportAnalyticsModal 
                    visible={modal}
                />
            </Layout>
        );
    }
}
