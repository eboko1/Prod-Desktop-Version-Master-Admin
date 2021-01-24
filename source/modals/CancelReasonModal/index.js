// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';
import { CancelReasonForm } from 'forms';
export default class CancelResonModal extends Component {
    render() {
        const {
            visible,
            handleCancelReasonModalSubmit,
            resetModal,
            orderComments,
        } = this.props;

        return (
            <Modal
                cancelText={ <FormattedMessage id='cancel' /> }
                visible={ visible === MODALS.CANCEL_REASON }
                onCancel={ () => resetModal() }
                footer={ null }
                maskClosable={false}
            >
                <CancelReasonForm
                    orderComments={ orderComments }
                    handleCancelReasonModalSubmit={
                        handleCancelReasonModalSubmit
                    }
                    resetModal={ resetModal }
                />
            </Modal>
        );
    }
}
