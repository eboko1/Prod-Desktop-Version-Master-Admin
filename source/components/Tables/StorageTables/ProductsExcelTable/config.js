// vendor
import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';

// proj
import {
    // DecoratedInputNumber,
    DecoratedInput,
    DecoratedTreeSelect,
    DecoratedAutoComplete,
} from 'forms/DecoratedFields';
import { MeasureUnitSelect, PriceGroupSelect } from 'forms/_formkit';

// own
import Styles from './styles.m.css';
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
    const { getFieldDecorator, setFieldsValue } = form;

    const code = {
        title: formatMessage({
            id: 'storage.product_code',
        }),
        dataIndex: 'code',
        width:     'auto',
        render:    (code, data, index) => (
            <>
                <DecoratedInput
                    formItem
                    cnStyles={ data.alreadyExists && Styles.duplicate }
                    disabled={ !_.isNil(data.alreadyExists) }
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
                <DecoratedInput
                    hiddeninput='hiddeninput'
                    fields={ {} }
                    getFieldDecorator={ getFieldDecorator }
                    field={ `${index}.alreadyExists` }
                    initialValue={ data.alreadyExists }
                />
            </>
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
                formItem
                allowClear={ false }
                cnStyles={ data.alreadyExists && Styles.duplicate }
                disabled={ !_.isNil(data.alreadyExists) }
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
                formItem
                cnStyles={ data.alreadyExists && Styles.duplicate }
                disabled={ !_.isNil(data.alreadyExists) }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.measureUnit` }
                formatMessage={ formatMessage }
                initialValue={ measureUnit }
                rules={ [
                    {
                        required: true,
                        message:  'required!',
                    },
                ] }
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
                formItem
                cnStyles={ data.alreadyExists && Styles.duplicate }
                disabled={ !_.isNil(data.alreadyExists) }
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
            const field = brandId ? `${index}.brandId` : `${index}.brandName`;
            const hiddenField = brandId
                ? `${index}.brandName`
                : `${index}.brandId`;

            return (
                <>
                    <DecoratedAutoComplete
                        fields={ {} }
                        formItem
                        // labelInValue
                        cnStyles={ data.alreadyExists && Styles.duplicate }
                        disabled={ !_.isNil(data.alreadyExists) }
                        defaultGetValueProps
                        getFieldDecorator={ getFieldDecorator }
                        field={ field }
                        initialValue={
                            brandId ? String(brandId) : data.brandName
                        }
                        onSearch={ value => {
                            setFieldsValue({
                                [ `${index}.brandId` ]:   null,
                                [ `${index}.brandName` ]: value,
                            });

                            setBrandsSearchQuery(value);
                        } }
                        onSelect={ value => {
                            setFieldsValue({
                                [ `${index}.brandId` ]:   value,
                                [ `${index}.brandName` ]: null,
                            });
                        } }
                        optionLabelProp={ 'children' }
                        optionFilterProp={ 'children' }
                        showSearch
                        dropdownMatchSelectWidth={ false }
                    >
                        { brandId ? (
                            <Option value={ String(brandId) } key={ brandId }>
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
                formItem
                cnStyles={ data.alreadyExists && Styles.duplicate }
                disabled={ !_.isNil(data.alreadyExists) }
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.tradeCode` }
                initialValue={ String(tradeCode) }
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
                formItem
                cnStyles={ data.alreadyExists && Styles.duplicate }
                disabled={ !_.isNil(data.alreadyExists) }
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.certificate` }
                initialValue={ String(certificate) }
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
                    cnStyles={ data.alreadyExists && Styles.duplicate }
                    disabled={ !_.isNil(data.alreadyExists) }
                    formItem
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

    // const price = {
    //     title: formatMessage({
    //         id: 'storage.price',
    //     }),
    //     dataIndex: 'price',
    //     width:     'auto',
    //     render:    (price, data, index) => (
    //         <DecoratedInputNumber
    //             cnStyles={ data.alreadyExists && Styles.duplicate }
    //             disabled={ !_.isNil(data.alreadyExists) }
    //             fields={ {} }
    //             formItem
    //             getFieldDecorator={ getFieldDecorator }
    //             field={ `${index}.price` }
    //             initialValue={ price }
    //             rules={ [
    //                 {
    //                     required: true,
    //                     message:  formatMessage({
    //                         id: 'required_field',
    //                     }),
    //                 },
    //             ] }
    //         />
    //     ),
    // };

    return [
        code,
        productGroup,
        measureUnit,
        name,
        brandId,
        tradeCode,
        certificate,
        priceGroupNumber,
        // price,
    ];
}
