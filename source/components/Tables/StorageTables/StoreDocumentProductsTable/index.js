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
    const incomeDocSum = _.get(props, 'incomeDoc.sum', 0);

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

    // useEffect(() => {
    //     setSearchResult({storeProducts: [
    //         ...(docProducts || []).map(({ product }) => {
    //             if (product) {
    //                 return [ ...props.searchStoreProducts, { id: product.id, code: product.code }];
    //             }

    //             return [ ...props.searchStoreProducts ];
    //         }),
    //         props.searchStoreProducts,
    //     ]})
    // }, [])

    const _handleDelete = redundantKey => {
        setKeys(keys.filter(key => redundantKey !== key));
        props.form.setFieldsValue({
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
        // console.log('selectedProduct', selectedProduct);
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
        // TODO: check how it works with edit
    };

    const _handleSumCalculation = (fieldKey, field, value) => {
        // fieldKey isEqual with update flow but +1 for creation because of [empty] at first docProduct array index
        const key = incomeDocId ? fieldKey : fieldKey;
        // console.log('→ incomeDocId', incomeDocId);
        // console.log('!!!!!fieldKey', fieldKey);
        // console.log('!!!!!key', key);
        const purchasePrice = props.form.getFieldValue(
            `docProducts[${fieldKey}].purchasePrice`,
        );
        const quantity = props.form.getFieldValue(
            `docProducts[${fieldKey}].quantity`,
        );

        // const sum = props.form.getFieldValue('sum') || 0;

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
