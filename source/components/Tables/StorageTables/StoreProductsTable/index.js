// vendor
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';

// proj
import { selectStoreProducts } from 'core/storage/products';

// own
import columnsConfig from './config';

const ProductsTable = props => {
    return (
        <Table
            size='small'
            columns={ columnsConfig(props) }
            dataSource={ props.storeProducts }
            pagination={ false }
            locale={ {
                emptyText: props.intl.formatMessage({ id: 'no_data' }),
            } }
        />
    );
};

const mapStateToProps = state => ({
    storeProducts: selectStoreProducts(state),
});

export const StoreProductsTable = injectIntl(
    connect(mapStateToProps)(ProductsTable),
);
