// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';
import { OrderTaskForm } from 'forms';

// own
import Styles from './styles.m.css';

export default class OrderTaskModal extends Component {
    render() {
        const { visible, resetModal, num, resetOrderTasksForm,
            saveOrderTask, orderId, orderTaskEntity,
            progressStatusOptions, priorityOptions,
            wrappedComponentRef, orderTaskModalStatus, orderTaskId,
            stations, managers, saveNewOrderTask} = this.props;

        return (
            <Modal
                className={ Styles.orderTaskModal }
                width={ '80%' }
                title={
                    <FormattedMessage
                        id={ 'order-task-modal.transfer_change_task' }
                    />
                }
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='save' /> }
                wrapClassName={ Styles.orderTaskModal }
                visible={ visible === MODALS.ORDER_TASK }
                onOk={ () => {
                    // saveOrderTask(orderTaskEntity, orderId, orderTaskModalStatus, orderTaskId );
                    // resetModal();
                    // resetOrderTasksForm();
                    saveNewOrderTask(orderTaskEntity, orderId, orderTaskModalStatus, orderTaskId )
                } }
                onCancel={ () => { 
                    resetModal()
                    resetOrderTasksForm()
                } }
            >
                <OrderTaskForm
                    num={ num } 
                    stations={ stations }
                    managers={ managers }
                    progressStatusOptions={ progressStatusOptions }
                    priorityOptions={ priorityOptions }
                    wrappedComponentRef={ wrappedComponentRef }/>
            </Modal>
        );
    }
}
