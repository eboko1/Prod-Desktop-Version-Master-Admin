// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';

// proj
import { setBrandsSearchQuery, selectBrandsByQuery } from 'core/search/duck';
import { fetchStoreGroups, selectStoreGroups } from 'core/storage/storeGroups';
import { fetchPriceGroups, selectPriceGroups } from 'core/storage/priceGroups';
import { selectStoreProductsExcelLoading } from 'core/storage/products';

// own
import { columnsConfig } from './config';

const ProductsExcelTableComponent = props => {
    useEffect(() => {
        props.fetchPriceGroups();
    }, []);

    useEffect(() => {
        props.fetchStoreGroups();
    }, []);

    const columns = columnsConfig(
        props.dataSource,
        props.getFieldDecorator,
        props.intl.formatMessage,
        props.storeGroups,
        props.priceGroups,
        props.brands,
        props.setBrandsSearchQuery,
        props.getFieldValue,
    );

    console.log('→ brands', props.brands);

    return (
        <Table
            size='small'
            columns={ columns }
            dataSource={ props.dataSource }
            pagination={ false }
            locale={ {
                emptyText: props.intl.formatMessage({ id: 'no_data' }),
            } }
            rowKey={ (record, index) =>
                `${index}-${record.code}-${record.productName}`
            }
            loading={ props.loading }
        />
    );
};

const mapStateToProps = state => ({
    brands:      selectBrandsByQuery(state),
    priceGroups: selectPriceGroups(state),
    storeGroups: selectStoreGroups(state),
    loading:     selectStoreProductsExcelLoading(state),
});

const mapDispatchToProps = {
    setBrandsSearchQuery,
    fetchStoreGroups,
    fetchPriceGroups,
};

export const ProductsExcelTable = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(ProductsExcelTableComponent),
);
