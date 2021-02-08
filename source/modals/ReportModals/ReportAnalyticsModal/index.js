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
    updateAnalytics,
    changeCurrentForm,
    fetchAnalyticsCatalogs
} from 'core/forms/reportAnalyticsForm/duck';
import {fetchReportAnalytics} from 'core/reports/reportAnalytics/duck';

// own
import Styles from './styles.m.css';

const TPane = Tabs.TabPane;

const mapStateToProps = state => ({
    currentForm: state.forms.reportAnalyticsForm.currentForm, //Current active analytics form
    analyticsCatalogsLoading: state.forms.reportAnalyticsForm.analyticsCatalogsLoading,
    analyticsCatalogs: state.forms.reportAnalyticsForm.analyticsCatalogs,

    modalProps: state.modals.modalProps,
});

const mapDispatchToProps = {
    setModal,
    resetModal,

    createAnalytics,
    updateAnalytics,
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

    //Use this if some modalProps are not initialized
    defaultModalProps = {
        analyticsEntity: {},
        mode: formModes.ADD,
        initialTab: formKeys.catalogForm
    }

    constructor(props) {
        super(props);

        //Set view to initial tab
        const {initialTab = this.defaultModalProps.initialTab} = this.props.modalProps;
        initialTab && this.props.changeCurrentForm(initialTab);

        //Initialize analytics catalogs for this modal
        this.props.fetchAnalyticsCatalogs();

        //Binds
        this.handleSubmit = this.handleSubmit.bind(this);
        this.saveCatalogFormRef = this.saveCatalogFormRef.bind(this);
        this.saveAnalyticsFormRef = this.saveAnalyticsFormRef.bind(this);
        this.analyticsRequest = this.analyticsRequest.bind(this)
    }

    componentDidUpdate(prevProps) {
        const {initialTab} = this.props.modalProps;

        //If modal was reopened(with new initialTab) we need to swith to new a tab if it is not undefined
        (initialTab && prevProps.modalProps.initialTab != initialTab) && this.props.changeCurrentForm(initialTab);
    }

    /**
     * This is used to send appropriate request to the server
     * analyticsId - is used if you want to update existing analytics
     * analyticsEntity - new analytics to be created or updated
     * @param {Object} param0 
     */
    analyticsRequest = ({analyticsId, analyticsEntity}) => {

        const {
            createAnalytics,
            updateAnalytics,
            modalProps
        } = this.props;

        const {mode = this.defaultModalProps.mode} = modalProps;

        if(mode == formModes.ADD) {
            createAnalytics({analyticsEntity});
        } else if(mode == formModes.EDIT) {
            updateAnalytics({analyticsId, newAnalyticsEntity: analyticsEntity})
        }
        
        //Reset fields
        this.analyticsForm && this.analyticsForm.resetFields();
        this.catalogForm && this.catalogForm.resetFields();

        //Finishing touches
        this.props.fetchReportAnalytics();
        this.props.resetModal();
    }

    handleSubmit(e) {
        e.preventDefault();

        const {
            currentForm,
            modalProps
        } = this.props;

        const {
            mode = this.defaultModalProps.mode,
            analyticsEntity = this.defaultModalProps.analyticsEntity, //Used only in EDIT or VIEW mode,
        } = modalProps;

        //Do nothing for view mode except resetting all
        if(mode == formModes.VIEW) {
            this.analyticsForm && this.analyticsForm.resetFields();
            this.catalogForm && this.catalogForm.resetFields();
            this.props.resetModal();
        }

        //Select an appropriate form to proceed and submit a request appropriately
        if(currentForm == formKeys.catalogForm && this.catalogForm) {
            //Create new analytics catalog
            this.catalogForm.validateFields((err, values) => {
                if (!err) {
                    let newAnalyticsEntity = {
                        level: analyticsLevels.catalog,
                        name: values.catalogName
                    }
    
                    this.analyticsRequest({analyticsEntity: newAnalyticsEntity});
                } 
            });
        } else if(currentForm == formKeys.analyticsForm && this.analyticsForm) {
            //Create new analytics in an specific catalog
            this.analyticsForm.validateFields((err, values) => {
                if (!err) {
                    let newAnalyticsEntity = {
                        level: analyticsLevels.analytics,
                        name: values.analyticsName,
    
                        parentId: values.catalogId,
                        bookkeepingAccount: values.bookkeepingAccount,
                        orderType: values.orderType
                    }
    
                    this.analyticsRequest({analyticsId: analyticsEntity.analyticsId, analyticsEntity: newAnalyticsEntity});
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
            
            modalProps,
            fetchAnalyticsCatalogs
        } = this.props;

        const {
            mode = this.defaultModalProps.mode, //Can be "EDIT", "VIEW", "ADD", default ADD,
            analyticsEntity = this.defaultModalProps.analyticsEntity, //Used only in EDIT or VIEW mode,
        } = modalProps;

        return (
            <Modal
                width={ '80%' }
                visible={ visible === MODALS.REPORT_ANALYTICS }
                onOk={ this.handleSubmit }
                onCancel={ onCancel }
                title={
                    <div className={Styles.title}>
                        {
                            (mode == formModes.ADD)
                            ? "Create analytics"
                            : (
                                (mode ==formModes.EDIT)
                                ? "Edit analytics"
                                : "Analytics"
                            )
                        }
                    </div>
                }
            >
                <div style={{minHeight: '50vh'}}>
                    <Tabs
                        tabPosition='left'
                        tabBarStyle={{width: '20%'}}
                        activeKey={currentForm}
                        onChange={(activeKey) => {
                            //Don't change tab if we are in EDIT or in VIEW mode, it must be specified and locked
                            if(mode == formModes.ADD) {
                                //When analyticsTab is opened force updating some fields
                                (activeKey == formKeys.analyticsForm) && fetchAnalyticsCatalogs();
                                changeCurrentForm(activeKey);
                            }
                        }}
                    >
                        <TPane tab="Create catalog" key={formKeys.catalogForm}>
                            <ReportAnalyticsCatalogForm
                                getFormRefCB={this.saveCatalogFormRef}//Get form refference
                                analyticsEntity={analyticsEntity}
                                mode={mode}
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
