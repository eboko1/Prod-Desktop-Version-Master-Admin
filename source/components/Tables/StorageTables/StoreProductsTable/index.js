// vendor
import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import _ from 'lodash';

// proj
import {
    fetchProducts,
    deleteProduct,
    selectStoreProducts,
    selectProductsLoading,
    selectStoreProductsFilters,
    setStoreProductsPage,
} from 'core/storage/products';
import { setModal } from 'core/modals/duck';
import { usePrevious } from 'utils';

// own
import columnsConfig from './config';

const ProductsTable = memo(props => {
    const { products } = props;

    const prevValues = usePrevious(products);

    useEffect(() => {
        if (!_.isEqual(products, prevValues)) {
            props.fetchProducts();
        }
    }, [ products ]);


    const pagination = {
        pageSize:         25,
        size:             'large',
        total:            Math.ceil(_.get(products, 'stats.count', 0) / 25) * 25,
        hideOnSinglePage: true,
        current:          props.filters.page,
        onChange:         page => {
            props.setStoreProductsPage(page);
            props.fetchProducts();
        },
    };

    return (
        <Table
            size='small'
            columns={ columnsConfig(props) }
            dataSource={ props.products.list }
            pagination={ pagination }
            locale={ {
                emptyText: props.intl.formatMessage({ id: 'no_data' }),
            } }
            loading={ props.loading }
            rowKey={ record => record.code }
        />
    );
});

const mapStateToProps = state => ({
    products: selectStoreProducts(state),
    filters:  selectStoreProductsFilters(state),
    loading:  selectProductsLoading(state),
});

const mapDispatchToProps = {
    fetchProducts,
    setModal,
    deleteProduct,
    setStoreProductsPage,
};

export const StoreProductsTable = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(ProductsTable),
);
