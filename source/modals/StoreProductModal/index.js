// vendor
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

// proj
import { MODALS, resetModal } from 'core/modals/duck';
import { StoreProductForm } from 'forms/StorageForms';

const StoreProductModal = props => {
    const { visible, resetModal } = props;

    const [ editing, setEditing ] = useState(_.get(props, 'modalProps.editing'));

    useEffect(() => {
        setEditing(_.get(props, 'modalProps.editing'));
    }, [ _.get(props, 'modalProps.editing') ]);
    console.log('→ StoreProductModal props', props);

    return (
        <Modal
            title={
                editing ? (
                    <span>
                        <FormattedMessage id='storage.product_code' />:{ ' ' }
                        { props.modalProps.code }
                    </span>
                ) : (
                    <FormattedMessage id='storage.add_product' />
                )
            }
            cancelText={ <FormattedMessage id='cancel' /> }
            okText={ <FormattedMessage id='save' /> }
            visible={ visible === MODALS.STORE_PRODUCT }
            // onOk={ () => this._submit() }
            onCancel={ () => resetModal() }
            destroyOnClose
            footer={ null }
            width={ 720 }
        >
            <StoreProductForm
                editing={ editing }
                modalProps={ props.modalProps }
                resetModal={ props.resetModal }
            />
        </Modal>
    );
};

const mapStateToProps = state => ({
    modalProps: state.modals.modalProps,
});

export default connect(
    mapStateToProps,
    { resetModal },
)(StoreProductModal);
