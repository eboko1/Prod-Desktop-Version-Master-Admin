// vendor
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import moment from 'moment';

// proj
import {
    selectStoreMovementFilters,
    setStoreMovementFilters,
    selectStoreMovementLoading,
} from 'core/storage/storeMovement';

import { Layout } from 'commons';
import {
    StoreMovementTable,
    StorageMovementTotals,
    DatePickerGroup,
    StorageDateFilter,
    WarehouseSelect,
} from 'components';

const mapStateToProps = state => ({
    filters: selectStoreMovementFilters(state),
    loading: selectStoreMovementLoading(state),
});

export const StorageMovementPage = connect(
    mapStateToProps,
    { setStoreMovementFilters },
)(props => {
    const { loading, filters } = props;

    const [ period, setPeriod ] = useState('month');

    const setDaterange = daterange => {
        const [ startDate, endDate ] = daterange;
        props.setStoreMovementFilters({ startDate, endDate });
    };

    const handlePeriod = period => {
        setPeriod(period);
        period === 'month'
            ? setDaterange([ moment(filters.endDate).subtract(30, 'days'), moment(filters.endDate) ])
            : setDaterange([ moment(filters.endDate).subtract(1, period), moment(filters.endDate) ]);
    };

    return (
        <Layout
            paper={ false }
            title={ <FormattedMessage id='navigation.storage_movement' /> }
            controls={
                <div style={{display: 'flex'}}>
                    <WarehouseSelect 
                        style={{margin: '0 0 0 8px'}}
                        onChange={ (warehouseId) => props.setStoreMovementFilters({warehouseId: warehouseId})}
                    />
                    <StorageDateFilter
                        dateRange={[moment(filters.startDate), moment(filters.endDate)]}
                        onDateChange={ setDaterange }
                        minimize
                    />
                </div>
            }
        >
            <StorageMovementTotals filters={ filters } />
            <StoreMovementTableWrapper>
                <StoreMovementTable />
            </StoreMovementTableWrapper>
        </Layout>
    );
});

const StoreMovementTableWrapper = styled.section`
    padding: 164px 0 0 0;
    margin: 0 16px;
`;
