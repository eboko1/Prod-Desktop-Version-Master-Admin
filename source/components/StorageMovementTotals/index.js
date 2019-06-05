// vendor
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Skeleton } from 'antd';
import styled from 'styled-components';

// proj
import {
    selectStoreMovementTotal,
    setStoreMovementFilters,
} from 'core/storage/storeMovement';

import { StoreProductsSelect } from 'forms/_formkit';

const mapStateToProps = state => ({
    collapsed: state.ui.collapsed,
    total:     selectStoreMovementTotal(state),
});

export const StorageMovementTotals = connect(
    mapStateToProps,
    { setStoreMovementFilters },
)(props => {
    const { total, collapsed } = props;

    const SkeletonLoader = (
        <Skeleton active title={ false } paragraph={ { rows: 1, width: 100 } } />
    );

    const renderTotalData = (label, data, income) => (
        <span>
            <FormattedMessage id={ `storage.${label}` } />
            :&nbsp;<Highlighted income={ income }>{ data }</Highlighted>
        </span>
    );

    return (
        <MovementTotal collapsed={ collapsed }>
            <StoreProductsSelect
                setFilters={ props.setStoreMovementFilters }
                filters={ props.filters }
            />

            <DataGrid>
                <DataWrapper>
                    { total
                        ? renderTotalData(
                            'income_price',
                            total.incomePrice,
                            true,
                        )
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { total
                        ? renderTotalData(
                            'quantity',
                            total.incomeQuantity,
                            true,
                        )
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { total
                        ? renderTotalData('income_sum', total.incomeSum, true)
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { total
                        ? renderTotalData('expense_price', total.expensePrice)
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { total
                        ? renderTotalData('quantity', total.expenseQuantity)
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { total
                        ? renderTotalData('expense_sum', total.expenseSum)
                        : SkeletonLoader }
                </DataWrapper>
            </DataGrid>
        </MovementTotal>
    );
});

const MovementTotal = styled.div`
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

const DataGrid = styled.div`
    margin-top: 12px;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: repeat(3, 1fr);
    grid-auto-flow: column;
`;

const DataWrapper = styled.div`
    display: flex;
    font-size: 20px;
    margin-right: 24px;
`;

const Highlighted = styled.span`
    color: ${props => props.income ? 'var(--secondary)' : 'var(--warning)'};
    font-weight: 700;
    font-size: 24px;
`;
