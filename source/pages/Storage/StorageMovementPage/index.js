// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

export const StorageMovementPage = () => {
    return (
        <Layout title={ <FormattedMessage id='navigation.storage_movement' /> }>
            <div>StorageMovementPage</div>
        </Layout>
    );
};
