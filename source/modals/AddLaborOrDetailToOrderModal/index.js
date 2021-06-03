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
    addLaborsToOrder,
    addDetailsToOrder,
    
    setDetails,
    setLabors,
    setSelectedOrderId,
    setVehicleId,
    
    selectOrders,
    selectSelectedOrderId,
    selectVehicleId,
} from './redux/duck';

// own
import Styles from './styles.m.css';
import { OrdersTable } from './components';

const mapStateToProps = state => ({
    modalProps:    selectModalProps(state),
    visible:       selectModal(state),
    orders:        selectOrders(state),
    selectedOrderId: selectSelectedOrderId(state),
    vehicleId:       selectVehicleId(state),
});

const mapDispatchToProps = {
    fetchOrders,
    resetModal,
    setLabors,
    setDetails,
    addLaborsToOrder,
    addDetailsToOrder,
    setSelectedOrderId,
    setVehicleId,
};

/**
 * @property {String|integer} [modalProps.vehicleId] - Id of a vehicle to sort orders for, if not provided all orders will be available in OrdersTable
 */
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class AddLaborOrDetailToOrderModal extends Component {
    componentDidMount() {
        this.props.fetchOrders();
    }

    componentDidUpdate(prevProps) {
        const prevVehicleId = _.get(prevProps, 'modalProps.vehicleId');
        const currVehicleId = _.get(this.props, 'modalProps.vehicleId');

        //Update orders list if filter is provided
        if(prevVehicleId != currVehicleId) {
            this.props.setVehicleId({vehicleId: currVehicleId});
        }
    }

    /**
     * Handle submit depending on mode that is currently used.
     * labors and details are provided via modalProps, so we put this data into state only before processing
     * other operations.
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            modalProps: { mode, labors, details },
            setLabors,
            setDetails,
        } = this.props;

        switch (mode) {
            case modes.ADD_LABOR:
                setLabors({services: labors});
                this.props.addLaborsToOrder();
                break;
            case modes.ADD_DETAIL:
                setDetails({details: details});
                this.props.addDetailsToOrder();
                break;
        }
        this.onClose();
    };

    onClose = () => {
        this.props.resetModal();
        this.props.setSelectedOrderId({orderId: undefined}); //Reset
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
