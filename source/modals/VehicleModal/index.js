// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal } from 'antd';
import _ from "lodash";

// proj
import { resetModal, MODALS, selectModal, selectModalProps } from 'core/modals/duck';
import {
    createVehicle,
    updateVehicle,
    clearVehicleData,
    modes,
} from 'core/forms/vehicleForm/duck';

// own
import Styles from './styles.m.css';
import { AddVehicleForm, EditVehicleForm} from './Forms';

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

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehicleModal extends Component {

    //Use this if some modalProps are not initialized
    defaultModalProps = {
        mode: modes.ADD,
    }

    /**
     * Handle submit depending on mode is currently used
     * @param {*} e Event
     */
    handleSubmit = (e) => {
        e.preventDefault();

        const {modalProps} = this.props;
        const mode = _.get(modalProps, "mode", this.defaultModalProps.mode);
        
        this.vehicleForm.validateFields((err, values) => {
            if (!err) {
                console.log("OK: ", values);

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

    resetAllFormsAndCloseModal = () => {
        this.props.clearVehicleData();
        this.vehicleForm && this.vehicleForm.resetFields();
        this.props.resetModal();

        this.props.onClose && this.props.onClose();//Callback
    }

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
                    width={ '80%' }
                    visible={ visible === MODALS.VEHICLE }
                    onOk={ this.handleSubmit }
                    onCancel={ this.resetAllFormsAndCloseModal }
                    title={
                        <div className={Styles.title}>
                            Title here
                        </div>
                    }
                >
                    <div style={{minHeight: '50vh'}}>
                        {
                            (() => {
                                switch (mode) {
                                    case modes.ADD: return (
                                        <AddVehicleForm
                                            getFormRefCB={this.saveVehicleFormRef}//Get form refference
                                        />
                                    );

                                    case modes.EDIT: return (
                                        <EditVehicleForm
                                            getFormRefCB={this.saveVehicleFormRef}//Get form refference
                                            vehicleId={vehicleId}
                                        />
                                    );
                                
                                    default: return "Invalid mode provided, available";
                                }
                            })()
                        }
                        
                    </div>
                </Modal>
            </div>
        );
    }
}
