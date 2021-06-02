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
    fetchOrders,
    selectOrders,
    setServices,
    addLaborToOrder,
    selectSelectedOrderId,
    setSelectedOrderId,
} from './redux/duck';

// own
import Styles from './styles.m.css';
import { OrdersTable } from './components';

const mapStateToProps = state => ({
    modalProps:    selectModalProps(state),
    visible:       selectModal(state),
    orders:        selectOrders(state),
    selectedOrderId: selectSelectedOrderId(state),
});

const mapDispatchToProps = {
    fetchOrders,
    resetModal,
    setServices,
    addLaborToOrder,
    setSelectedOrderId,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class AddLaborOrDetailToOrderModal extends Component {

    /** Use this if some modalProps are not initialized */
    defaultModalProps = {
        mode: modes.ADD,
    }

    componentDidMount() {
        this.props.fetchOrders();

        // const { modalProps: {labors}, setServices } = this.props;
        // setServices({services: labors});
        // console.log("labors: ", labors);
    }

    /**
     * Handle submit depending on mode that is currently used
     */
    handleSubmit = (e) => {
        e.preventDefault();

        this.props.addLaborToOrder();
        this.onClose();

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
        this.props.resetModal();
        this.props.setSelectedOrderId({orderId: undefined});
    }

    render() {

        const {
            visible,
            modalProps,
            orders,
            selectedOrderId,
        } = this.props;

        console.log("Orders: ", orders);
        console.log("modalProps", modalProps);

        const { modalProps: {labors}, setServices } = this.props;
        setServices({services: labors});
        console.log("labors: ", labors);

        // const mode = _.get(modalProps, "mode", this.defaultModalProps.mode);
        // const vehicleId = _.get(modalProps, "vehicleId");

        return (
            <div>
                <Modal
                    destroyOnClose={true}
                    width={ '60%' }
                    visible={ visible === MODALS.ADD_LABOR_OR_DETAIL_TO_ORDER }
                    onOk={ this.handleSubmit }
                    onCancel={ this.onClose }
                    okButtonProps={{
						disabled: !selectedOrderId,
					}}
                    title={
                        <div className={Styles.title}>
                           AddLaborOrDetailToOrderModal   
                        </div>
                    }
                >
                    <div style={{minHeight: '30vh'}}>
                        <OrdersTable />                        
                    </div>
                </Modal>
            </div>
        );
    }
}
