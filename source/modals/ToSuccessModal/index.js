// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { MODALS } from 'core/modals/duck';
import { ToSuccessForm } from 'forms';

export default class ToSuccessModal extends Component {
    //_handleToSuccessModalSubmit = () => {
    //    onStatusChange;
    //};

    render() {
        const {
            visible,
            onStatusChange,
            remainPrice,
            resetModal,
            clientId,
            orderId,
        } = this.props;

        return (
            <Modal
                visible={ visible === MODALS.TO_SUCCESS }
                //onOk={ () => this._handleToSuccessModalSubmit() }
                onCancel={ () => resetModal() }
                footer={ null }
                destroyOnClose
            >
                <ToSuccessForm
                    //handleToSuccessModalSubmit={
                    //    this._handleToSuccessModalSubmit
                    //}
                    onStatusChange={ onStatusChange }
                    resetModal={ resetModal }
                    remainPrice={ remainPrice }
                    clientId={ clientId }
                    orderId={ orderId }
                />
            </Modal>
        );
    }
}
