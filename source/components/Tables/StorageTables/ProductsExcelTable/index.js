// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';

// proj
import { setBrandsSearchQuery, selectBrandsByQuery } from 'core/search/duck';
import { fetchPriceGroups, selectPriceGroups } from 'core/storage/priceGroups';

// own
import { columnsConfig } from './config';

const ProductsExcelTableComponent = props => {
    useEffect(() => {
        props.fetchPriceGroups();
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
        />
    );
};

const mapStateToProps = state => ({
    brands:      selectBrandsByQuery(state),
    priceGroups: selectPriceGroups(state),
});

const mapDispatchToProps = {
    setBrandsSearchQuery,
    fetchPriceGroups,
};

export const ProductsExcelTable = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(ProductsExcelTableComponent),
);
