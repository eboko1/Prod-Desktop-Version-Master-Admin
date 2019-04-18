// vendor
import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';

// proj
import {
    DecoratedInputNumber,
    DecoratedInput,
    DecoratedTreeSelect,
    DecoratedAutoComplete,
} from 'forms/DecoratedFields';
import { MeasureUnitSelect, PriceGroupSelect } from 'forms/_formkit';

// own
const Option = Select.Option;

export function columnsConfig(
    dataSource,
    form,
    formatMessage,
    storeGroups,
    priceGroups,
    brands,
    setBrandsSearchQuery,
) {
    const {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
        resetFields,
    } = form;
    console.log('→ from.getFieldsValue', form.getFieldsValue());
    const code = {
        title:     'code',
        dataIndex: 'code',
        width:     'auto',
        render:    (code, data, index) => (
            <DecoratedInput
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.code` }
                initialValue={ code }
                rules={ [
                    {
                        required: true,
                        message:  'required!',
                    },
                ] }
            />
        ),
    };

    const productGroup = {
        title:     'groupId',
        dataIndex: 'groupId',
        width:     '10%',
        render:    (groupId, data, index) => (
            <DecoratedTreeSelect
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.groupId` }
                initialValue={ groupId }
                rules={ [
                    {
                        required: true,
                        message:  'required!',
                    },
                ] }
                treeDataNodes={ storeGroups }
            />
        ),
    };

    const measureUnit = {
        title:     'measureUnit',
        dataIndex: 'measureUnit',
        width:     '10%',
        render:    (measureUnit, data, index) => (
            <MeasureUnitSelect
                formItem={ false }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.measureUnit` }
                formatMessage={ formatMessage }
                initialValue={ measureUnit }
            />
        ),
    };

    const name = {
        title:     'name',
        dataIndex: 'name',
        width:     '20%',
        render:    (name, data, index) => (
            <DecoratedInput
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.name` }
                initialValue={ name }
                rules={ [
                    {
                        required: true,
                        message:  'required!',
                    },
                ] }
            />
        ),
    };

    const brandId = {
        title:     'brand',
        dataIndex: 'brandId',
        width:     '10%',
        render:    (brandId, data, index) => {
            console.log('→ DATA', data);
            const field = brandId ? `${index}.brandId` : `${index}.brandName`;
            const hiddenField = !brandId
                ? `${index}.brandId`
                : `${index}.brandName`;

            return (
                <>
                    <DecoratedAutoComplete
                        fields={ {} }
                        defaultGetValueProps
                        // getItemValue={ item => {
                        //     console.log(item);

                        //     return item.brandName;
                        // } }
                        getFieldDecorator={ getFieldDecorator }
                        field={ field }
                        initialValue={
                            brandId ? String(brandId) : data.brandName
                        }
                        // fieldValue={ _.get(fields, `services[${key}].serviceName`) }
                        // initialValue={ this._getDefaultValue(key, 'serviceName') }
                        // onSelect={ value =>
                        //     this._onServiceSelect(
                        //         value,
                        //         _.get(fields, `services[${key}].ownDetail`),
                        //     )
                        // }
                        // onChange={ e => console.log('cha', e) }
                        onSearch={ value => setBrandsSearchQuery(value) }
                        onSelect={ value => {
                            // setFieldsValue({ [ `${index}.brandId` ]: value });
                            setFieldsValue({
                                [ `${index}.brandId` ]:   value,
                                [ `${index}.brandName` ]: void 0,
                            });
                            // resetFields([ `${index}.brandName` ]);
                        } }
                        optionLabelProp={ 'children' }
                        optionFilterProp={ 'children' }
                        showSearch
                        dropdownMatchSelectWidth={ false }
                    >
                        { console.log(
                            '→ props.form.getFieldValue(brandId)',
                            getFieldValue(`${index}.brandId`),
                        ) }
                        { console.log(
                            '→ props.form.getFieldValue(brandName)',
                            getFieldValue(`${index}.brandName`),
                        ) }
                        { /* { console.log('()(()()()()brands', data) } */ }
                        { /* { brands.map(({ brandName, brandId }) => (
                    <Option value={ String(brandId) } key={ brandId }>
                        { brandName || data.brandName }
                    </Option>
                )) } */ }
                        { /* { brands.map(({ brandName, brandId }) => (
                        <Option value={ String(brandId) } key={ brandId }>
                            { brandName || data.brandName }
                        </Option>
                    )) } */ }

                        { _.isEmpty(brands) && brandId ? (
                            <Option
                                value={
                                    brandId != 'undefined'
                                        ? String(brandId)
                                        : `brandName.${data.brandName}`
                                }
                                key={ `${index}-${brandId}` }
                            >
                                { data.brandName }
                            </Option>
                        ) : 
                            brands.map(({ brandName, brandId }) => (
                                <Option value={ String(brandId) } key={ brandId }>
                                    { brandName || data.brandName }
                                </Option>
                            ))
                        }
                    </DecoratedAutoComplete>
                    <DecoratedInput
                        hiddenInput
                        fields={ {} }
                        getFieldDecorator={ getFieldDecorator }
                        field={ hiddenField }
                        initialValue={
                            !brandId ? String(brandId) : data.brandName
                        }
                    />
                </>
            );
        },
    };

    const certificate = {
        title:     'certificate',
        dataIndex: 'certificate',
        width:     '10%',
        render:    (certificate, data, index) => (
            <DecoratedInput
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.certificate` }
                initialValue={ certificate }
            />
        ),
    };

    const priceGroupNumber = {
        title:     'priceGroupNumber',
        dataIndex: 'priceGroupNumber',
        width:     '10%',
        render:    (priceGroupNumber, data, index) => {
            // console.log('→ priceGroupNumber', priceGroupNumber);

            return (
                <PriceGroupSelect
                    formItem={ false }
                    field={ `${index}.priceGroupNumber` }
                    initialValue={ priceGroupNumber }
                    getFieldDecorator={ getFieldDecorator }
                    getPopupContainer={ trigger => trigger.parentNode }
                    priceGroups={ priceGroups }
                    formatMessage={ formatMessage }
                />
            );
        },
    };

    const price = {
        title:     'price',
        dataIndex: 'price',
        width:     '10%',
        render:    (price, data, index) => (
            <DecoratedInputNumber
                fields={ {} }
                formItem
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.price` }
                initialValue={ price }
                rules={ [
                    {
                        required: true,
                        message:  formatMessage({
                            id: 'required_field',
                        }),
                    },
                ] }
            />
        ),
    };

    return [
        code,
        productGroup,
        measureUnit,
        name,
        brandId,
        certificate,
        priceGroupNumber,
        price,
    ];
}
