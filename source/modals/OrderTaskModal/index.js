// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';
// import { OrderTaskForm } from 'forms';

// own
import Styles from './styles.m.css';

export default class OrderTaskModal extends Component {
    render() {
        const { visible, resetModal } = this.props;

        // TODO: refactor or remove Styles if needed

        return (
            <Modal
                className={ Styles.addClientModal }
                width={ '80%' }
                title={ <FormattedMessage id='add-client-form.add_client' /> }
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='add' /> }
                wrapClassName={ Styles.addClientModal }
                visible={ visible === MODALS.ORDER_TASK }
                onOk={ () => {
                    resetModal();
                } }
                onCancel={ () => resetModal() }
            >
                Hello
                { /* TODO: uncomment and add logic <OrderTaskForm /> */ }
            </Modal>
        );
    }
}
