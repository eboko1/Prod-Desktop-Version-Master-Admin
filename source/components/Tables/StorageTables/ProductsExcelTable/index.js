// vendor
import React, { useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import styled from 'styled-components';
import _ from 'lodash';

// proj
import { setBrandsSearchQuery, selectBrandsByQuery } from 'core/search/duck';
import { fetchStoreGroups, selectStoreGroups } from 'core/storage/storeGroups';
import { fetchPriceGroups, selectPriceGroups } from 'core/storage/priceGroups';
import {
    selectImportInvalidProducts,
    selectImportTooManyInvalids,
    selectStoreProductsExcelLoading,
} from 'core/storage/products';

import { Loader } from 'commons';

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

    /* &
        .ant-table-small
        > .ant-table-content
        > .ant-table-scroll
        > .ant-table-body
        > table
        > .ant-table-tbody
        > tr {
        vertical-align: middle !important;
    } */

    /* .ant-select-auto-complete.ant-select {
        top: -1px;
    } */

    /* & tr {
        vertical-align: top;
    }
    &
        .ant-table-small
        > .ant-table-content
        > .ant-table-scroll
        > .ant-table-body
        > table
        > .ant-table-tbody
        > tr {
        vertical-align: top;
    } */

    & .ant-select-selection,
    .ant-input,
    .ant-input-number,
    .ant-input-number-input {
        border-radius: 0;
    }
`;

// memo(
//     forwardRef((props, ref) =>

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

    // useEffect(() => {
    //     return () => {
    //         props.fetchPriceGroups();
    //         props.fetchStoreGroups();
    //     };
    // }, []);
    useEffect(() => {
        props.fetchPriceGroups();
    }, []);

    useEffect(() => {
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

    console.log('→ !!!RENDER Table');

    return props.tooManyInvalids ? (
        <div>validate passed. press ok</div>
    ) : (
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
    invalidProductsExcel: selectImportInvalidProducts(state),
    tooManyInvalids:      selectImportTooManyInvalids(state),
    brands:               selectBrandsByQuery(state),
    priceGroups:          selectPriceGroups(state),
    storeGroups:          selectStoreGroups(state),
    loading:              selectStoreProductsExcelLoading(state),
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
