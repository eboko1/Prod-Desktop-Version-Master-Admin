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
import {Input, Button} from 'antd';
import _ from "lodash";

const Search = Input.Search;

// proj
import {
    fetchReportAnalytics,
} from 'core/reports/reportAnalytics/duck';
import { ReportAnalyticsModal } from 'modals';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Layout, StyledButton } from "commons";
import { ReportOrdersTable, ReportOrdersFilter } from "components";

// own
import Styles from "./styles.m.css";
import AnalyticsDropdown from './AnalyticsDropdown';

const mapStateToProps = state => ({
    analytics: state.reportAnalytics.analytics,
    modal: state.modals.modal,
});

const mapDispatchToProps = {
    fetchReportAnalytics,
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

        this.onAnalyticsBtn = this.onAnalyticsBtn.bind(this);
        this.onAnalyticsModalCancel = this.onAnalyticsModalCancel.bind(this);
    }

    componentDidMount() {
        this.props.fetchReportAnalytics();
    }

    onAnalyticsBtn() {
        this.props.setModal(MODALS.REPORT_ANALYTICS);
    }

    onAnalyticsModalCancel() {
        this.props.resetModal();
    }

    
    render() {

        const {
            analytics,
            modal
        } = this.props;
        
        
        return (
            <Layout
                title={
                    <div>
                        Title
                    </div>
                }
                controls={
                    <div className={Styles.buttonGroup}>
                        <StyledButton type="primary">Reset all</StyledButton>
                        <StyledButton type="secondary" onClick={this.onAnalyticsBtn}>Create</StyledButton>
                    </div>
                }
                paper={false}
            >
                <AnalyticsDropdown analytics={analytics}/>

                <ReportAnalyticsModal 
                    visible={modal}
                    onCancel={this.onAnalyticsModalCancel}
                />
            </Layout>
        );
    }
}
