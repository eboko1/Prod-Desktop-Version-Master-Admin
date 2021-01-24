// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal } from 'antd';

// proj
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { ReportOrdersFilterForm } from 'forms';

// own

const mapStateToProps = state => ({

});

const mapDispatchToProps = {
    setModal,
    resetModal,
};

const DEF_DATE_FORMAT = 'YYYY/MM/DD';

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ReportOrdersFilterModal extends Component {
    constructor(props) {
        super(props);

        this.onCreationFromDateChanged = this.onCreationFromDateChanged.bind(this);
        this.onCreationToDateChanged = this.onCreationToDateChanged.bind(this);
        this.onAppointmentFromDateChanged = this.onAppointmentFromDateChanged.bind(this);
        this.onAppointmentToDateChanged = this.onAppointmentToDateChanged.bind(this);
        this.onDoneFromDateChanged = this.onDoneFromDateChanged.bind(this);
        this.onDoneToDateChanged = this.onDoneToDateChanged.bind(this);
    }
    
    onCreationFromDateChanged(date) {
        this.props.setReportOrdersFilterCreationFromDate(date? date.format(DEF_DATE_FORMAT): undefined);
    }
    
    onCreationToDateChanged(date) {
        this.props.setReportOrdersFilterCreationToDate(date? date.format(DEF_DATE_FORMAT): undefined);
    }
    
    onAppointmentFromDateChanged(date) {
        this.props.setReportOrdersFilterAppointmentFromDate(date? date.format(DEF_DATE_FORMAT): undefined);
    }
    
    onAppointmentToDateChanged(date) {
        this.props.setReportOrdersFilterAppointmentToDate(date? date.format(DEF_DATE_FORMAT): undefined);
    }
    
    onDoneFromDateChanged(date) {
        this.props.setReportOrdersFilterDoneFromDate(date? date.format(DEF_DATE_FORMAT): undefined);
    }
    
    onDoneToDateChanged(date) {
        this.props.setReportOrdersFilterDoneToDate(date? date.format(DEF_DATE_FORMAT): undefined);
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };


    //This method casts data from form to format appropriate for server(and rest of a page components)
    normalizeValuesFromForm(oldValues) {

        const values = {...oldValues};

        values.creationFromDate = values.creationFromDate ? values.creationFromDate.format(DEF_DATE_FORMAT): undefined;
        values.creationToDate= values.creationToDate ? values.creationToDate.format(DEF_DATE_FORMAT): undefined;
        values.appointmentFromDate= values.appointmentFromDate ? values.appointmentFromDate.format(DEF_DATE_FORMAT): undefined;
        values.appointmentToDate= values.appointmentToDate ? values.appointmentToDate.format(DEF_DATE_FORMAT): undefined;
        values.doneFromDate= values.doneFromDate ? values.doneFromDate.format(DEF_DATE_FORMAT): undefined;
        values.doneToDate= values.doneToDate ? values.doneToDate.format(DEF_DATE_FORMAT): undefined;

        //Some values are redundant, we need to remove them
        values.creationDateRange = undefined;
        values.appointmentDateRange = undefined;
        values.doneDateRange = undefined;

        return values;
    }

    //When submit button was pressed
    //It converts and transfers data from form to state
    onFiltersSubmit() {
        if(this.formRef && this.formRef.props) {
            const {form} = this.formRef.props;
            const {onSubmit} = this.props;

            form.validateFields((err, values) => {
                if (err) {
                    return;
                }

                onSubmit(this.normalizeValuesFromForm(values));
                form.resetFields();
            });
        }
    }

    //It must be called when we need to reset filter form
    onFiltersClose() {
        if(this.formRef && this.formRef.props) {
            const {form} = this.formRef.props;
            form.resetFields();
        }
    }

    render() {

        const {
            visible,
            filter,
            resetModal,
            onCloseFilterModal,
            filterOptions,
        } = this.props;
        
        return (
            <Modal
                width={ '85%' }
                visible={ visible === MODALS.REPORT_ORDERS_FILTER }
                onOk={ () => {
                    this.onFiltersSubmit();
                    resetModal();
                } }
                onCancel={ () => {
                    this.onFiltersClose();
                    onCloseFilterModal();
                }}
                maskClosable={false}
            >
                <ReportOrdersFilterForm
                    filter={filter}
                    filterOptions={filterOptions}
                    wrappedComponentRef={this.saveFormRef}
                />
            </Modal>
        );
    }
}
