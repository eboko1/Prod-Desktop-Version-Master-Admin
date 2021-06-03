// vendor
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { DatePicker, Skeleton, Checkbox, Select } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import _ from 'lodash';

// proj
import {
    selectStoreBalanceTotal,
    selectStoreBalanceFilters,
    setStoreBalanceFilters,
} from 'core/storage/storeBalance';

import { WarehouseSelect, BrandSelect } from 'components';
import { StoreProductsSelect } from 'forms/_formkit';
import { numeralFormatter } from 'utils';
import { DetailStorageModal } from "modals";

const mapStateToProps = state => ({
    collapsed: state.ui.collapsed,
    total:     selectStoreBalanceTotal(state),
    filters:   selectStoreBalanceFilters(state),
    user:      state.auth,
});

export const StorageBalanceTotals = connect(mapStateToProps, {
    setStoreBalanceFilters,
})(props => {
    // const total = _.get(props, 'balance.total[0]');
    const { filters, total, collapsed } = props;
    const onPickDate = date => props.setStoreBalanceFilters({ date });

    const SkeletonLoader = (
        <Skeleton active title={ false } paragraph={ { rows: 1, width: 100 } } />
    );

    const renderTotalData = (label, data) => (
        <div>
            <FormattedMessage id={ `storage.${label}` } />
            :&nbsp;<Highlighted>{ numeralFormatter(data) }</Highlighted>
        </div>
    );

    return (
        <BalanceTotal collapsed={ collapsed }>
            <FiltersRow>
                <DatePicker
                    allowClear={ false }
                    onChange={ onPickDate }
                    defaultValue={ moment(filters.date) }
                />
                <WarehouseSelect
                    style={{margin: '0 0 0 24px'}}
                    onChange={ (warehouseId) => props.setStoreBalanceFilters({warehouseId: warehouseId}) }
                />
                <BrandSelect
                    style={{margin: '0 0 0 24px'}}
                    onSelect={ (brandId) => props.setStoreBalanceFilters({brandId: brandId}) }
                />
                <FilterSpace>
                    <StoreProductsSelect
                        setFilters={ props.setStoreBalanceFilters }
                        filters={ props.filters }
                    />
                </FilterSpace>
                <div style={{margin: '0 0 0 24px'}}>
                    <DetailStorageModal
                        stockMode={true}
                        user={props.user}
                        selectProduct={(productId)=>{
                            props.setStoreBalanceFilters({
                                productId: productId,
                                page: 1
                            })
                        }}
                    />
                </div>
            </FiltersRow>
            <DataRow
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                }}
            >
                <DataWrapper>
                    { !_.isEmpty(total)
                        ? renderTotalData('in_stock', total.remaining)
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { !_.isEmpty(total)
                        ? renderTotalData('reserve', total.reserved)
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { !_.isEmpty(total)
                        ? renderTotalData(
                            'available',
                            total.remaining - total.reserved,
                        )
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { !_.isEmpty(total)
                        ? renderTotalData('ordered', total.countInStoreOrders)
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                    }}
                >
                    <div
                        style={{
                            fontSize: 12
                        }}
                    >
                        <FormattedMessage id='in_stock' />
                        <Checkbox
                            defaultChecked
                            style={{marginLeft: 5}}
                            onChange={(event)=>{
                                props.setStoreBalanceFilters({inStock: event.target.checked, page: 1})
                            }}
                        />
                    </div>
                    { !_.isEmpty(total)
                        ? renderTotalData('sum', Math.round(total.sum*10)/10)
                        : SkeletonLoader }
                </DataWrapper>
            </DataRow>
        </BalanceTotal>
    );
});

const BalanceTotal = styled.div`
    display: flex;
    flex-direction: column;
    overflow: initial;
    box-sizing: border-box;
    background-color: rgb(255, 255, 255);
    padding: 16px;
    margin-bottom: 24px;
    z-index: 210;
    border-top: 1px dashed var(--primary);
    border-bottom: 1px dashed var(--primary);
    position: fixed;
    top: 128px;
    left: ${props => props.collapsed ? '80px' : '256px'};
    width: ${props =>
        props.collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)'};
`;

const FiltersRow = styled.div`
    display: flex;
    margin-bottom: 16px;
`;

const DataRow = styled.div`
    display: flex;
    justify-content: space-between;
`;

const DataWrapper = styled.div`
    display: flex;
    font-size: 20px;
`;

const Highlighted = styled.span`
    color: var(--secondary);
    font-weight: 700;
    font-size: 24px;
`;

const FilterSpace = styled.div`
    margin-left: 24px;
`;
