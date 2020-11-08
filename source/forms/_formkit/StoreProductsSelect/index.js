// vendor
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Select, Icon, Spin } from 'antd';

// proj
import {
    setStoreProductsSearchQuery,
    selectStoreProductsByQuery,
} from 'core/search/duck';

const { Option } = Select;

const mapStateToProps = state => ({
    storeProducts: selectStoreProductsByQuery(state),
});

const StoreProductsSelect = injectIntl(
    connect(mapStateToProps, { setStoreProductsSearchQuery })(props => {
        const handleSearch = value => props.setStoreProductsSearchQuery(value);

        const handleSelect = productId =>
            props.setFilters({ productId, page: 1 });

        props.setStoreProductsSearchQuery();
        
        return (
            <Select
                // labelInValue
                showSearch
                autoClearSearchValue
                allowClear
                value={ props.filters.productId }
                initialValue={ props.filters.productId }
                // notFoundContent={ fetching ? <Spin size='small' /> : null }
                clearIcon={
                    <Icon
                        type='close-circle'
                        onClick={ () => handleSelect(void 0) }
                    />
                }
                placeholder={ props.intl.formatMessage({
                    id: 'storage.select_product',
                }) }
                onSearch={ handleSearch }
                onSelect={ handleSelect }
                optionFilterProp='children'
                style={ { width: '320px' } }
            >
                { props.storeProducts.map(product => (
                    <Option value={ product.id } key={ product.id }>
                        { product.code }
                    </Option>
                )) }
            </Select>
        );
    }),
);

export default StoreProductsSelect;
