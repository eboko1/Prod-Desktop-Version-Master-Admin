// vendor
import React from 'react';
import { Select } from 'antd';
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

// const requiredLimitedOptions = (
//     details,
//     formFieldName,
//     entityFieldName,
//     source,
//     sourceFilter,
// ) => {
//     return (
//         _(details)
//             .map(formFieldName)
//             .map(name => _.find(source, { [ sourceFilter ]: Number(name) }))
//             .map(entityFieldName)
//             .filter(Boolean)
//             .value() || []
//     );
// };

export default (props, state, table) => {
    const { fields, errors } = props;
    const { formatMessage } = props.intl;
    const { getFieldDecorator } = props.form;

    const requiredRule = [
        {
            required: true,
            message:  formatMessage({
                id: 'required_field',
            }),
        },
    ];

    const _isFieldDisabled = key => !props.form.getFieldValue(`${key}.code`);

    return [
        {
            title:  formatMessage({ id: 'storage.product_code' }),
            width:  '20%',
            key:    'code',
            render: data => {
                const handleBlur = (key, value) => {
                    if (value) {
                        table.handleProductSelect(key, value);
                    }
                };

                return (
                    <DecoratedSelect
                        formItem
                        // formItemLayout={ formItemLayout }
                        fieldValue={ _.get(
                            props,
                            `form.fields[${data.key}.code]`,
                        ) }
                        fields={ {} }
                        getFieldDecorator={ getFieldDecorator }
                        getPopupContainer={ trigger => trigger.parentNode }
                        field={ `${data.key}.code` }
                        initialValue={ _.get(
                            props,
                            `incomeDoc.docProducts[${data.key}].product.code`,
                        ) }
                        onBlur={ value => handleBlur(data.key, value) }
                        // onBlur={ value => handleBlur(value, `${data.key}.code`) }
                        onSearch={ value => {
                            props.setStoreProductsSearchQuery(value);
                        } }
                        onSelect={ value =>
                            table.handleProductSelect(data.key, value)
                        }
                        showSearch
                        dropdownMatchSelectWidth={ false }
                        rules={ requiredRule }
                    >
                        { props.storeProducts.map(({ id, code }) => (
                            <Option value={ code } key={ id }>
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
                    errors={ errors }
                    defaultGetValueProps
                    // fieldValue={ _.get(fields, `details[${key}].detailCode`) }

                    // initialValue={ _getDefaultValue(key, 'code') }
                    field={ `${key}].name` }
                    disabled={ _isFieldDisabled(key) }
                    getFieldDecorator={ props.form.getFieldDecorator }
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
                        field='brandId'
                        initialValue={ _.get(props, 'product.brandId') }
                        onSearch={ value => {
                            props.form.setFieldsValue({
                                brandId:   void 0,
                                brandName: value,
                            });
                            props.setBrandsSearchQuery(value);
                        } }
                        onSelect={ value => {
                            props.form.setFieldsValue({
                                brandId:   value,
                                brandName: void 0,
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
            title:  formatMessage({ id: 'order_form_table.purchasePrice' }),
            width:  '15%',
            key:    'purchasePrice',
            render: ({ key }) => (
                <DecoratedInputNumber
                    errors={ errors }
                    defaultGetValueProps
                    // fieldValue={ _.get(fields, `${key}.purchasePrice`) }
                    // initialValue={ _getDefaultValue(key, 'purchasePrice') }
                    field={ `${key}.purchasePrice` }
                    disabled={ _isFieldDisabled(key) }
                    getFieldDecorator={ props.form.getFieldDecorator }
                    min={ 0 }
                    formatter={ numeralFormatter }
                    parser={ numeralParser }
                />
            ),
        },
        // {
        //     title: <FormattedMessage id="order_form_table.price" />,
        //     width: "9%",
        //     key: "price",
        //     render: ({ key }) => (
        //         <DecoratedInputNumber
        //             className={Styles.detailsRequiredFormItem}
        //             rules={
        //                 !_isFieldDisabled(key)
        //                     ? this.requiredRule
        //                     : void 0
        //             }
        //             errors={errors}
        //             formItem
        //             fieldValue={_.get(
        //                 fields,
        //                 `details[${key}].detailPrice`,
        //             )}
        //             field={`details[${key}].detailPrice`}
        //             getFieldDecorator={
        //                 props.form.getFieldDecorator
        //             }
        //             disabled={
        //                 _isFieldDisabled(key) ||
        //                 editDetailsForbidden
        //             }
        //             initialValue={
        //                 _getDefaultValue(key, "detailPrice") || 0
        //             }
        //             min={0}
        //             formatter={numeralFormatter}
        //             parser={numeralParser}
        //         />
        //     ),
        // },
        {
            title:  formatMessage({ id: 'storage.quantity' }),
            width:  '7.5%',
            key:    'quantity',
            render: ({ key }) => (
                <DecoratedInputNumber
                    // className={ Styles.detailsRequiredFormItem }
                    // rules={ !_isFieldDisabled(key) ? this.requiredRule : void 0 }
                    errors={ errors }
                    formItem
                    fieldValue={ _.get(fields, `${key}.quantity`) }
                    field={ `${key}.quantity` }
                    getFieldDecorator={ getFieldDecorator }
                    disabled={ _isFieldDisabled(key) }
                    initialValue={ _isFieldDisabled(key) ? void 0 : 1 }
                    min={ 0.1 }
                    step={ 0.1 }
                    formatter={ numeralFormatter }
                    parser={ numeralParser }
                />
            ),
        },
        // {
        //     title: <FormattedMessage id="order_form_table.sum" />,
        //     width: "10%",
        //     key: "sum",
        //     render: ({ key }) => {
        //         const details = props.details;
        //         const value = (
        //             _.get(details, [key, "detailPrice"], 0) *
        //             _.get(details, [key, "detailCount"], 0)
        //         ).toFixed(2);

        //         return (
        //             <InputNumber
        //                 className={Styles.sum}
        //                 disabled
        //                 defaultValue={0}
        //                 value={value}
        //                 formatter={numeralFormatter}
        //                 parser={numeralParser}
        //             />
        //         );
        //     },
        // },
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
