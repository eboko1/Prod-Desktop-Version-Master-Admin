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
    // console.log('→ from.getFieldsValue', form.getFieldsValue());

    const log = (brandId, index) => {
        console.group([ `_${index}-row_` ]);
        console.log('→ brandId', brandId);
        console.log('getFieldValue brandId', getFieldValue(`${index}.brandId`));
        console.log(
            'getFieldValue brandName',
            getFieldValue(`${index}.brandName`),
        );
        console.groupEnd();
    };

    const code = {
        title: formatMessage({
            id: 'storage.product_code',
        }),
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
        title: formatMessage({
            id: 'storage.product_group',
        }),
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
        title: formatMessage({
            id: 'storage.measure_unit',
        }),
        dataIndex: 'measureUnit',
        width:     '5%',
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
        title: formatMessage({
            id: 'storage.name',
        }),
        dataIndex: 'name',
        width:     '10%',
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
        title: formatMessage({
            id: 'storage.brand',
        }),
        dataIndex: 'brandId',
        width:     '10%',
        render:    (brandId, data, index) => {
            console.log('→ !!!!data', data);
            const field = brandId ? `${index}.brandId` : `${index}.brandName`;
            const hiddenField = brandId
                ? `${index}.brandName`
                : `${index}.brandId`;

            return (
                <>
                    <DecoratedAutoComplete
                        fields={ {} }
                        // labelInValue
                        defaultGetValueProps
                        getFieldDecorator={ getFieldDecorator }
                        field={ field }
                        initialValue={
                            brandId ? String(brandId) : data.brandName
                        }
                        onSearch={ value => {
                            // console.log('onSearch value', value);
                            // setFieldsValue({
                            //     [ `${index}.brandId` ]:   null,
                            //     [ `${index}.brandName` ]: `custom.${value}`,
                            // });
                            // resetFields({
                            //     [brandId ? `${index}.brandId` : `${index}.brandName`]
                            // })
                            setBrandsSearchQuery(value);
                        } }
                        onSelect={ value => {
                            console.log('onSelect value', value);
                            // setFieldsValue({ [ `${index}.brandId` ]: value });
                            setFieldsValue({
                                [ `${index}.brandId` ]:   value,
                                [ `${index}.brandName` ]: null,
                            });
                            // resetFields([ `${index}.brandName` ]);
                        } }
                        optionLabelProp={ 'children' }
                        optionFilterProp={ 'children' }
                        showSearch
                        dropdownMatchSelectWidth={ false }
                    >
                        { /* { console.log('brandId', brandId) } */ }
                        { log(brandId, index) }

                        { brandId ? (
                            <Option value={ String(brandId) } key={ brandId }>
                                { /* { console.log('brandName', data.brandName) } */ }
                                { data.brandName }
                            </Option>
                        ) : null }
                        { !_.isEmpty(brands)
                            ? brands.map(({ brandName, brandId }) => (
                                <Option value={ String(brandId) } key={ brandId }>
                                    { brandName || data.brandName }
                                </Option>
                            ))
                            : null }
                        { /* { _.isEmpty(brands) && brandId ? (
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
                        } */ }
                    </DecoratedAutoComplete>
                    <DecoratedInput
                        hiddeninput='hiddeninput'
                        fields={ {} }
                        getFieldDecorator={ getFieldDecorator }
                        field={ hiddenField }
                        initialValue={ brandId ? data.brandName : void 0 }
                    />
                </>
            );
        },
    };

    const tradeCode = {
        title: formatMessage({
            id: 'storage.trade_code',
        }),
        dataIndex: 'tradeCode',
        width:     '10%',
        render:    (tradeCode, data, index) => (
            <DecoratedInput
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.tradeCode` }
                initialValue={ tradeCode }
            />
        ),
    };

    const certificate = {
        title: formatMessage({
            id: 'storage.certificate',
        }),
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
        title: formatMessage({
            id: 'storage.price_group',
        }),
        dataIndex: 'priceGroupNumber',
        width:     '10%',
        render:    (priceGroupNumber, data, index) => {
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
        title: formatMessage({
            id: 'storage.price',
        }),
        dataIndex: 'price',
        width:     'auto',
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
        tradeCode,
        certificate,
        priceGroupNumber,
        price,
    ];
}
