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
export default class AddLaborOrDetailToOrderModal extends Component {

    /** Use this if some modalProps are not initialized */
    defaultModalProps = {
        mode: modes.ADD,
    }

    /**
     * Handle submit depending on mode that is currently used
     */
    handleSubmit = (e) => {
        e.preventDefault();

        console.log("OK");

        // const {modalProps} = this.props;
        // const mode = _.get(modalProps, "mode", this.defaultModalProps.mode);
        
        // this.vehicleForm.validateFields((err) => {
        //     if (!err) {
        //         if(mode == modes.ADD) {
        //             this.props.createVehicle();
        //         } else if(mode == modes.EDIT) {
        //             const vehicleId = _.get(modalProps, "vehicleId");
        //             vehicleId && this.props.updateVehicle({vehicleId});
        //         }

        //         this.resetAllFormsAndCloseModal();
        //     } 
        // });
        
    };

    onClose = () => {
        // this.props.clearVehicleData();
        // this.vehicleForm && this.vehicleForm.resetFields();
        this.props.resetModal();

        // this.props.onClose && this.props.onClose();//Callback
    }

    /** Save ref to currently rendered form */
    // saveVehicleFormRef = (ref) => {
    //     this.vehicleForm = ref;
    // }

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
                    visible={ visible === MODALS.ADD_LABOR_OR_DETAIL_TO_ORDER }
                    onOk={ this.handleSubmit }
                    onCancel={ this.onClose }
                    title={
                        <div className={Styles.title}>
                           AddLaborOrDetailToOrderModal   
                        </div>
                    }
                >
                    Hello worlds
                    {/* <div style={{minHeight: '50vh'}}>
                        <ClientsTable />
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

                                    case modes.VIEW: return (
                                        <ViewVehicleForm
                                            getFormRefCB={this.saveVehicleFormRef}//Get form refference
                                            vehicleId={vehicleId}
                                        />
                                    );
                                
                                    default: return "Invalid mode provided, available modes are: EDIT, ADD, VIEW";
                                }
                            })()
                        }
                        
                    </div> */}
                </Modal>
            </div>
        );
    }
}
