// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

// proj
import { Layout } from 'commons';
import { StoreBalanceTable, StorageBalanceTotals } from 'components';

export const StorageBalancePage = () => {
    return (
        <Layout
            paper={ false }
            title={ <FormattedMessage id='navigation.storage_balance' /> }
        >
            <StorageBalanceTotals />
            <StoreBalanceTableWrapper>
                <StoreBalanceTable />
            </StoreBalanceTableWrapper>
        </Layout>
    );
};

const StoreBalanceTableWrapper = styled.section`
    padding: 100px 0 0 0;
    margin: 0 16px;
`;
