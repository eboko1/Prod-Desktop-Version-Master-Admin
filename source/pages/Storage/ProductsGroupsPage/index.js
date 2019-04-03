// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';
import { StoreProductsContainer } from 'containers';

export const ProductsGroupsPage = () => {
    return (
        <Layout title={ <FormattedMessage id='navigation.products_groups' /> }>
            <StoreProductsContainer />
        </Layout>
    );
};
