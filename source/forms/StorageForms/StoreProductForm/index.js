// vendor
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, Select, Button, Checkbox, InputNumber } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import styled from 'styled-components';

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

    const [storeInWarehouse, setStoreInWarehouse] = useState(false);
    const [multiplicity, setMultiplicity] = useState(1);
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(1);

    useEffect(() => {
        props.fetchProduct(_.get(props, 'modalProps.id'));
    }, [ _.get(props, 'modalProps.id') ]);

    useEffect(() => {
        props.fetchStoreGroups();
        props.fetchPriceGroups();
    }, []);

    useEffect(() => {
        console.log(props);
        setStoreInWarehouse(Boolean(_.get(props, 'product.min')));
        setMin(_.get(props, 'product.min') || 1);
        setMax(_.get(props, 'product.max') || 1);
    }, [_.get(props, 'product')]);

    

    const findGroupNameById = (data, groupId) => {
        let groupName = null;

        data.forEach(item => {
            if (item.id === groupId) {
                groupName = item.name;
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
        props.form.validateFields((err, values) => {
            if (!err) {
                if (values.brandName && values.brandId) {
                    _.set(values, 'brandId', void 0);
                }
                if(storeInWarehouse) {
                    values.min = min*multiplicity;
                    values.max = max*multiplicity;
                }
                props.editing
                    ? props.updateProduct({
                        id:      _.get(props, 'modalProps.id'),
                        product: values,
                    })
                    : props.createProduct(values);

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
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({ id: 'required_field' }),
                        },
                    ] }
                    initialValue={
                        _.isEmpty(props.product.brand)
                            ? _.get(props, 'product.brandName')
                            : String(_.get(props, 'product.brand.id'))
                    }
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
                    disabled={props.editing}
                >
                    { !_.isEmpty(props.product) && _generateBrandInitialOption() }
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
                    initialValue={
                        _.isEmpty(props.product.brand)
                            ? _.get(props, 'product.brandName')
                            : void 0
                    }
                    fields={ {} }
                    getFieldDecorator={ form.getFieldDecorator }
                    field='brandName'
                />
            </>
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
            <DecoratedSelect
                field={ 'defaultWarehouseId' }
                label={ formatMessage({ id: 'storage.default_warehouse' }) }
                formItem
                formItemLayout={ formItemLayout }
                getFieldDecorator={ form.getFieldDecorator }
                getPopupContainer={ trigger => trigger.parentNode }
                formatMessage={ formatMessage }
                initialValue={ _.get(props, 'product.defaultWarehouseId') }
            >
                {props.warehouses.map((elem, i)=>
                    <Option key={i} value={elem.id}>
                        {elem.name}
                    </Option>
                )}
            </DecoratedSelect>
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
            <div style={{margin: '0 0 16px 0'}}>
                <FormattedMessage id='storage_document.store_in_warehouse' />
                <Checkbox
                    style={{marginLeft: 5}}
                    checked={storeInWarehouse}
                    onChange={()=>{
                        setStoreInWarehouse(!storeInWarehouse);
                    }}
                />
            </div>
            {storeInWarehouse &&
                <div style={{display: 'flex', justifyContent: 'space-between', margin: '0 0 16px 0'}}>
                    <div>
                        <span style={{marginRight: 8}}><FormattedMessage id='storage_document.multiplicity'/></span>
                        <InputNumber
                            value={multiplicity}
                            step={1}
                            min={1}
                            onChange={(value)=>{
                                setMultiplicity(value);
                            }}
                        />
                    </div>
                    <div>
                        <span style={{marginRight: 8}}><FormattedMessage id='storage.min'/></span>
                        <InputNumber
                            value={min*multiplicity}
                            step={multiplicity}
                            min={0}
                            onChange={(value)=>{
                                setMin(Math.floor(value/multiplicity));
                            }}
                        />
                    </div>
                    <div>
                        <span style={{marginRight: 8}}><FormattedMessage id='storage.max'/></span>
                        <InputNumber
                            value={max*multiplicity}
                            step={multiplicity}
                            min={min*multiplicity}
                            onChange={(value)=>{
                                setMax(Math.floor(value/multiplicity));
                            }}
                        />
                    </div>
                </div>
            }
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
    brands:      selectBrandsByQuery(state),
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
};

export const StoreProductForm = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(Form.create()(ProductForm)),
);
