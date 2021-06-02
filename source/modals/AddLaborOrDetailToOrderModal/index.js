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
    setDetails,
    addLaborToOrder,
    addDetailsToOrder,
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
    setDetails,
    addLaborToOrder,
    addDetailsToOrder,
    setSelectedOrderId,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class AddLaborOrDetailToOrderModal extends Component {
    componentDidMount() {
        this.props.fetchOrders();
    }

    /**
     * Handle submit depending on mode that is currently used.
     * labors and details are provided via modalProps, so we put this data into state only before processing
     * other operations.
     */
    handleSubmit = (e) => {
        e.preventDefault();

        const {modalProps: {mode}} = this.props;

        if(mode == modes.ADD_LABOR) {
            const { modalProps: {labors}, setServices } = this.props;
            setServices({services: labors});
            console.log("labors: ", labors);
            this.props.addLaborToOrder();
        } else if(mode == modes.ADD_DETAIL) {
            const { modalProps: {details}, setDetails } = this.props;
            setDetails({details: details});
            console.log("details: ", details);
            this.props.addDetailsToOrder();
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
