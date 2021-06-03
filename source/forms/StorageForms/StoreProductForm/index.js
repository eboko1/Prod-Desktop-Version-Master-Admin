// vendor
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, Select, Button, Checkbox, InputNumber, Col } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import styled from 'styled-components';
import { withRouter } from 'react-router';

// proj
import {
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    selectProductLoading,
    selectStoreProduct,
} from 'core/storage/products';
import { fetchBrands, selectBrands } from 'core/brands/duck';
import { fetchStoreGroups, selectStoreGroups } from 'core/storage/storeGroups';
import { fetchPriceGroups, selectPriceGroups } from 'core/storage/priceGroups';
import { setBrandsSearchQuery, selectBrandsByQuery } from 'core/search/duck';

import {
    DecoratedInput,
    DecoratedAutoComplete,
    DecoratedTreeSelect,
    DecoratedSelect,
    DecoratedCheckbox,
} from 'forms/DecoratedFields';
import { MeasureUnitSelect, PriceGroupSelect } from 'forms/_formkit';
import { Barcode } from "components";
import book from 'routes/book';

// own
const Option = Select.Option;
const FormItem = Form.Item;

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

    useEffect(() => {
        props.fetchProduct(_.get(props, 'modalProps.id'));
    }, [ _.get(props, 'modalProps.id') ]);

    useEffect(() => {
        props.fetchBrands();
        props.fetchStoreGroups();
        props.fetchPriceGroups();
    }, []);

    useEffect(() => {
        if(_.get(props, 'modalProps.code')) {
            props.form.setFieldsValue({code: _.get(props, 'modalProps.code')})
        }
        if(_.get(props, 'modalProps.brandId')) {
            props.form.setFieldsValue({brandId: _.get(props, 'modalProps.brandId')})
        }
        if(_.get(props, 'modalProps.barcode')) {
            props.form.setFieldsValue({barcode: _.get(props, 'modalProps.barcode')})
        }
        if(_.get(props, 'modalProps.name')) {
            props.form.setFieldsValue({name: _.get(props, 'modalProps.name')})
        }
        if(_.get(props, 'modalProps.groupId')) {
            props.form.setFieldsValue({groupId: _.get(props, 'modalProps.groupId')})
        }
    }, []);

    const findGroupNameById = (data, groupId) => {
        let groupName = null;

        data.forEach(item => {
            if (item.id === groupId) {
                groupName = item.singleName;
            }

            if (!_.isEmpty(item.childGroups)) {
                const result = findGroupNameById(item.childGroups, groupId);
                if (!groupName) {
                    groupName = result;
                }
            }
        });

        return groupName;
    };

     const findGroupMultiplierById = (data, groupId) => {
        let resultNumber = null;

        data.forEach(item => {
            if (item.id === groupId) {
                resultNumber = item.priceGroupNumber;
            }

            if (!_.isEmpty(item.childGroups)) {
                const result = findGroupMultiplierById(item.childGroups, groupId);
                if (!resultNumber) {
                    resultNumber = result;
                }
            }
        });

        return resultNumber;
    };

    const onSelectProductGroup = value => {
        const groupName = findGroupNameById(props.storeGroups, value);
        props.form.setFieldsValue({ name: groupName });

        const priceGroup = findGroupMultiplierById(props.storeGroups, value);
        props.form.setFieldsValue({ priceGroupNumber: priceGroup });

        return value;
    };

    const _submit = event => {
        event.preventDefault();
        props.form.validateFields(async (err, values) => {
            if (!err) {
                if (values.brandName && values.brandId) {
                    _.set(values, 'brandId', void 0);
                }
                if(props.editing) {
                    await props.updateProduct(
                        {
                            id:      _.get(props, 'modalProps.id'),
                            product: values,
                        }, 
                        _.get(props, 'modalProps.onSubmit', ()=>{})
                    )
                } else {
                    await props.createProduct(values, _.get(props, 'modalProps.onSubmit', ()=>{}));
                }

                props.form.resetFields();
                if(props.resetModal) {
                    props.resetModal();
                }
            }
        });
    };

    const _delete = id => {
        props.deleteProduct(id);
        props.form.resetFields();
        if(props.resetModal) {
            props.resetModal();
        } else {
            props.history.replace({
                pathname: `${book.products}`,
            });
        }
    };

    const _generateBrandInitialOption = () => {
        const product = _.get(props, 'product', {});

        return _.isEmpty(product.brand) ? (
            <Option value={ String(_.get(props, 'product.brandName')) }>
                { _.get(props, 'product.brandName') }
            </Option>
        ) : (
            <Option value={ String(_.get(props, 'product.brand.id')) }>
                { _.get(props, 'product.brand.name') }
            </Option>
        );
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
                        message:  formatMessage({ id: 'required_field' }),
                    },
                ] }
                initialValue={ _.get(props, 'product.code') }
                disabled={props.editing}
                style={{ 
                    minWidth: 240,
                    color: 'var(--text)'
                }}
            />
            <DecoratedSelect
                formItem
                formItemLayout={ formItemLayout }
                label={ formatMessage({ id: 'storage.brand' }) }
                fields={ {} }
                defaultGetValueProps
                getFieldDecorator={ form.getFieldDecorator }
                getPopupContainer={ trigger => trigger.parentNode }
                field='brandId'
                rules={ [
                    {
                        required: true,
                        message:  formatMessage({ id: 'required_field' }),
                    },
                ] }
                initialValue={
                    _.isEmpty(props.product.brand)
                        ? _.get(props, 'product.brandId')
                        : String(_.get(props, 'product.brand.id'))
                }
                optionLabelProp={ 'children' }
                optionFilterProp={ 'children' }
                showSearch
                dropdownMatchSelectWidth={ false }
                disabled={props.editing}
            >
                {props.brands.length
                    ? props.brands.map(({brandId, brandName})=>{
                        return brandName && (
                            <Option
                                value={ String(brandId) }
                                key={ `${brandId}-${brandName}` }
                            >
                                { brandName }
                            </Option>
                        )
                    })
                    : _.get(props, 'modalProps.brandId')
                        ? (
                            <Option value={_.get(props, 'modalProps.brandId')}>
                                {_.get(props, 'modalProps.brandName')}
                            </Option>
                        )
                        : []
                }
            </DecoratedSelect>
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
                        message:  formatMessage({ id: 'required_field' }),
                    },
                ] }
                onSelect={ e => onSelectProductGroup(e) }
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
                        message:  formatMessage({ id: 'required_field' }),
                    },
                ] }
                initialValue={ _.get(props, 'product.name') }
            />
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
                label={ formatMessage({ id: 'storage.trade_code' }) }
                fields={ {} }
                field='tradeCode'
                getFieldDecorator={ form.getFieldDecorator }
                initialValue={ _.get(props, 'product.tradeCode') }
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
            <FormItem
                label={<FormattedMessage id="navigation.barcode" />}
                {...formItemLayout}
            >
                <DecoratedInput
                    field="barcode"
                    placeholder={formatMessage({
                        id: "navigation.barcode",
                    })}
                    formItemLayout={formItemLayout}
                    initialValue={_.get(props, "product.barcode")}
                    getFieldDecorator={form.getFieldDecorator}
                    style={{ 
                        minWidth: 240,
                        color: 'var(--text)'
                    }}
                    disabled
                />
                <Barcode
                    value={form.getFieldValue("barcode")}
                    referenceId={_.get(props, 'product.id')}
                    table={'STORE_PRODUCTS'}
                    prefix={'STP'}
                    iconStyle={{
                        fontSize: 22,
                        marginLeft: 8
                    }}
                    onConfirm={(code, prefix)=>{
                        form.setFieldsValue({barcode: `${prefix}-${code}`})
                    }}
                />
            </FormItem>
            <ButtonGroup>
                { props.editing ? (
                    <DeleteButton
                        type='danger'
                        onClick={ () => _delete(_.get(props, 'modalProps.id')) }
                    >
                        { props.intl.formatMessage({ id: 'delete' }) }
                    </DeleteButton>
                ) : null }
                <SubmitButton type='primary' htmlType='submit'>
                    { props.intl.formatMessage({ id: 'submit' }) }
                </SubmitButton>
            </ButtonGroup>
        </StyledForm>
    );
};

const mapStateToProps = state => ({
    storeGroups: selectStoreGroups(state),
    priceGroups: selectPriceGroups(state),
    brands:      selectBrands(state),
    loading:     selectProductLoading(state),
    product:     selectStoreProduct(state),
});

const mapDispatchToProps = {
    fetchProducts,
    fetchProduct,
    fetchStoreGroups,
    fetchPriceGroups,
    setBrandsSearchQuery,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchBrands,
};

export const StoreProductForm = withRouter(
    injectIntl(
        connect(mapStateToProps, mapDispatchToProps)(Form.create()(ProductForm))
    )
);
