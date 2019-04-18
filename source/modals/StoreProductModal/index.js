// vendor
import React from 'react';
import { Modal } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
// import _ from 'lodash';

// proj
import { MODALS, resetModal } from 'core/modals/duck';

import { StoreProductForm } from 'forms/StorageForms';

const StoreProductModal = props => {
    const { visible, resetModal } = props;

    return (
        <Modal
            title='Product code'
            cancelText={ <FormattedMessage id='cancel' /> }
            okText={ <FormattedMessage id='save' /> }
            visible={ visible === MODALS.STORE_PRODUCT }
            // onOk={ () => this._submit() }
            onCancel={ () => resetModal() }
            destroyOnClose
            footer={ null }
            width={ 720 }
        >
            <StoreProductForm resetModal={ props.resetModal } />
        </Modal>
    );
};

export default connect(
    null,
    { resetModal },
)(StoreProductModal);
