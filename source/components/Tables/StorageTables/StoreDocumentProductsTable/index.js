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
    // const docProducts = _.get(props, 'incomeDoc.docProducts', []);
    const [ docProducts, setDocProducts ] = useState([]);

    // const defaultKeys = [ ..._.keys(docProducts), uuid++ ];

    // const [ keys, setKeys ] = useState([ ..._.keys(defaultKeys) ]);

    // const [ uuid, setUuid ] = useState(docProducts.length);
    const [ keys, setKeys ] = useState([ ..._.keys(docProducts), docProducts.length + 1 ]);

    useEffect(() => {
        const incomeDocProducts = _.get(props, 'incomeDoc.docProducts', []);
        // setDocProducts(_.get(props, 'incomeDoc.docProducts', []));
        setDocProducts(incomeDocProducts);
        console.log('→ EFFECT incomeDocProducts', incomeDocProducts);

        setKeys([ ..._.keys(incomeDocProducts), incomeDocProducts.length + 1 ]);
    }, [ docProducts ]);

    // const uuid = docProducts.length;
    console.log('→ docProducts', docProducts);
    console.log('→TABLE DS keys', keys);
    // console.log('→ TABLE UUDI', uuid);
    // const _isFieldDisabled = key => {
    //     return !_.get(props.details, [ key, 'detailName' ]);
    // };

    // const _getDefaultValue = (key, fieldName) => {
    //     const orderDetail = (props.orderDetails || [])[ key ];
    //     if (!orderDetail) {
    //         return;
    //     }

    //     const actions = {
    //         detailName:
    //             (orderDetail.detailId || orderDetail.detailName) &&
    //             String(orderDetail.detailId || orderDetail.detailName),
    //         detailCount:     orderDetail.count,
    //         detailCode:      orderDetail.detailCode,
    //         detailPrice:     orderDetail.price,
    //         purchasePrice:   orderDetail.purchasePrice,
    //         detailBrandName:
    //             (orderDetail.brandId || orderDetail.brandName) &&
    //             String(orderDetail.brandId || orderDetail.brandName),
    //     };

    //     return actions[ fieldName ];
    // };

    const _handleDelete = redundantKey => {
        console.log('(1) redundantKey', redundantKey);
        console.log('(2) keys', keys);
        console.log(
            '(3) setKeys filter',
            keys.filter(key => redundantKey !== key),
        );
        console.log(
            '(5) props.form.setFieldsValue ',
            props.form.setFieldsValue,
        );
        setKeys(keys.filter(key => redundantKey !== key));
        props.form.setFieldsValue({
            [ redundantKey ]: void 0,
        });
        console.log('(2)(2) keys', keys);
    };

    // const _handleAdd = () => setKeys([ ...keys, uuid++ ]);
    const _handleAdd = () => {
        // setUuid(uuid + 1);
        console.log('→ _handleAddkeys', [ ...keys ]);
        setKeys([ ...keys, _.last(keys) + 1 ]);
    };

    const _handleProductSelect = (key, value) => {
        // console.log('→ _handleProductSelect props.docProducts', docProducts);
        console.log('0 value', value);
        console.log('1 key', key);
        console.log('2 _.last(keys)', _.last(keys));
        console.log('3 _.last(keys) === key', _.last(keys) === key);
        console.log('4 docProducts', docProducts);
        console.log(
            '5 !_.get(docProducts, [ key, code ])',
            !_.get(docProducts, [ key, 'code' ]),
        );
        // _handleAdd();
        if (_.last(keys) === key && !_.get(docProducts, [ key, 'code' ])) {
            _handleAdd();
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
                        setStoreProductsSearchQuery: setStoreProductsSearchQuery,
                        // getDefaultValue:     _getDefaultValue,
                    },
                    // _handleAdd,
                    // _handleDelete,
                    // _handleProductSelect,
                    // _getDefaultValue,
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
