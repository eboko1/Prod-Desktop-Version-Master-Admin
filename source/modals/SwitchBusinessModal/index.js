// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';

// proj
import { MODALS } from 'core/modals/duck';
import { SwitchBusinessForm } from 'forms';

// own

export default class SwitchBusinessModal extends Component {
    render() {
        const { visible, resetModal, loading } = this.props;

        return (
            <Modal
                title={ 'Switch Business Modal' }
                visible={ visible === MODALS.SWITCH_BUSINESS }
                onCancel={ () => resetModal() }
                footer={ null }
            >
                <SwitchBusinessForm loading={ loading }/>
            </Modal>
        );
    }
}
