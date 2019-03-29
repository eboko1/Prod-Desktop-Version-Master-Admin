// vendor
import React, { Component } from 'react';
import { Modal } from 'antd';
// proj
import { MODALS } from 'core/modals/duck';

import { PDF } from 'components';

export default class PDFViewerModal extends Component {
    render() {
        const { visible, resetModal } = this.props;

        return (
            <Modal
                visible={ visible === MODALS.PDF_VIEWER }
                onCancel={ () => resetModal() }
                footer={ null }
                destroyOnClose
                style={ { top: 20 } }
                width={ 760 }
            >
                <PDF />
            </Modal>
        );
    }
}
