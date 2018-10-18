// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';
import { ToSuccessForm } from 'forms';

export default class ToSuccessModal extends Component {
    render() {
        const { visible, handleToSuccessModalSubmit, resetModal } = this.props;

        return (
            <Modal
                cancelText={ <FormattedMessage id='cancel' /> }
                okText={ <FormattedMessage id='invite-modal.invite' /> }
                visible={ visible === MODALS.TO_SUCCESS }
                onOk={ () => handleToSuccessModalSubmit() }
                onCancel={ () => resetModal() }
                footer={ null }
            >
                <ToSuccessForm
                    handleToSuccessModalSubmit={ handleToSuccessModalSubmit }
                    resetModal={ resetModal }
                />
            </Modal>
        );
    }
}
