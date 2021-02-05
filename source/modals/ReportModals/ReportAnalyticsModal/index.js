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
    formModes,

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
    analyticsCatalogsLoading: state.forms.reportAnalyticsForm.analyticsCatalogsLoading,
    analyticsCatalogs: state.forms.reportAnalyticsForm.analyticsCatalogs,
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

        const {modalProps = {}} = props;

        //Initialize default values and combine props from all sources
        this.state = {
            analyticsEntity: modalProps.analyticsEntity || props.analyticsEntity || {},
            mode: modalProps.mode || props.mode || formModes.ADD,
            initialTab: modalProps.initialTab || props.initialTab || undefined
        };

        //Set view to initial tab
        const {initialTab} = this.state;
        console.log("Here:", initialTab);
        initialTab && changeCurrentForm(initialTab);

        //Initialize analytics catalogs for this modal
        this.props.fetchAnalyticsCatalogs();

        //Binds
        this.handleSubmit = this.handleSubmit.bind(this);
        this.saveCatalogFormRef = this.saveCatalogFormRef.bind(this);
        this.saveAnalyticsFormRef = this.saveAnalyticsFormRef.bind(this);

    }

    handleSubmit(e) {
        e.preventDefault();

        const {
            currentForm,
            createAnalytics,
        } = this.props;

        const {mode} = this.state;

        //Do nothing for view mode except resetting all
        if(mode == formModes.VIEW) {
            this.analyticsForm && this.analyticsForm.resetFields();
            this.catalogForm && this.catalogForm.resetFields();
            this.props.resetModal();
        }

        const analyticsRequest = ({analyticsEntity}) => {
            createAnalytics({analyticsEntity});

            //Reset fields
            this.analyticsForm && this.analyticsForm.resetFields();
            this.catalogForm && this.catalogForm.resetFields();

            //Finishing touches
            this.props.fetchReportAnalytics();
            this.props.resetModal();
        }

        //Select an appropriate form to proceed and submit a request appropriately
        if(currentForm == formKeys.catalogForm && this.catalogForm) {
            //Create new analytics catalog
            this.catalogForm.validateFields((err, values) => {
                if (!err) {
                    let analyticsEntity = {
                        level: analyticsLevels.catalog,
                        name: values.catalogName
                    }
    
                    analyticsRequest({analyticsEntity});
                } 
            });
        } else if(currentForm == formKeys.analyticsForm && this.analyticsForm) {
            //Create new analytics in an specific catalog
            this.analyticsForm.validateFields((err, values) => {
                if (!err) {
                    let analyticsEntity = {
                        level: analyticsLevels.analytics,
                        name: values.analyticsName,
    
                        parentId: values.catalogId,
                        bookkeepingAccount: values.bookkeepingAccount,
                        orderType: values.orderType
                    }
    
                    analyticsRequest({analyticsEntity});
                }
            });
        } else {
            console.log("Error, cannot detect current form or instance is missing");
        }

        
        
    };

    saveCatalogFormRef = (ref) => {
        this.catalogForm = ref;
    }

    saveAnalyticsFormRef = (ref) => {
        this.analyticsForm = ref;
    }

    render() {

        const {
            currentForm,
            analyticsCatalogs,
            changeCurrentForm,
            analyticsCatalogsLoading,

            visible,
            onCancel,

            fetchAnalyticsCatalogs
        } = this.props;

        const {
            mode, //Can be "EDIT", "VIEW", "ADD", default ADD,
            analyticsEntity, //Used only in EDIT or VIEW mode(to edit or view analytics :3),
        } = this.state;

        console.log(this.state);
        console.log(this.props);

        return (
            <Modal
                width={ '80%' }
                visible={ visible === MODALS.REPORT_ANALYTICS }
                onOk={ this.handleSubmit }
                onCancel={ onCancel }
                title={<div className={Styles.title}>Create analytics</div>}
            >
                <div style={{minHeight: '50vh'}}>
                    <Tabs
                        tabPosition='left'
                        tabBarStyle={{width: '20%'}}
                        activeKey={currentForm}
                        onChange={(activeKey) => {
                            //Don't change tab if we are in EDIT or in VIEW mode, it must be specified and locked
                            if(mode == formModes.ADD) {
                                //When this tab is opened force updating some fields
                                (activeKey == formKeys.analyticsForm) && fetchAnalyticsCatalogs();
                                changeCurrentForm(activeKey);
                            }
                        }}
                    >
                        <TPane tab="Create catalog" key={formKeys.catalogForm}>
                            <ReportAnalyticsCatalogForm
                                getFormRefCB={this.saveCatalogFormRef}//Get form refference
                                analyticsEntity={analyticsEntity}
                            />
                        </TPane>
                        <TPane  tab="Create analytics" key={formKeys.analyticsForm}>
                            <ReportAnalyticsForm
                                getFormRefCB={this.saveAnalyticsFormRef}//Get form refference
                                analyticsCatalogs={analyticsCatalogs}
                                analyticsCatalogsLoading={analyticsCatalogsLoading}
                                mode={mode}
                                analyticsEntity={analyticsEntity}
                            />
                        </TPane>
                    </Tabs>
                </div>
            </Modal>
        );
    }
}
