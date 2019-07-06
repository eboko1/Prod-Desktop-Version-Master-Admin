// vendor
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { DatePicker, Skeleton } from 'antd';
import moment from 'moment';
import styled from 'styled-components';

import {
    selectStoreBalanceTotal,
    selectStoreBalanceFilters,
    setStoreBalanceFilters,
} from 'core/storage/storeBalance';

import { numeralFormatter } from 'utils';

const mapStateToProps = state => ({
    collapsed: state.ui.collapsed,
    total:     selectStoreBalanceTotal(state),
    filters:   selectStoreBalanceFilters(state),
});

export const StorageBalanceTotals = connect(
    mapStateToProps,
    { setStoreBalanceFilters },
)(props => {
    // const total = _.get(props, 'balance.total[0]');
    const { filters, total, collapsed } = props;
    const onPickDate = date => props.setStoreBalanceFilters({ date });

    const SkeletonLoader = (
        <Skeleton active title={ false } paragraph={ { rows: 1, width: 100 } } />
    );

    const renderTotalData = (label, data) => (
        <span>
            <FormattedMessage id={ `storage.${label}` } />
            :&nbsp;<Highlighted>{ numeralFormatter(data) }</Highlighted>
        </span>
    );

    return (
        <BalanceTotal collapsed={ collapsed }>
            <DatePicker
                onChange={ onPickDate }
                defaultValue={ moment(filters.date) }
            />
            <DataWrapper>
                { total
                    ? renderTotalData('in_stock', total.remaining)
                    : SkeletonLoader }
            </DataWrapper>
            <DataWrapper>
                { total
                    ? renderTotalData('reserve', total.reserved)
                    : SkeletonLoader }
            </DataWrapper>
            <DataWrapper>
                { total
                    ? renderTotalData(
                        'available',
                        total.remaining - total.reserved,
                    )
                    : SkeletonLoader }
            </DataWrapper>
            <DataWrapper>
                { total ? renderTotalData('sum', total.sum) : SkeletonLoader }
            </DataWrapper>
        </BalanceTotal>
    );
});

const BalanceTotal = styled.div`
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

const DataWrapper = styled.div`
    display: flex;
    font-size: 20px;
`;

const Highlighted = styled.span`
    color: var(--secondary);
    font-weight: 700;
    font-size: 24px;
`;
