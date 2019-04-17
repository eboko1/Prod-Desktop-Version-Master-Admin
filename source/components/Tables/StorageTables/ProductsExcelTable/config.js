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
    getFieldDecorator,
    formatMessage,
    storeGroups,
    priceGroups,
    brands,
    setBrandsSearchQuery,
    getFieldValue,
) {
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
        title:     'storeGroup',
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

        // render:    (productGroup, data, index) => (
        //     <DecoratedInput
        //         fields={ {} }
        //         getFieldDecorator={ getFieldDecorator }
        //         field={ `${index}.productGroup` }
        //         initialValue={ productGroup }
        //         rules={ [
        //             {
        //                 required: true,
        //                 message:  'required!',
        //             },
        //         ] }
        //     />
        // ),
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
        render:    (brandId, data, index) => (
            <DecoratedAutoComplete
                fields={ {} }
                defaultGetValueProps
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.brandId` }
                initialValue={ brandId }
                // fieldValue={ _.get(fields, `services[${key}].serviceName`) }
                // initialValue={ this._getDefaultValue(key, 'serviceName') }
                // onSelect={ value =>
                //     this._onServiceSelect(
                //         value,
                //         _.get(fields, `services[${key}].ownDetail`),
                //     )
                // }
                // onChange={ e => console.log('cha', e) }
                onSearch={ value => {
                    console.log('onSearch', value);
                    setBrandsSearchQuery(value);
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
                { brands.map(({ brandName, brandId }) => (
                    <Option value={ String(brandId) } key={ brandId }>
                        { brandName }
                    </Option>
                )) }
            </DecoratedAutoComplete>
        ),
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
            console.log('→ priceGroupNumber', priceGroupNumber);

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
