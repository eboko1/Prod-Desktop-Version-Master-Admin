// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';

export const ExpensesPage = () => {
    return (
        <Layout title={ <FormattedMessage id='navigation.expenses' /> }>
            <div>ExpensesPage</div>
        </Layout>
    );
};
