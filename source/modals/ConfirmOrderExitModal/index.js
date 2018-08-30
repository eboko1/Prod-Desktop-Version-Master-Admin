// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';

export default class CancelReasonModal extends Component {
    render() {
        const {
            visible,
            resetModal,
            saveOrder,
            returnToOrdersPage,
            status,
        } = this.props;

        return (
            <Modal
                cancelText={
                    <FormattedMessage id='order_form_table.confirm_exit_without_changes' />
                }
                visible={ visible === MODALS.CONFIRM_EXIT }
                onCancel={ () => {
                    resetModal();
                    returnToOrdersPage(status);
                } }
                onOk={ () => {
                    resetModal();
                    saveOrder();
                } }
            >
                <FormattedMessage id='order_form_table.confirm_exit' />
            </Modal>
        );
    }
}
