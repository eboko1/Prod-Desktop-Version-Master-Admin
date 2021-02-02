// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Form, Button, Col, Row, Checkbox, Radio, Tabs, Input, Select } from 'antd';

// proj
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { ReportAnalyticsForm, ReportAnalyticsCatalogForm } from 'forms';
import {
    formKeys,
    analyticsLevels,

    createAnalytics,
    changeCurrentForm,
    fetchAnalyticsCatalogs
} from 'core/forms/reportAnalyticsForm/duck';
import {fetchReportAnalytics} from 'core/reports/reportAnalytics/duck';

// own
import Styles from './styles.m.css';

const FItem = Form.Item;
const RGroup = Radio.Group;
const CGroup = Checkbox.Group;
const TPane = Tabs.TabPane;

const mapStateToProps = state => ({
    currentForm: state.forms.reportAnalyticsForm.currentForm, //Current active analytics form
    analyticsCatalogs: state.forms.reportAnalyticsForm.analyticsCatalogs
});

const mapDispatchToProps = {
    setModal,
    resetModal,

    createAnalytics,
    changeCurrentForm,
    fetchAnalyticsCatalogs,
    fetchReportAnalytics
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ReportAnalyticsModal extends Component {
    constructor(props) {
        super(props);

        //Initialize analytics catalogs for this modal
        console.log("Func:", this.props.fetchAnalyticsCatalogs());
        this.props.fetchAnalyticsCatalogs();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.saveCatalogFormRef = this.saveCatalogFormRef.bind(this);
        this.saveAnalyticsFormRef = this.saveAnalyticsFormRef.bind(this);

    }

    handleSubmit(e) {
        e.preventDefault();

        const {
            currentForm,
            createAnalytics
        } = this.props;

        //Select an appropriate form to proceed and submit a request appropriately
        if(currentForm == formKeys.catalogForm && this.catalogForm) {
            //Create new analytics catalog
            this.catalogForm.validateFields((err, values) => {
                // if (!err) {
                //     console.log('Received values of catalogForm: ', values);
                // } else {
                //     console.log('Cannot submit, errors occured: ', err);
                // }

                let analyticsEntity = {
                    level: analyticsLevels.catalog,
                    name: values.catalogName
                }

                createAnalytics({analyticsEntity});
            });
        } else if(currentForm == formKeys.analyticsForm && this.analyticsForm) {
            //Create new analytics in an specific catalog
            this.analyticsForm.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of analyticsForm: ', values);
                } else {
                    console.log('Cannot submit, errors occured: ', err);
                }

                let analyticsEntity = {
                    level: analyticsLevels.analytics,
                    name: values.analyticsName,

                    parentId: values.catalogId,
                    bookkeepingAccount: values.bookkeepingAccount,
                    orderType: values.orderType
                }
                createAnalytics({analyticsEntity});
            });
        } else {
            console.log("Error, cannot detect current form or instance is missing");
        }

        //TODO clear fields

        this.props.fetchReportAnalytics();
        this.props.resetModal();
        
    };

    saveCatalogFormRef = (ref) => {
        this.catalogForm = ref;
        console.log(ref);
    }

    saveAnalyticsFormRef = (ref) => {
        this.analyticsForm = ref;
        console.log(ref);
    }

    render() {

        const {
            currentForm,
            analyticsCatalogs,
            changeCurrentForm,

            visible,
            onCancel,

            fetchAnalyticsCatalogs
        } = this.props;

        return (
            <Modal
                width={ '80%' }
                visible={ visible === MODALS.REPORT_ANALYTICS }
                onOk={ this.handleSubmit }
                onCancel={ onCancel }
                title={<div className={Styles.title}>Create analytics</div>}
                style={{height: '90vh'}}
            >
                <button onClick={fetchAnalyticsCatalogs}>Press</button>

                <Tabs tabPosition='left' tabBarStyle={{width: '20%'}} activeKey={currentForm} onChange={activeKey => changeCurrentForm(activeKey)}>
                    <TPane tab="Create catalog" key={formKeys.catalogForm}>
                        <ReportAnalyticsCatalogForm
                            getFormRefCB={this.saveCatalogFormRef}//Get form refference
                        />
                    </TPane>
                    <TPane  tab="Create analytics" key={formKeys.analyticsForm}>
                        <ReportAnalyticsForm
                            getFormRefCB={this.saveAnalyticsFormRef}//Get form refference
                            analyticsCatalogs={analyticsCatalogs}
                        />
                    </TPane>
                </Tabs>
            </Modal>
        );
    }
}
