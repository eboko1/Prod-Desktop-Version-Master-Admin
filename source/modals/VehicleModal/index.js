// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal } from 'antd';
import _ from "lodash";

// proj
import { resetModal, MODALS, selectModal, selectModalProps } from 'core/modals/duck';
import { createVehicle, updateVehicle, clearVehicleData, modes } from 'core/forms/vehicleForm/duck';

// own
import Styles from './styles.m.css';
import { AddVehicleForm, EditVehicleForm, ViewVehicleForm} from './Forms';
import { ClientsTable } from './components';

const mapStateToProps = state => ({
    modalProps:    selectModalProps(state),
    visible:       selectModal(state)
});

const mapDispatchToProps = {
    createVehicle,
    updateVehicle,
    clearVehicleData,
    resetModal,
};

/**
 * This modal is self sufficient component. It takes few parameters to work with and then it fetches, proceed and sends all data automatically.
 * This component has three modes, each mode takes its must_have reuired parameters only(nothing more), depending on a selected mode.
 * This modal used default carbook modals "wizard", you have to call setModal(MODAL.MY_MODAL, {...modalProps}).
 * 
 * @property {string} modalProps.mode - this defines i which mode modal is running, dependinr on this parameter different forms are shown. Available one of: "ADD", "EDIT", "VIEW".
 * @property {number|string} [modalProps.clientId] - used only if you are in "ADD" mode, initial clientId
 * @property {number|string} modalProps.vehicleId - Used to fetch data about vehicle in "EDIT" and "VIEW" mode
 * @property {function onClose() } onClose - callback function, called when modal closes
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
    }

    /**
     * Handle submit depending on mode that is currently used
     */
    handleSubmit = (e) => {
        e.preventDefault();

        const {modalProps} = this.props;
        const mode = _.get(modalProps, "mode", this.defaultModalProps.mode);
        
        this.vehicleForm.validateFields((err) => {
            if (!err) {
                if(mode == modes.ADD) {
                    this.props.createVehicle();
                } else if(mode == modes.EDIT) {
                    const vehicleId = _.get(modalProps, "vehicleId");
                    vehicleId && this.props.updateVehicle({vehicleId});
                }

                this.resetAllFormsAndCloseModal();
            } 
        });
        
    };

    /**
     * This is used to reset all form's fields, clear all fetched data and close modal
     */
    resetAllFormsAndCloseModal = () => {
        this.props.clearVehicleData();
        this.vehicleForm && this.vehicleForm.resetFields();
        this.props.resetModal();

        this.props.onClose && this.props.onClose();//Callback
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
                    width={ (mode == modes.VIEW)? '50%': '80%' }
                    visible={ visible === MODALS.VEHICLE }
                    onOk={ this.handleSubmit }
                    onCancel={ this.resetAllFormsAndCloseModal }
                    title={
                        <div className={Styles.title}>
                           {<FormattedMessage id='vehicle_page.title' />}   
                        </div>
                    }
                >
                    <div style={{minHeight: '50vh'}}>
                            {
                                (() => {
                                    switch (mode) {
                                        case modes.ADD: return (
                                            <div>
                                                <ClientsTable />
                                                <div className={Styles.formContainer}>
                                                    <AddVehicleForm
                                                        getFormRefCB={this.saveVehicleFormRef}//Get form refference
                                                    />
                                                </div>
                                            </div>
                                        );

                                        case modes.EDIT: return (
                                            <div>
                                                <ClientsTable />
                                                <div className={Styles.formContainer}>
                                                    <EditVehicleForm
                                                        getFormRefCB={this.saveVehicleFormRef}//Get form refference
                                                        vehicleId={vehicleId}
                                                    />
                                                </div>
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
