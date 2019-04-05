// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

export const IncomesPage = () => {
    return (
        <Layout title={ <FormattedMessage id='navigation.incomes' /> }>
            <div>IncomesPage</div>
        </Layout>
    );
};
