//vendor
import React from 'react';
import { Modal } from 'antd';

//proj
import { MODALS } from 'core/modals/duck';

//own

export default class ConfirmModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        //Use default values if some of them were not provided but are required
        let {
            width = '50vh',
            visible = false,
            onOk,
            onCancel,
            title,
            
            modalContent
        } = this.props;

        return (
            <Modal
                width={ width }
                visible={ visible === MODALS.CONFIRM }
                onOk={ onOk }
                onCancel={ onCancel }
                title={title}
            >
                {modalContent}
            </Modal>
        );
    }


}