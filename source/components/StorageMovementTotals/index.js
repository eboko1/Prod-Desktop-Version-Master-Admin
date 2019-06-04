// vendor
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Skeleton } from 'antd';
import styled from 'styled-components';

// proj
import { selectStoreMovementTotal } from 'core/storage/storeMovement';

import { StoreProductsSelect } from 'forms/_formkit';

const mapStateToProps = state => ({
    collapsed: state.ui.collapsed,
    total:     selectStoreMovementTotal(state),
});

export const StorageMovementTotals = connect(mapStateToProps)(props => {
    const { total, collapsed } = props;

    const SkeletonLoader = (
        <Skeleton active title={ false } paragraph={ { rows: 1, width: 100 } } />
    );

    const renderTotalData = (label, data) => (
        <span>
            <FormattedMessage id={ `storage.${label}` } />
            :&nbsp;<Highlighted>{ data }</Highlighted>
        </span>
    );

    return (
        <MovementTotal collapsed={ collapsed }>
            <DataColumn>
                <StoreProductsSelect filters={ props.filters } />
            </DataColumn>
            <DataColumn>
                <DataWrapper>
                    { total
                        ? renderTotalData('income_price', total.incomePrice)
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { total
                        ? renderTotalData(
                            'income_quantity',
                            total.incomeQuantity,
                        )
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { total
                        ? renderTotalData('income_sum', total.incomeSum)
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { total
                        ? renderTotalData('expense_price', total.expensePrice)
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { total
                        ? renderTotalData(
                            'expense_quantity',
                            total.expenseQuantity,
                        )
                        : SkeletonLoader }
                </DataWrapper>
                <DataWrapper>
                    { total
                        ? renderTotalData('expense_sum', total.expenseSum)
                        : SkeletonLoader }
                </DataWrapper>
            </DataColumn>
        </MovementTotal>
    );
});

const MovementTotal = styled.div`
    display: flex;
    justify-content: space-between;
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

const DataColumn = styled.div`
    flex: 0 1 40%;
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
