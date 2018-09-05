// vendor
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';

export default class CancelReasonModal extends Component {
    render() {
        const { visible, resetModal, saveOrder, redirect } = this.props;

        return (
            <Modal
                cancelText={
                    <FormattedMessage id='order_form_table.confirm_exit_without_changes' />
                }
                visible={ visible === MODALS.CONFIRM_EXIT }
                onCancel={ () => resetModal() }
                footer={
                    <div>
                        <Button onClick={ () => redirect() }>
                            <FormattedMessage id='no' />
                        </Button>
                        <Button
                            type='primary'
                            onClick={ () => {
                                resetModal();
                                saveOrder();
                            } }
                        >
                            <FormattedMessage id='yes' />
                        </Button>
                    </div>
                }
            >
                <FormattedMessage id='order_form_table.confirm_exit' />
            </Modal>
        );
    }
}
