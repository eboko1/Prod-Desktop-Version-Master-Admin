// vendor
import React from 'react';

// proj
import {
    DecoratedInputNumber,
    DecoratedInput,
    DecoratedTreeSelect,
} from 'forms/DecoratedFields';

export function columnsConfig(
    dataSource,
    getFieldDecorator,
    formatMessage,
    storeGroups,
) {
    const productId = {
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
        title:     'productGroup',
        dataIndex: 'productGroup',
        width:     '10%',
        render:    (productGroup, data, index) => (
            <DecoratedTreeSelect
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.productGroup` }
                initialValue={ productGroup }
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

    const measure = {
        title:     'measure',
        dataIndex: 'measure',
        width:     '10%',
        render:    (measure, data, index) => (
            <DecoratedInput
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.measure` }
                initialValue={ measure }
            />
        ),
    };

    const productName = {
        title:     'productName',
        dataIndex: 'productName',
        width:     '20%',
        render:    (productName, data, index) => (
            <DecoratedInput
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.productName` }
                initialValue={ productName }
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
            <DecoratedInput
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.brandId` }
                initialValue={ brandId }
            />
        ),
    };

    const customCode = {
        title:     'customCode',
        dataIndex: 'customCode',
        width:     '10%',
        render:    (customCode, data, index) => (
            <DecoratedInput
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.customCode` }
                initialValue={ customCode }
            />
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

    const priceGroup = {
        title:     'priceGroup',
        dataIndex: 'priceGroup',
        width:     '10%',
        render:    (priceGroup, data, index) => (
            <DecoratedInput
                fields={ {} }
                getFieldDecorator={ getFieldDecorator }
                field={ `${index}.priceGroup` }
                initialValue={ priceGroup }
            />
        ),
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
        productId,
        productGroup,
        measure,
        productName,
        brandId,
        customCode,
        certificate,
        priceGroup,
        price,
    ];
}
