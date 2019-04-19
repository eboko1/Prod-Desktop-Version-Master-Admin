// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Select, Button } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import {
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    selectProductLoading,
    selectStoreProduct,
} from 'core/storage/products';
import { fetchStoreGroups, selectStoreGroups } from 'core/storage/storeGroups';
import { fetchPriceGroups, selectPriceGroups } from 'core/storage/priceGroups';
import { setBrandsSearchQuery, selectBrandsByQuery } from 'core/search/duck';

import {
    DecoratedInput,
    DecoratedAutoComplete,
    DecoratedTreeSelect,
} from 'forms/DecoratedFields';
import { MeasureUnitSelect, PriceGroupSelect } from 'forms/_formkit';

// own
const Option = Select.Option;

const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
`;

const ButtonGroup = styled.div`
    display: flex;
    align-items: center;
`;

const SubmitButton = styled(Button)`
    margin: 0 auto;
`;
const DeleteButton = styled(Button)`
    margin: 0 auto;
`;

const formItemLayout = {
    labelCol:   { span: 7 },
    wrapperCol: { span: 15 },
};

const ProductForm = props => {
    const {
        form,
        intl: { formatMessage },
    } = props;
    console.log('→ ProductForm props', props);
    useEffect(() => {
        console.log('→useEffect modalProps', props.modalProps);
        if (_.get(props, 'modalProps.id')) {
            props.fetchProduct(_.get(props, 'modalProps.id'));
        }
    }, [ _.get(props, 'modalProps.id') ]);

    useEffect(() => {
        props.fetchStoreGroups();
    }, []);

    useEffect(() => {
        props.fetchPriceGroups();
    }, []);

    const _submit = event => {
        event.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                if (values.brandName && values.brandId) {
                    _.set(values, 'brandId', void 0);
                }

                props.createProduct(values);
                props.form.resetFields();
                props.resetModal();
            }
        });
    };

    const _delete = id => {
        props.deleteProduct(id);
        props.form.resetFields();
        props.resetModal();
    };

    return (
        <StyledForm onSubmit={ _submit }>
            <DecoratedInput
                formItem
                formItemLayout={ formItemLayout }
                fields={ {} }
                label={ formatMessage({ id: 'storage.product_code' }) }
                field='code'
                getFieldDecorator={ form.getFieldDecorator }
                rules={ [
                    {
                        required: true,
                        message:  'required',
                    },
                ] }
                initialValue={ _.get(props, 'product.code') }
            />
            <DecoratedTreeSelect
                formItem
                formItemLayout={ formItemLayout }
                label={ formatMessage({ id: 'storage.product_group' }) }
                fields={ {} }
                getFieldDecorator={ form.getFieldDecorator }
                getPopupContainer={ trigger => trigger.parentNode }
                field='groupId'
                rules={ [
                    {
                        required: true,
                        message:  'required!',
                    },
                ] }
                treeDataNodes={ props.storeGroups }
                initialValue={ _.get(props, 'product.groupId') }
            />
            <DecoratedInput
                formItem
                formItemLayout={ formItemLayout }
                label={ formatMessage({ id: 'storage.product_name' }) }
                fields={ {} }
                field='name'
                getFieldDecorator={ form.getFieldDecorator }
                rules={ [
                    {
                        required: true,
                        message:  'required',
                    },
                ] }
                initialValue={ _.get(props, 'product.name') }
            />
            <>
                <DecoratedAutoComplete
                    formItem
                    formItemLayout={ formItemLayout }
                    label={ formatMessage({ id: 'storage.brand' }) }
                    fields={ {} }
                    defaultGetValueProps
                    getFieldDecorator={ form.getFieldDecorator }
                    getPopupContainer={ trigger => trigger.parentNode }
                    field='brandId'
                    initialValue={ _.get(props, 'product.brandId') }
                    onSearch={ value => {
                        form.setFieldsValue({
                            brandId:   void 0,
                            brandName: value,
                        });
                        props.setBrandsSearchQuery(value);
                    } }
                    onSelect={ value => {
                        form.setFieldsValue({
                            brandId:   value,
                            brandName: void 0,
                        });
                    } }
                    optionLabelProp={ 'children' }
                    optionFilterProp={ 'children' }
                    showSearch
                    dropdownMatchSelectWidth={ false }
                >
                    { props.brands.map(({ brandName, brandId }) => (
                        <Option
                            value={ String(brandId) }
                            key={ `${brandId}-${brandName}` }
                        >
                            { brandName }
                        </Option>
                    )) }
                </DecoratedAutoComplete>
                <DecoratedInput
                    hiddeninput='hiddeninput'
                    fields={ {} }
                    getFieldDecorator={ form.getFieldDecorator }
                    field='brandName'
                />
            </>
            <MeasureUnitSelect
                field={ 'measureUnit' }
                formItem
                label={ formatMessage({ id: 'storage.measure_units' }) }
                formItemLayout={ formItemLayout }
                getFieldDecorator={ form.getFieldDecorator }
                formatMessage={ formatMessage }
                getPopupContainer={ trigger => trigger.parentNode }
                initialValue={ _.get(props, 'product.measureUnit') }
            />
            <DecoratedInput
                formItem
                formItemLayout={ formItemLayout }
                label={ formatMessage({ id: 'storage.trade_code' }) }
                fields={ {} }
                field='tradeCode'
                getFieldDecorator={ form.getFieldDecorator }
                initialValue={ _.get(props, 'product.tradeCode') }
            />
            <PriceGroupSelect
                field={ 'priceGroupNumber' }
                label={ formatMessage({ id: 'storage.price_group' }) }
                formItem
                formItemLayout={ formItemLayout }
                getFieldDecorator={ form.getFieldDecorator }
                getPopupContainer={ trigger => trigger.parentNode }
                priceGroups={ props.priceGroups }
                formatMessage={ formatMessage }
                initialValue={ _.get(props, 'product.priceGroupNumber') }
            />
            <DecoratedInput
                formItem
                formItemLayout={ formItemLayout }
                label={ formatMessage({ id: 'storage.certificate' }) }
                fields={ {} }
                field='certificate'
                getFieldDecorator={ form.getFieldDecorator }
                initialValue={ _.get(props, 'product.certificate') }
            />
            <ButtonGroup>
                <SubmitButton type='primary' htmlType='submit'>
                    { props.intl.formatMessage({ id: 'submit' }) }
                </SubmitButton>
                { props.editing ? (
                    <DeleteButton
                        type='danger'
                        onClick={ () => _delete(_.get(props, 'modalProps.id')) }
                    >
                        { props.intl.formatMessage({ id: 'delete' }) }
                    </DeleteButton>
                ) : null }
            </ButtonGroup>
        </StyledForm>
    );
};

const mapStateToProps = state => ({
    storeGroups: selectStoreGroups(state),
    priceGroups: selectPriceGroups(state),
    brands:      selectBrandsByQuery(state),
    loading:     selectProductLoading(state),
    product:     selectStoreProduct(state),
});

const mapDispatchToProps = {
    fetchProduct,
    fetchStoreGroups,
    fetchPriceGroups,
    setBrandsSearchQuery,
    createProduct,
    updateProduct,
    deleteProduct,
};

export const StoreProductForm = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(Form.create()(ProductForm)),
);
