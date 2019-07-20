// vendor
import React from 'react';
import { Select, InputNumber } from 'antd';
import _ from 'lodash';

// proj
import ActionsIcons from 'commons/_uikit/ActionIcons';
import {
    DecoratedInput,
    DecoratedInputNumber,
    DecoratedSelect,
    DecoratedAutoComplete,
} from 'forms/DecoratedFields';
import {
    // permissions,
    // isForbidden,
    // CachedInvoke,
    numeralFormatter,
    numeralParser,
} from 'utils';

// own
const Option = Select.Option;

export default (props, state, table) => {
    const { formatMessage } = props.intl;
    const { getFieldDecorator, getFieldValue } = props.form;
    const { fields } = props.form;
    const requiredRule = [
        {
            required: true,
            message:  formatMessage({
                id: 'required_field',
            }),
        },
    ];

    console.log('→ getFieldsValue', props.form.getFieldsValue());

    const isRulesActive = index => {
        // console.log('→ if', getFieldValue('docProducts'));
        // return false;
        console.log('→ index', index);
        if (Array.isArray(getFieldValue('docProducts'))) {
            console.log('→ if', getFieldValue('docProducts'));
            const filteredDocProducts = getFieldValue('docProducts').filter(
                elem => elem,
            );
            console.log(
                '→ 22filteredDocProducts.length',
                filteredDocProducts.length,
            );
            console.log('→ 222index', index);
            if (filteredDocProducts.length !== index + 1) {
                return requiredRule;
            }
            // return false;
        }

        // return [{}];
    };

    const _isFieldDisabled = key =>
        !props.form.getFieldValue(`docProducts[${key}].productId`);

    return [
        {
            title:  formatMessage({ id: 'storage.product_code' }),
            width:  '20%',
            key:    'code',
            render: ({ key, index }) => {
                console.log('→ key', key);
                console.log('→ index', index);
                console.log('→ aa', getFieldValue('docProducts'));
                //console.log('→ aa', getFieldValue('docProducts') && getFieldValue('docProducts').length);
                const handleBlur = (key, value) => {
                    if (value) {
                        table.handleProductSelect(key, value);
                    }
                };
                console.log('→ aaa props', props);

                return (
                    <DecoratedSelect
                        formItem
                        // fieldValue={ _.get(
                        //     props,
                        //     `form.fields.docProducts[${key}].productId`,
                        // ) }
                        fields={ {} }
                        getFieldDecorator={ getFieldDecorator }
                        getPopupContainer={ trigger => trigger.parentNode }
                        field={ `docProducts[${key}].productId` }
                        initialValue={ _.get(
                            props,
                            `incomeDoc.docProducts[${key}].product.id`,
                        ) }
                        onBlur={ value => handleBlur(key, value) }
                        // onBlur={ value => handleBlur(value, `${data.key}.productId`) }
                        onSearch={ value => {
                            props.setStoreProductsSearchQuery(value);
                        } }
                        onSelect={ value =>
                            table.handleProductSelect(key, value)
                        }
                        showSearch
                        dropdownMatchSelectWidth={ false }
                        rules={ isRulesActive(index) }
                        // rules={
                        //     getFieldValue('docProducts') &&
                        //     getFieldValue('docProducts').length !== key
                        //         ? requiredRule
                        //         : []
                        // }
                        // rules={ docProducts[key] === docProducts.length ? requiredRule : []}
                    >
                        { props.storeProducts.map(({ id, code }) => (
                            <Option value={ id } key={ id }>
                                { code }
                            </Option>
                        )) }
                    </DecoratedSelect>
                );
            },
        },
        {
            title:  formatMessage({ id: 'storage.product_name' }),
            width:  '20%',
            key:    'name',
            render: ({ key }) => (
                <DecoratedInput
                    fields={ {} }
                    // errors={ errors }
                    // defaultGetValueProps
                    fieldValue={ _.get(fields, `details[${key}].name`) }
                    field={ `docProducts[${key}].name` }
                    disabled
                    getFieldDecorator={ props.form.getFieldDecorator }
                    initialValue={ _.get(
                        props,
                        `incomeDoc.docProducts[${key}].product.name`,
                    ) }
                />
            ),
        },
        {
            title:  formatMessage({ id: 'storage.brand' }),
            width:  '10%',
            key:    'brandId',
            render: ({ key }) => {
                return (
                    <DecoratedAutoComplete
                        // formItemLayout={ formItemLayout }
                        fields={ {} }
                        defaultGetValueProps
                        getFieldDecorator={ getFieldDecorator }
                        getPopupContainer={ trigger => trigger.parentNode }
                        field={ `docProducts[${key}].brandId` }
                        // initialValue={ props.storeProducts[ key ].brandId }
                        onSearch={ value => {
                            props.form.setFieldsValue({
                                [ `docProducts[${key}].brandId` ]:   void 0,
                                [ `docProducts[${key}].brandName` ]: value,
                            });
                            props.setBrandsSearchQuery(value);
                        } }
                        onSelect={ value => {
                            props.form.setFieldsValue({
                                [ `docProducts[${key}].brandId` ]:   value,
                                [ `docProducts[${key}].brandName` ]: void 0,
                            });
                        } }
                        optionLabelProp={ 'children' }
                        optionFilterProp={ 'children' }
                        showSearch
                        dropdownMatchSelectWidth={ false }
                        disabled
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
                );
            },
        },
        {
            title:  formatMessage({ id: 'storage.trade_code' }),
            width:  '20%',
            key:    'tradeCode',
            render: ({ key }) => (
                <DecoratedInput
                    fields={ {} }
                    field={ `docProducts[${key}].tradeCode` }
                    disabled
                    getFieldDecorator={ props.form.getFieldDecorator }
                    initialValue={ _.get(
                        props,
                        `incomeDoc.docProducts[${key}].product.code`,
                    ) }
                />
            ),
        },
        {
            title:  formatMessage({ id: 'order_form_table.purchasePrice' }),
            width:  '15%',
            key:    'purchasePrice',
            render: ({ key, index }) => {
                return (
                    <DecoratedInputNumber
                        fields={ {} }
                        // rules={ isRulesActive(key) }
                        // rules={
                        //     getFieldValue('docProducts') &&
                        //     getFieldValue('docProducts').length !== key
                        //         ? requiredRule
                        //         : []
                        // }
                        rules={ isRulesActive(index) }
                        initialValue={ _.get(
                            props,
                            `incomeDoc.docProducts[${key}].purchasePrice`,
                        ) }
                        field={ `docProducts[${key}].purchasePrice` }
                        disabled={ _isFieldDisabled(key) }
                        getFieldDecorator={ props.form.getFieldDecorator }
                        min={ 0 }
                        formatter={ numeralFormatter }
                        parser={ numeralParser }
                        onChange={ value =>
                            table.handleSumCalculation(
                                key,
                                `docProducts[${key}].purchasePrice`,
                                value,
                            )
                        }
                    />
                );
            },
        },
        {
            title:  formatMessage({ id: 'storage.quantity' }),
            width:  '7.5%',
            key:    'quantity',
            render: ({ key, index }) => (
                <DecoratedInputNumber
                    formItem
                    fields={ {} }
                    rules={ isRulesActive(index) }
                    // rules={
                    //     getFieldValue('docProducts') &&
                    //     getFieldValue('docProducts').length !== key
                    //         ? requiredRule
                    //         : []
                    // }
                    field={ `docProducts[${key}].quantity` }
                    getFieldDecorator={ getFieldDecorator }
                    disabled={ _isFieldDisabled(key) }
                    initialValue={
                        _isFieldDisabled(key)
                            ? void 0
                            : _.get(
                                props,
                                `incomeDoc.docProducts[${key}].quantity`,
                                1,
                            )
                    }
                    min={ 0.1 }
                    step={ 0.1 }
                    formatter={ numeralFormatter }
                    parser={ numeralParser }
                    onChange={ value =>
                        table.handleSumCalculation(
                            key,
                            `docProducts[${key}].quantity`,
                            value,
                        )
                    }
                />
            ),
        },
        {
            title:  formatMessage({ id: 'storage.sum' }),
            width:  '10%',
            key:    'sum',
            render: ({ key, index }) => {
                return (
                    <DecoratedInputNumber
                        fields={ {} }
                        rules={ isRulesActive(index) }
                        field={ `docProducts[${key}].purchaseSum` }
                        getFieldDecorator={ props.form.getFieldDecorator }
                        formatter={ numeralFormatter }
                        parser={ numeralParser }
                        disabled
                        initialValue={ _.get(
                            props,
                            `incomeDoc.docProducts[${key}].purchaseSum`,
                        ) }
                        // rules={ isRulesActive(key) }
                        // rules={
                        //     getFieldValue('docProducts') &&
                        //     getFieldValue('docProducts').length !== key
                        //         ? requiredRule
                        //         : []
                        // }
                    />
                );
            },
        },
        {
            title:  '',
            width:  'auto',
            key:    'delete',
            render: ({ key }) =>
                state.keys.length > 1 &&
                _.last(state.keys) !== key && (
                    <ActionsIcons delete={ () => table.handleDelete(key) } />
                ),
        },
    ];
};
