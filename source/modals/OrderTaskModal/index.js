// vendor
import React, { Component } from 'react';
import { Modal, Form } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';
import { OrderTaskForm } from 'forms';

// own
import Styles from './styles.m.css';

export default class OrderTaskModal extends Component {
    render() {
        const { visible, resetModal, num } = this.props;

        // TODO: refactor or remove Styles if needed

        return (
            <Modal
                className={ Styles.orderTaskModal }
                width={ '80%' }
                title={ <FormattedMessage id={ 'order-task-modal.transfer_change_task' } /> }
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='save' /> }
                wrapClassName={ Styles.orderTaskModal }
                visible={ visible === MODALS.ORDER_TASK }
                onOk={ () => {
                    resetModal();
                } }
                onCancel={ () => resetModal() }
            >
                <OrderTaskForm num={ num } />
                { /* TODO: uncomment and add logic <OrderTaskForm /> */ }
            </Modal>
        );
    }
}
