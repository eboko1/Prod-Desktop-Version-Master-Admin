// vendor
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import {
    setStoreProductsSearchQuery,
    selectStoreProductsByQuery,
} from 'core/search/duck';
import { Catcher } from 'commons';

// own
// import Styles from "./styles.m.css";
import columns from './columns';

const DocumentProductsTable = props => {
    const incomeDocProducts = _.get(props, 'incomeDoc.docProducts');

    const [ docProducts, setDocProducts ] = useState();

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

    useEffect(() => {
        console.log('→ fetch magic!');
    }, [ props.storeProducts ]);

    // useEffect(() => {
    //     console.log('→ fetch magic!');
    // }, [ props.storeProducts ]);

    const _handleDelete = redundantKey => {
        // console.log('(1) redundantKey', redundantKey);
        // console.log('(2) keys', keys);
        // console.log(
        //     '(3) setKeys filter',
        //     keys.filter(key => redundantKey !== key),
        // );
        // console.log(
        //     '(5) props.form.setFieldsValue ',
        //     props.form.setFieldsValue,
        // );
        setKeys(keys.filter(key => redundantKey !== key));
        props.form.setFieldsValue({
            [ redundantKey ]: void 0,
        });
        // console.log('(2)(2) keys', keys);
    };

    const _handleAdd = () => {
        setKeys([ ...keys, _.last(keys) + 1 ]);
    };

    const _handleProductSelect = (key, value) => {
        const selectedProduct = props.storeProducts.find(
            ({ id }) => id === value,
        );
        props.form.setFieldsValue({
            [ `docProducts[${key}].name` ]:      selectedProduct.name,
            [ `docProducts[${key}].tradeCode` ]: selectedProduct.tradeCode,
        });
        if (_.last(keys) === key && !_.get(docProducts, [ key, 'productId' ])) {
            _handleAdd();
        }
    };

    const _handleSumCalculation = (key, field, value) => {
       
        const purchasePrice = props.form.getFieldValue(
            `docProducts[${key}].purchasePrice`,
        );
        const quantity = props.form.getFieldValue(
            `docProducts[${key}].quantity`,
        );
        const sum = props.form.getFieldValue('sum') || 0;

        const getTotalSum = key => {
            let docProducts = props.form
                .getFieldValue('docProducts')
                .filter(Boolean);

            docProducts.splice(key - 1, 1, {
                ...docProducts[ key - 1 ],
                purchaseSum: field.includes('purchasePrice') ? value * quantity : purchasePrice * value,
            
            });
     
            return docProducts.reduce((accumulator, product) => {        
                return accumulator + (product.purchaseSum || 0)
            }, 0);
        };

        const totalSum = getTotalSum(key);
     

        if (field.includes('purchasePrice')) {

            props.form.setFieldsValue({
                [ `docProducts[${key}].purchaseSum` ]: value * quantity,
                sum:                                   totalSum,
         
            });
        }
        if (field.includes('quantity')) {
            props.form.setFieldsValue({
                [ `docProducts[${key}].purchaseSum` ]: purchasePrice * value,
                sum:                                   totalSum,
                
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
});

const mapDispatchToProps = { setStoreProductsSearchQuery };

export const StoreDocumentProductsTable = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(DocumentProductsTable),
);
