// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Tabs} from 'antd';
import _ from "lodash";

// proj
import { resetModal, MODALS, selectModal, selectModalProps } from 'core/modals/duck';
import {
    createVehicle,
    modes,
} from 'core/forms/vehicleForm/duck';

// own
import Styles from './styles.m.css';
import { AddVehicleForm, EditVehicleForm} from './Forms';

const TPane = Tabs.TabPane;

const mapStateToProps = state => ({
    currentForm:      state.forms.reportAnalyticsForm.currentForm, //Current active analytics form
    analyticsCatalogsLoading: state.forms.reportAnalyticsForm.analyticsCatalogsLoading,
    analyticsCatalogs:        state.forms.reportAnalyticsForm.analyticsCatalogs,

    modalProps:    selectModalProps(state),
    visible:       selectModal(state)
});

const mapDispatchToProps = {
    createVehicle,
    resetModal,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
/**
 */
export default class VehicleModal extends Component {

    //Use this if some modalProps are not initialized
    defaultModalProps = {
        mode: modes.ADD,
    }

    // updateVehicleData() {
    //     const {modalProps} = this.props;
    //     const {mode} = _.get(modalProps, "mode", this.defaultModalProps.mode);
    //     const vehicleId = _.get(modalProps, "vehicleId");

    //     if(mode == modes.EDIT) {
    //         this.props.fetchVehicle({vehicleId});
    //     }
        
    // }
    
    // componentDidUpdate(prevProps) {
    //     const prevModal = prevProps.visible;
    //     const currModal = this.props.visisble;

    //     //If modal was opened or reopened
    //     if(prevModal != currModal && currModal == MODALS.VEHICLE) {
    //         this.updateVehicleData();
    //     }
    // }

    /**
     * Handle submit depending on mode is currently used
     * @param {*} e Event
     */
    handleSubmit = (e) => {
        e.preventDefault();

        this.vehicleForm.validateFields((err, values) => {
            if (!err) {
                console.log("OK: ", values);
                this.props.createVehicle();
            } 
        });
        
    };

    onCancel = () => {
        this.props.resetModal();
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
        // console.log("Modal props: ", modalProps);
        // console.log("this props: ", this.props);

        return (
            <div>
                Hello
                <Modal
                    destroyOnClose={true}
                    width={ '80%' }
                    visible={ visible === MODALS.VEHICLE }
                    onOk={ this.handleSubmit }
                    onCancel={ this.onCancel }
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
                                            mode={mode}
                                        />
                                    );

                                    case modes.EDIT: return (
                                        <EditVehicleForm
                                            getFormRefCB={this.saveVehicleFormRef}//Get form refference
                                            mode={mode}
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
