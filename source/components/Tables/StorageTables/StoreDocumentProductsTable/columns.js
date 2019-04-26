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

    const requiredRule = [
        {
            required: true,
            message:  formatMessage({
                id: 'required_field',
            }),
        },
    ];

    const _isFieldDisabled = key =>
        !props.form.getFieldValue(`docProducts[${key}].productId`);

    return [
        {
            title:  formatMessage({ id: 'storage.product_code' }),
            width:  '20%',
            key:    'code',
            render: ({ key }) => {
                const handleBlur = (key, value) => {
                    if (value) {
                        table.handleProductSelect(key, value);
                    }
                };

                // console.log('→ props.incomeDoc', props.incomeDoc);
                // console.log('→ props.storeProducts', props.storeProducts);

                return (
                    <DecoratedSelect
                        formItem
                        // formItemLayout={ formItemLayout }
                        fieldValue={ _.get(
                            props,
                            `form.fields.docProducts[${key}].productId`,
                        ) }
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
                        // rules={ requiredRule }
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
                    // errors={ errors }
                    defaultGetValueProps
                    // fieldValue={ _.get(fields, `details[${key}].detailCode`) }

                    field={ `docProducts[${key}].name` }
                    disabled={ _isFieldDisabled(key) }
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
                        field={ `docProducts[${key}].brandId'` }
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
                        disabled={ _isFieldDisabled(key) }
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
                    // errors={ errors }
                    defaultGetValueProps
                    // fieldValue={ _.get(fields, `details[${key}].detailCode`) }

                    field={ `docProducts[${key}].tradeCode` }
                    disabled={ _isFieldDisabled(key) }
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
            render: ({ key }) => {
                // const quantity = props.form.getFieldValue(
                //     `docProducts[${key}].quantity`,
                // );

                // const handleChange = value => {
                //     props.form.setFieldsValue([
                //         {
                //             [ `docProducts[${key}].purchaseSum` ]:
                //                 value * quantity,
                //         },
                //     ]);
                // };

                return (
                    <DecoratedInputNumber
                        // errors={ errors }
                        defaultGetValueProps
                        // fieldValue={ _.get(fields, `${key}.purchasePrice`) }
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
            render: ({ key }) => (
                <DecoratedInputNumber
                    // className={ Styles.detailsRequiredFormItem }
                    // rules={ !_isFieldDisabled(key) ? this.requiredRule : void 0 }
                    // errors={ errors }
                    formItem
                    // fieldValue={ _.get(fields, `${key}.quantity`) }
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
            render: ({ key }) => {
                // const details = props.details;
                // const purchasePrice = props.form.getFieldValue(
                //     `docProducts[${key}].purchasePrice`,
                // );
                // console.log(
                //     '|| docProducts',
                //     props.form.getFieldValue('docProducts'),
                // );
                // console.log('||| key', key);
                // const quantity = props.form.getFieldValue(
                //     `docProducts[${key}].quantity`,
                // );
                // console.log('||| purchasePrice', purchasePrice);
                // console.log('||| quantity', quantity);
                // const value = (purchasePrice * quantity).toFixed(2);
                // console.log('→ value', value);
                // props.form.setFieldsValue([{ [ `docProducts[${key}].purchaseSum` ]: value }]);

                return (
                    <DecoratedInputNumber
                        // disabled
                        fields={ {} }
                        field={ `docProducts[${key}].purchaseSum` }
                        getFieldDecorator={ props.form.getFieldDecorator }
                        // value={ Number(value) }
                        formatter={ numeralFormatter }
                        parser={ numeralParser }
                        // defaultValue={ 0 }
                        // initialValue={ _isFieldDisabled(key) ? void 0 : 1 }
                        initialValue={ _.get(
                            props,
                            `incomeDoc.docProducts[${key}].purchaseSum`,
                        ) }
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
