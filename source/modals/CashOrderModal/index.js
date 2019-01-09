// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';

// proj
import { MODALS } from 'core/modals/duck';
import { CashOrderForm } from 'forms';

export default class CashOrderModal extends Component {
    render() {
        const { visible, resetModal } = this.props;

        return (
            <Modal
                visible={ visible === MODALS.CASH_ORDER }
                footer={ null }
                onCancel={ () => resetModal() }
            >
                <CashOrderForm resetModal={ resetModal } />
            </Modal>
        );
    }
}
