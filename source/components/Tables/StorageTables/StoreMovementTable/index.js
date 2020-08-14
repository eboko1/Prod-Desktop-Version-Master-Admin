// vendor
import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import {
    fetchStoreMovement,
    selectStoreMovement,
    selectStoreMovementLoading,
    selectStoreMovementFilters,
    setStoreMovementPage,
} from 'core/storage/storeMovement';
import { redirectToTracking } from 'core/storage/tracking';

import { usePrevious } from 'utils';

// own
import columns from './columns';

const StoreMovementTableComponent = memo(props => {
    const { movement } = props;
    const prevMovement = usePrevious(movement);

    useEffect(() => {
        if (!_.isEqual(movement, prevMovement)) {
            props.fetchStoreMovement();
        }
    }, [ movement ]);

    const pagination = {
        pageSize:         32,
        size:             'large',
        total:            Math.ceil(_.get(movement, 'stats.count', 0) / 32) * 32,
        hideOnSinglePage: true,
        current:          props.filters.page,
        position:         'both',
        onChange:         page => {
            props.setStoreMovementPage(page);
            props.fetchStoreMovement();
        },
    };

    return (
        <StyledTable
            size='small'
            columns={ columns(props) }
            dataSource={ props.movement.list }
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

    & th.income,
    & td.income {
        background: rgba(var(--secondaryRGB), 0.2) !important;
    }
    & th.expense,
    & td.expense {
        background: rgba(var(--warningRGB), 0.2) !important;
    }
`;

const mapStateToProps = state => ({
    movement: selectStoreMovement(state),
    filters:  selectStoreMovementFilters(state),
    loading:  selectStoreMovementLoading(state),
});

const mapDispatchToProps = {
    fetchStoreMovement,
    setStoreMovementPage,
    redirectToTracking,
};

export const StoreMovementTable = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(StoreMovementTableComponent),
);
