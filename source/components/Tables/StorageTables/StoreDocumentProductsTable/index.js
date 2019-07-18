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

const DocumentProductsTable = props => {
    const incomeDocProducts = _.get(props, 'incomeDoc.docProducts');
    const incomeDocId = _.get(props, 'incomeDoc.id');
    const incomeDocSum = _.get(props, 'incomeDoc.sum', 0);
    const [ docProducts, setDocProducts ] = useState();
    const [ forceRerender, setForceRerender ] = useState(false);
    const [ keys, setKeys ] = useState(() => {
        const products = docProducts ? docProducts.length + 1 : 1;

        return [ ..._.keys(docProducts), products ];
    });

    useEffect(() => {
        if (incomeDocProducts) {
            setDocProducts(incomeDocProducts);

            setKeys([ ..._.keys(incomeDocProducts).map(key => Number(key)), incomeDocProducts.length ]);
        }
    }, [ incomeDocProducts ]);

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
        console.log('→ key, value', key, value);
        const selectedProduct = props.storeProducts.find(
            ({ id }) => id === value,
        );
        console.log('→ selectedProduct', selectedProduct);
        props.form.setFieldsValue({
            [ `docProducts[${key}].name` ]:      selectedProduct.name,
            [ `docProducts[${key}].tradeCode` ]: selectedProduct.tradeCode,
        });
        setForceRerender(prev => {
            console.log('→ FORCE');
            return !prev
        });
        console.log('→ props.form', props.form.getFieldsValue());
        if (_.last(keys) === key && !_.get(docProducts, [ key, 'productId' ])) {
            _handleAdd();
        }
    };

    const _handleSumCalculation = (fieldKey, field, value) => {
        // fieldKey isEqual with update flow but +1 for creation because of [empty] at first docProduct array index
        const key = incomeDocId ? fieldKey : fieldKey - 1;

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
            }, incomeDocSum);
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
                dataSource={ keys.map(key => ({ key })) }
                columns={ columns(
                    props,
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
};

const mapStateToProps = state => ({
    storeProducts: selectStoreProductsByQuery(state),
    brands:        selectBrandsByQuery(state),
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
