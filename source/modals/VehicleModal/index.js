// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal } from 'antd';
import _ from "lodash";

// proj
import { resetModal, MODALS, selectModal, selectModalProps } from 'core/modals/duck';
import {
    modes,
    createVehicle,
    updateVehicle,
    clearVehicleData,
    setClientId,

    selectFields,
    selectMakes,
    selectModels,
    selectModifications,
} from './redux/duck';

// own
import Styles from './styles.m.css';
import { AddVehicleForm, EditVehicleForm, ViewVehicleForm} from './Forms';

const mapStateToProps = state => ({
    modalProps:    selectModalProps(state),
    visible:       selectModal(state),

    fields:         selectFields(state),
    makes:          selectMakes(state),
    models:         selectModels(state),
    modifications:  selectModifications(state),
});

const mapDispatchToProps = {
    createVehicle,
    updateVehicle,
    clearVehicleData,
    setClientId,
    resetModal,
};

/**
 * This modal is self sufficient component(but it can be used with callbacks).
 * It takes a few parameters to work with and then it fetches, proceed and sends all data automatically(you can disable autoSubmit).
 * This component has three modes, each mode takes its must_have parameters(depending on a selected mode).
 * This modal uses default carbook modals "wizard", you have to call setModal(MODAL.MY_MODAL, {...modalProps}).
 * 
 * @property { string } modalProps.mode                - this defines i which mode modal is running, dependinr on this parameter different forms are shown. Available one of: "ADD", "EDIT", "VIEW".
 * @property { number|string } [ modalProps.clientId ] - used only if you are in "ADD" mode, initial clientId
 * @property { number|string } modalProps.vehicleId    - Used to fetch data about vehicle in "EDIT" and "VIEW" mode
 * @property { number|string } [ modalProps.autoSubmit = true ]   - Whenever you want a modal to create or update vehicle automatically when submit pressed
 * 
 * @property { Function() } [ modalProps.onClose ]                - callback function, called when modal closes(after cancel or submit)
 * @property { Function({ vehicle }) } [ modalProps.onSubmit ]    - callback function, called when submit button was pressed and validations passed
 * 
 * @example <caption>Open in "ADD" mode, used to add a new vehicle</caption>
 * this.props.setModal(MODALS.VEHICLE, {mode: "ADD"});
 * //...
 * render = () => (<VehicleModal />);
 * 
 * @example <caption>Open in "EDIT" mode, used to edit an existing vehicle</caption>
 * this.props.setModal(MODALS.VEHICLE, {mode: "EDIT", vehicleId});
 * //...
 * render = () => (<VehicleModal />);
 * 
 * @example <caption>Open in "VIEW" mode, used just to view an vehicle</caption>
 * this.props.setModal(MODALS.VEHICLE, {mode: "VIEW", vehicleId});
 * //...
 * render = () => (<VehicleModal />);
 */
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehicleModal extends Component {

    /** Use this if some modalProps are not initialized */
    defaultModalProps = {
        mode: modes.ADD,
        autoSubmit: true, // Automatically create or update vehicle
    }

    /**
     * Handle submit depending on mode that is currently used
     */
    handleSubmit = (e) => {
        e.preventDefault();

        const {modalProps} = this.props;
        const mode = _.get(modalProps, "mode", this.defaultModalProps.mode);
        const autoSubmit = _.get(modalProps, "autoSubmit", this.defaultModalProps.autoSubmit);
        
        this.vehicleForm.validateFields((err) => {
            if (!err) {
                if(autoSubmit) {
                    switch (mode) {
                        case modes.ADD:
                            this.props.createVehicle();
                            break;

                        case modes.EDIT:
                            const vehicleId = _.get(modalProps, "vehicleId");
                            vehicleId && this.props.updateVehicle({vehicleId});
                            break;
                    }
                }

                this.handleSubmitCallback();
                this.resetAllFormsAndCloseModal();
            } 
        });
    };

    /**
     * Handle submitting callback function, used to provide vehicle back to the caller object
     */
    handleSubmitCallback = () => {
        const {
            fields,
            makes,
            models,
            modifications,
            modalProps,
        } = this.props;

        const { makeId, modelId, modificationId } = fields;

        const onSubmit = _.get(modalProps, 'onSubmit');
        const makeName = _.get(_.filter(makes, obj => obj.id == makeId), '[0].name');
        const modelName = _.get(_.filter(models, obj => obj.id == modelId), '[0].name');
        const modificationName = _.get(_.filter(modifications, obj => obj.id == modificationId), '[0].name');

        //Vehicle object
        const vehicle = {
            makeId: fields.makeId,
            makeName: makeName,
            modelId: fields.modelId,
            modelName: modelName,
            modificationId: fields.modificationId,
            modificationName: modificationName,
            number: fields.number,
            vin: fields.vin,
            year: fields.year,
        };

        onSubmit && onSubmit({vehicle}); //Callback
    }

    /**
     * This is used to reset all form's fields, clear all fetched data and close modal
     */
    resetAllFormsAndCloseModal = () => {
        const {
            clearVehicleData,
            resetModal,
            setClientId,
            modalProps,
        } = this.props;
        clearVehicleData();
        this.vehicleForm && this.vehicleForm.resetFields();
        resetModal();
        setClientId({clientId: undefined}); //Reset

        const onClose = _.get(modalProps, 'onClose');

        onClose && onClose();//Callback
    }

    /** Save ref to currently rendered form */
    saveVehicleFormRef = (ref) => {
        this.vehicleForm = ref;
    }

    render() {

        const {
            visible,
            modalProps,
        } = this.props;

        const mode = _.get(modalProps, "mode", this.defaultModalProps.mode);
        const vehicleId = _.get(modalProps, "vehicleId");

        return (
            <div>
                <Modal
                    destroyOnClose={true}
                    width={ (mode == modes.VIEW)? '50%': '60%' }
                    visible={ visible === MODALS.VEHICLE }
                    onOk={ this.handleSubmit }
                    onCancel={ this.resetAllFormsAndCloseModal }
                    title={
                        <div className={Styles.title}>
                           {<FormattedMessage id='vehicle_page.title' />}   
                        </div>
                    }
                >
                    <div style={{minHeight: '40vh'}}>
                            {
                                (() => {
                                    switch (mode) {
                                        case modes.ADD: return (
                                            <div className={Styles.formContainer}>
                                                <AddVehicleForm
                                                    getFormRefCB={this.saveVehicleFormRef}//Get form refference
                                                />
                                            </div>
                                        );

                                        case modes.EDIT: return (
                                            <div className={Styles.formContainer}>
                                                <EditVehicleForm
                                                    getFormRefCB={this.saveVehicleFormRef}//Get form refference
                                                    vehicleId={vehicleId}
                                                />
                                            </div>
                                        );

                                        case modes.VIEW: return (
                                            <div className={Styles.formContainer}>
                                                <ViewVehicleForm
                                                    getFormRefCB={this.saveVehicleFormRef}//Get form refference
                                                    vehicleId={vehicleId}
                                                />
                                            </div>
                                        );
                                    
                                        default: return "Invalid mode provided, available modes are: EDIT, ADD, VIEW";
                                    }
                                })()
                            }
                    </div>
                </Modal>
            </div>
        );
    }
}
