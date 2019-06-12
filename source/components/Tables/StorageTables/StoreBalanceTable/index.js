// vendor
import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import {
    fetchStoreBalance,
    selectStoreBalance,
    selectStoreBalanceLoading,
    selectStoreBalanceFilters,
    setStoreBalancePage,
} from 'core/storage/storeBalance';
import { redirectToTracking } from 'core/storage/tracking';

import { usePrevious } from 'utils';

// own
import columns from './columns';

const StoreBalanceTableComponent = memo(props => {
    const { balance } = props;
    const prevBalance = usePrevious(balance);

    useEffect(() => {
        if (!_.isEqual(balance, prevBalance)) {
            props.fetchStoreBalance();
        }
    }, [ balance ]);

    const pagination = {
        pageSize:         32,
        size:             'large',
        total:            Math.ceil(_.get(balance, 'stats.count', 0) / 32) * 32,
        hideOnSinglePage: true,
        current:          props.filters.page,
        position:         'both',
        onChange:         page => {
            props.setStoreBalancePage(page);
            props.fetchStoreBalance();
        },
    };

    return (
        <StyledTable
            size='small'
            columns={ columns(props) }
            dataSource={ props.balance.list }
            pagination={ pagination }
            locale={ {
                emptyText: props.intl.formatMessage({ id: 'no_data' }),
            } }
            loading={ props.loading }
            rowKey={ record => record.id }
        />
    );
});

const StyledTable = styled(Table)`
    background-color: rgb(255, 255, 255);
    transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px,
        rgba(0, 0, 0, 0.23) 0px 3px 10px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    box-sizing: border-box;
    padding: 10px;
`;

const mapStateToProps = state => ({
    balance: selectStoreBalance(state),
    filters: selectStoreBalanceFilters(state),
    loading: selectStoreBalanceLoading(state),
});

const mapDispatchToProps = {
    fetchStoreBalance,
    setStoreBalancePage,
    redirectToTracking,
};

export const StoreBalanceTable = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(StoreBalanceTableComponent),
);
