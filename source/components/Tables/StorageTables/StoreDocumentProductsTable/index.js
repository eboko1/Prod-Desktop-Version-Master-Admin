// vendor
import React, { useState, useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import {
    setStoreProductsSearchQuery,
    selectStoreProductsByQuery,
    setBrandsSearchQuery,
    selectBrandsByQuery,
} from 'core/search/duck';
import { Catcher } from 'commons';

// own
import columns from './columns';

const DocumentProductsTable = memo(props => {
    const incomeDocProducts = _.get(props, 'incomeDoc.docProducts');
    const incomeDocId = _.get(props, 'incomeDoc.id');

    const [ docProducts, setDocProducts ] = useState();
    const [ keys, setKeys ] = useState(() => {
        const products = docProducts ? docProducts.length : 0;

        return [ ..._.keys(docProducts), products ];
    });
    const [ searchStoreProducts, setSearchStoreProducts ] = useState(() => ({
        storeProducts: [[]],
    }));

    useEffect(() => {
        if (incomeDocProducts) {
            setDocProducts(incomeDocProducts);

            setKeys([ ..._.keys(incomeDocProducts).map(key => Number(key)), incomeDocProducts.length ]);

            setSearchStoreProducts({
                storeProducts: [
                    ...(incomeDocProducts || []).map(({ product }) => {
                        if (product) {
                            return [ ...props.searchStoreProducts, { ...product }];
                        }

                        return [ ...props.searchStoreProducts ];
                    }),
                    props.searchStoreProducts,
                ],
            });
        }
    }, [ incomeDocProducts ]);

    const getSums = key => {
        const totalSum = props.form.getFieldValue('sum');
        const sum = props.form.getFieldValue(`docProducts[${key}].purchaseSum`);

        return { totalSum, sum };
    };

    const _handleDelete = redundantKey => {
        const { totalSum, sum } = getSums(redundantKey);
        setKeys(keys.filter(key => redundantKey !== key));

        props.form.setFieldsValue({
            sum:              totalSum - sum,
            [ redundantKey ]: void 0,
        });
    };

    const _handleAdd = () => {
        setKeys([ ...keys, _.last(keys) + 1 ]);
    };

    const _handleProductSelect = (key, value) => {
        const selectedProduct = _.uniqBy(
            [ ...props.searchStoreProducts, ...searchStoreProducts.storeProducts[ key ] || [] ],
            'id',
        ).find(({ id }) => id === value);

        props.form.setFieldsValue({
            [ `docProducts[${key}].name` ]:      selectedProduct.name,
            [ `docProducts[${key}].tradeCode` ]: selectedProduct.tradeCode,
            [ `docProducts[${key}].brandName` ]: selectedProduct.brand
                ? selectedProduct.brand.name
                : selectedProduct.brandName,
            [ `docProducts[${key}].brandId` ]: selectedProduct.brand
                ? selectedProduct.brand.id
                : null,
        });

        if (_.last(keys) === key && !_.get(docProducts, [ key, 'productId' ])) {
            setSearchStoreProducts({
                storeProducts: [ ...searchStoreProducts.storeProducts.slice(-1), props.searchStoreProducts, []],
            });
            _handleAdd();
        }
    };

    const _handleSumCalculation = (fieldKey, field, value) => {
        const key = incomeDocId ? fieldKey : fieldKey;
        const purchasePrice = props.form.getFieldValue(
            `docProducts[${fieldKey}].purchasePrice`,
        );
        const quantity = props.form.getFieldValue(
            `docProducts[${fieldKey}].quantity`,
        );

        const getTotalSum = key => {
            let docProducts = props.form
                .getFieldValue('docProducts')
                .filter(Boolean);

            docProducts.splice(key, 1, {
                ...docProducts[ key ],
                purchaseSum: field.includes('purchasePrice')
                    ? value * quantity
                    : purchasePrice * value,
            });

            return docProducts.reduce((accumulator, product) => {
                return accumulator + (product.purchaseSum || 0);
            }, 0);
        };

        const totalSum = getTotalSum(key);

        if (field.includes('purchasePrice')) {
            props.form.setFieldsValue({
                [ `docProducts[${fieldKey}].purchaseSum` ]: value * quantity,
                sum:                                        totalSum,
            });
        }
        if (field.includes('quantity')) {
            props.form.setFieldsValue({
                [ `docProducts[${fieldKey}].purchaseSum` ]: purchasePrice * value,
                sum:                                        totalSum,
            });
        }
    };

    return (
        <Catcher>
            <Table
                // className={Styles.detailsTable}
                loading={ props.brandsFetching }
                dataSource={ keys.map((key, index) => ({ key, index })) }
                columns={ columns(
                    {
                        ...props,
                        ...searchStoreProducts,
                    },
                    { keys },
                    {
                        handleAdd:                   _handleAdd,
                        handleDelete:                _handleDelete,
                        handleProductSelect:         _handleProductSelect,
                        handleSumCalculation:        _handleSumCalculation,
                        setStoreProductsSearchQuery: setStoreProductsSearchQuery,
                        setBrandsSearchQuery:        setBrandsSearchQuery,
                        // getDefaultValue:     _getDefaultValue,
                    },
                ) }
                pagination={ false }
            />
        </Catcher>
    );
});

const mapStateToProps = state => ({
    searchStoreProducts: selectStoreProductsByQuery(state),
    brands:              selectBrandsByQuery(state),
});

const mapDispatchToProps = {
    setStoreProductsSearchQuery,
    setBrandsSearchQuery,
};

export const StoreDocumentProductsTable = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(DocumentProductsTable),
);
