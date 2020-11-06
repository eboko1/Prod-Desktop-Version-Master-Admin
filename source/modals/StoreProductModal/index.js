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
    const [ editing, setEditing ] = useState(_.get(props, 'modalProps.editing'));

    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        let cleanupFunction = false;
        if(!warehouses.length) {
            const fetchData = async () => {
                let token = localStorage.getItem('_my.carbook.pro_token');
                let url = __API_URL__ + '/warehouses';
                fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': token,
                    }
                })
                .then(function (response) {
                    if (response.status !== 200) {
                    return Promise.reject(new Error(response.statusText))
                    }
                    return Promise.resolve(response)
                })
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    if(!cleanupFunction) setWarehouses(data);
                })
                .catch(function (error) {
                    console.log('error', error)
                });
            };

            fetchData();
            return () => cleanupFunction = true;
        }
    }, [])

    useEffect(() => {
        setEditing(_.get(props, 'modalProps.editing'));
    }, [ _.get(props, 'modalProps.editing') ]);

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
            visible={ props.modal === MODALS.STORE_PRODUCT }
            onCancel={ () => props.resetModal() }
            destroyOnClose
            footer={ null }
            width={ 720 }
        >
            <StoreProductForm
                editing={ editing }
                modalProps={ props.modalProps }
                resetModal={ props.resetModal }
                warehouses={ warehouses }
            />
        </Modal>
    );
};

const mapStateToProps = state => ({
    modal:      state.modals.modal,
    modalProps: state.modals.modalProps,
});

export default connect(
    mapStateToProps,
    { resetModal },
)(StoreProductModal);
