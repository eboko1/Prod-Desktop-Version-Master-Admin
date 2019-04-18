// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';

// proj
import {
    fetchProducts,
    selectStoreProducts,
    selectProductsLoading,
} from 'core/storage/products';

// own
import columnsConfig from './config';

const ProductsTable = props => {
    useEffect(() => {
        props.fetchProducts();
    }, []);

    return (
        <Table
            size='small'
            columns={ columnsConfig(props) }
            dataSource={ props.products.list }
            pagination={ false }
            locale={ {
                emptyText: props.intl.formatMessage({ id: 'no_data' }),
            } }
            loading={ props.loading }
            rowKey={ record => record.code }
        />
    );
};

const mapStateToProps = state => ({
    products: selectStoreProducts(state),
    loading:  selectProductsLoading(state),
});

export const StoreProductsTable = injectIntl(
    connect(
        mapStateToProps,
        { fetchProducts },
    )(ProductsTable),
);
