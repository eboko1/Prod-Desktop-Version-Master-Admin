// vendor
import React from 'react';
import { Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// import _ from 'lodash';

// proj
import { MODALS } from 'core/modals/duck';

const StoreProductModal = props => {
    const { visible, resetModal } = props;

    return (
        <Modal
            cancelText={ <FormattedMessage id='cancel' /> }
            okText={ <FormattedMessage id='save' /> }
            visible={ visible === MODALS.STORE_PRODUCT }
            // onOk={ () => this._submit() }
            onCancel={ () => resetModal() }
            destroyOnClose
        >
            MODALS.STORE_PRODUCT
        </Modal>
    );
};

export default StoreProductModal;
