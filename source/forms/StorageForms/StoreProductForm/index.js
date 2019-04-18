// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Select, Button } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import { createProduct } from 'core/storage/products';
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

const SubmitButton = styled(Button)`
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
                // props.form.resetFields();
                // props.resetModal();
            }
        });
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
                    initialValue={ void 0 }
                    onChange={ value => console.log('onChange', value) }
                    onSearch={ value => {
                        console.log('onSearch', value);
                        form.setFieldsValue({
                            brandId:   void 0,
                            brandName: value,
                        });
                        props.setBrandsSearchQuery(value);
                        form.setFields({ brandId: void 0 });
                        form.resetFields('brandId');
                    } }
                    onSelect={ value => {
                        console.log('onSelect', value);
                        // setFieldsValue({ [ `${index}.brandId` ]: value });
                        form.setFieldsValue({
                            brandId:   value,
                            brandName: void 0,
                        });
                        // resetFields([ `${index}.brandName` ]);
                    } }
                    optionLabelProp={ 'children' }
                    optionFilterProp={ 'children' }
                    showSearch
                    dropdownMatchSelectWidth={ false }
                >
                    { console.log('brandId fv', form.getFieldValue('brandId')) }
                    { console.log(
                        'brandName fv',
                        form.getFieldValue('brandName'),
                    ) }

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
                formItemLayout={ formItemLayout }
                getFieldDecorator={ form.getFieldDecorator }
                formatMessage={ formatMessage }
                getPopupContainer={ trigger => trigger.parentNode }
            />
            <DecoratedInput
                formItem
                formItemLayout={ formItemLayout }
                label={ formatMessage({ id: 'storage.trade_code' }) }
                fields={ {} }
                field='tradeCode'
                getFieldDecorator={ form.getFieldDecorator }
            />
            <PriceGroupSelect
                field={ 'priceGroupNumber' }
                formItem
                formItemLayout={ formItemLayout }
                getFieldDecorator={ form.getFieldDecorator }
                getPopupContainer={ trigger => trigger.parentNode }
                priceGroups={ props.priceGroups }
                formatMessage={ formatMessage }
            />
            <DecoratedInput
                formItem
                formItemLayout={ formItemLayout }
                label={ formatMessage({ id: 'storage.certificate' }) }
                fields={ {} }
                field='certificate'
                getFieldDecorator={ form.getFieldDecorator }
            />

            <SubmitButton type='primary' htmlType='submit'>
                { props.intl.formatMessage({ id: 'submit' }) }
            </SubmitButton>
        </StyledForm>
    );
};

const mapStateToProps = state => ({
    storeGroups: selectStoreGroups(state),
    priceGroups: selectPriceGroups(state),
    brands:      selectBrandsByQuery(state),
});

const mapDispatchToProps = {
    fetchStoreGroups,
    fetchPriceGroups,
    setBrandsSearchQuery,
    createProduct,
};

export const StoreProductForm = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(Form.create()(ProductForm)),
);
