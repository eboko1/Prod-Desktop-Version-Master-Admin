// vendor
import React, { useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table } from 'antd';
import styled from 'styled-components';

// proj
import { setBrandsSearchQuery, selectBrandsByQuery } from 'core/search/duck';
import { fetchStoreGroups, selectStoreGroups } from 'core/storage/storeGroups';
import { fetchPriceGroups, selectPriceGroups } from 'core/storage/priceGroups';
import { selectStoreProductsExcelLoading } from 'core/storage/products';

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const StyledTable = styled(Table)`
    /* &
        .ant-table-small
        > .ant-table-content
        > .ant-table-body
        > table
        > .ant-table-tbody
        > tr
        > td {
        padding: 0;
    } */

    &
        .ant-table-small
        > .ant-table-content
        > .ant-table-scroll
        > .ant-table-body
        > table
        > .ant-table-tbody
        > tr
        > td {
        padding: 0;
    }

    & .ant-table-small > .ant-table-content > .ant-table-body {
        margin: 0;
    }

    & .ant-select-selection,
    .ant-input,
    .ant-input-number,
    .ant-input-number-input {
        border-radius: 0;
    }
`;

const ProductsExcelTableComponent = props => {
    const {
        invalidProductsExcel,
        form,
        storeGroups,
        priceGroups,
        brands,
        setBrandsSearchQuery,
        intl: { formatMessage },
    } = props;

    useEffect(() => {
        props.fetchPriceGroups();
        props.fetchStoreGroups();
    }, []);

    const columns = useMemo(
        () =>
            columnsConfig(
                invalidProductsExcel,
                form,
                formatMessage,
                storeGroups,
                priceGroups,
                brands,
                setBrandsSearchQuery,
            ),
        [
            invalidProductsExcel,
            storeGroups,
            priceGroups,
            brands,
        ],
    );
    console.log('→ TABLE props', props);

    return (
        <StyledTable
            // bordered
            className={ Styles.importTable }
            size='small'
            columns={ columns }
            dataSource={ props.invalidProductsExcel }
            pagination={ false }
            locale={ {
                emptyText: props.intl.formatMessage({ id: 'no_data' }),
            } }
            rowKey={ (record, index) =>
                `${index}-${record.code}-${record.productName}`
            }
            loading={ props.loading }
            scroll={ { x: 1600 } }
            rowClassName={ record => record.alreadyExists && Styles.duplicateRow }
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
