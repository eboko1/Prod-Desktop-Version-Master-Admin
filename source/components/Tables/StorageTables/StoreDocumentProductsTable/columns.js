// vendor
import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import ActionsIcons from 'commons/_uikit/ActionIcons';
import {
    DecoratedInput,
    DecoratedInputNumber,
    DecoratedSelect,
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
    const { getFieldDecorator } = props.form;
    const { fields } = props.form;

    const getRequiredRule = (rows, key, index) => {
        if (index === 0 || rows > index && rows !== index + 1) {
            return [
                {
                    required: true,
                    message:  formatMessage({
                        id: 'required_field',
                    }),
                },
            ];
        }

        return [];
    };

    const _isFieldDisabled = key =>
        !props.form.getFieldValue(`docProducts[${key}].productId`);

    return [
        {
            title:  formatMessage({ id: 'storage.product_code' }),
            width:  '20%',
            key:    'code',
            render: ({ key }) => {
                return (
                    <DecoratedSelect
                        formItem
                        fields={ {} }
                        getFieldDecorator={ getFieldDecorator }
                        getPopupContainer={ trigger => trigger.parentNode }
                        field={ `docProducts[${key}].productId` }
                        initialValue={ _.get(
                            props,
                            `incomeDoc.docProducts[${key}].product.id`,
                        ) }
                        onBlur={ () => {} }
                        onSearch={ value => {
                            props.setStoreProductsSearchQuery(value);
                        } }
                        onSelect={ value =>
                            table.handleProductSelect(key, value)
                        }
                        showSearch
                        dropdownMatchSelectWidth={ false }
                        rules={ getRequiredRule(state.keys.length, key) }
                    >
                        { !_.isEmpty(props.searchStoreProducts) ? 
                            [ ...props.searchStoreProducts || [] ].map(
                                ({ id, code }) => (
                                    <Option value={ id } key={ v4() }>
                                        { code }
                                    </Option>
                                ),
                            )
                            : (
                                <Option
                                    value={ _.get(
                                        props,
                                        `incomeDoc.docProducts[${key}].product.id`,
                                    ) }
                                    key={ v4() }
                                >
                                    { _.get(
                                        props,
                                        `incomeDoc.docProducts[${key}].product.code`,
                                    ) }
                                </Option>
                            ) }
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
                    <>
                        <DecoratedInput
                            fields={ {} }
                            // defaultGetValueProps
                            initialValue={
                                _.get(
                                    props,
                                    `incomeDoc.docProducts[${key}].product.brand.name`,
                                ) ||
                                _.get(
                                    props,
                                    `incomeDoc.docProducts[${key}].product.brandName`,
                                )
                            }
                            field={ `docProducts[${key}].brandName` }
                            disabled
                            getFieldDecorator={ props.form.getFieldDecorator }
                        />
                        <DecoratedInput
                            hiddeninput='hiddeninput'
                            fields={ {} }
                            getFieldDecorator={ props.form.getFieldDecorator }
                            field={ `docProducts[${key}].brandId` }
                            initialValue={ _.get(
                                props,
                                `incomeDoc.docProducts[${key}].product.brandId`,
                            ) }
                        />
                    </>
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
                        `incomeDoc.docProducts[${key}].product.certificate`,
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
                        formItem
                        fields={ {} }
                        rules={ getRequiredRule(state.keys.length, key, index) }
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
                    rules={ getRequiredRule(state.keys.length, key, index) }
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
                        formItem
                        fields={ {} }
                        field={ `docProducts[${key}].purchaseSum` }
                        getFieldDecorator={ props.form.getFieldDecorator }
                        formatter={ numeralFormatter }
                        parser={ numeralParser }
                        disabled
                        initialValue={ _.get(
                            props,
                            `incomeDoc.docProducts[${key}].purchaseSum`,
                        ) }
                        rules={ getRequiredRule(state.keys.length, key, index) }
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
