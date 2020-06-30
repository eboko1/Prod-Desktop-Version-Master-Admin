// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
// proj
import {
    createStoreGroup,
    updateStoreGroup,
    deleteStoreGroup,
} from 'core/storage/storeGroups';
import { fetchPriceGroups, selectPriceGroups } from 'core/storage/priceGroups';
import { MODALS, selectModalProps } from 'core/modals/duck';

import { DecoratedInput, DecoratedCheckbox, DecoratedSelect } from 'forms/DecoratedFields';
import { PriceGroupSelect } from 'forms/_formkit';
import { isAdmin } from 'utils';
const Option = Select.Option;

const formItemLayout = {
    labelCol:   { span: 6 },
    wrapperCol: { span: 18 },
};

const mapStateToProps = state => ({
    user:        state.auth,
    modalProps:  selectModalProps(state),
    priceGroups: selectPriceGroups(state),
});

const mapDispatchToProps = {
    createStoreGroup,
    updateStoreGroup,
    deleteStoreGroup,
    fetchPriceGroups,
};

const StoreGroup = props => {
    const {
        visible,
        resetModal,
        modalProps,
        form: { getFieldDecorator },
        intl: { formatMessage },
    } = props;

    const name = _.get(modalProps, 'storeGroup.name');
    const parentGroupId = _.get(modalProps, 'storeGroup.id');
    const systemWide = _.get(modalProps, 'storeGroup.systemWide');

    const deleteMode = _.get(modalProps, 'delete');

    useEffect(() => {
        props.fetchPriceGroups();
    }, []);

    const submit = () => {
        const { form, resetModal, modalProps } = props;

        form.validateFields((err, values) => {
            if (!err) {
                const id = _.get(modalProps, 'storeGroup.id');

                if (modalProps.create) {
                    props.createStoreGroup(values);
                }
                if (modalProps.edit) {
                    props.updateStoreGroup({ ...values, id });
                }
                if (modalProps.delete) {
                    props.deleteStoreGroup(id);
                }
                form.resetFields();
                resetModal();
            }
        });
    };

    const renderSystemWideCheckbox = () => {
        if (isAdmin(props.user)) {
            if (!systemWide) {
                return (
                    <DecoratedCheckbox
                        fields={ {} }
                        formItem
                        label={ formatMessage({ id: 'storage.system_wide' }) }
                        formItemLayout={ formItemLayout }
                        field='systemWide'
                        getFieldDecorator={ getFieldDecorator }
                        initialValue={ !systemWide }
                        disabled={ modalProps.create ? false : true }
                    />
                );
            }

            return null;
        }

        return null;
    };

    return (
        <Modal
            cancelText={ <FormattedMessage id='cancel' /> }
            okText={
                deleteMode ? (
                    <FormattedMessage id='delete' />
                ) : (
                    <FormattedMessage id='save' />
                )
            }
            visible={ visible === MODALS.STORE_GROUP }
            onOk={ () => submit() }
            okButtonProps={ deleteMode && { type: 'danger' } }
            onCancel={ () => resetModal() }
        >
            <Form onSubmit={ submit } style={ { padding: 24 } }>
                <DecoratedInput
                    fields={ {} }
                    field='name'
                    formItem
                    formItemLayout={ formItemLayout }
                    label={ formatMessage({ id: 'storage.product_group' }) }
                    initialValue={ name }
                    getFieldDecorator={ getFieldDecorator }
                />
                <DecoratedInput
                    hiddeninput='hiddeninput'
                    fields={ {} }
                    getFieldDecorator={ getFieldDecorator }
                    field='parentGroupId'
                    initialValue={ parentGroupId }
                />
                <PriceGroupSelect
                    field={ 'priceGroupNumber' }
                    label={ formatMessage({ id: 'storage.price_group' }) }
                    formItem
                    formItemLayout={ formItemLayout }
                    getFieldDecorator={ getFieldDecorator }
                    getPopupContainer={ trigger => trigger.parentNode }
                    priceGroups={ props.priceGroups }
                    formatMessage={ formatMessage }
                    initialValue={ _.get(
                        modalProps,
                        'storeGroup.priceGroupNumber',
                    ) }
                />
                {props.brands ? 
                    <DecoratedSelect
                        label={ formatMessage({ id: 'storage.default_brand' }) }
                        showSearch
                        field={ `defaultBrandId` }
                        formItemLayout={ formItemLayout }
                        getFieldDecorator={ getFieldDecorator }
                        getPopupContainer={ trigger => trigger.parentNode }
                        formItem
                        initialValue={ _.get(
                            modalProps,
                            'storeGroup.defaultBrandId',
                        ) }
                    >
                        { props.brands.map((brand, i) => {
                            return (
                                <Option value={ brand.brandId } key={ i }>
                                    {brand.brandName}
                                </Option>
                            );
                        }) }
                    </DecoratedSelect> 
                : null}
                { /* systemWide is null if active or businessId if not  */ }
                { renderSystemWideCheckbox() }
            </Form>
        </Modal>
    );
};

const StoreProductModal = injectIntl(
    Form.create()(
        connect(
            mapStateToProps,
            mapDispatchToProps,
        )(StoreGroup),
    ),
);

export default StoreProductModal;
