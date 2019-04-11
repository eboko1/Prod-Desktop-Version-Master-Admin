// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout, Paper, Catcher } from 'commons';
import { PriceGroupForm } from 'forms';
import { PriceGroupsTable } from 'components';

export const PriceGroupsPage = () => {
    return (
        <Layout
            title={ <FormattedMessage id='navigation.price_groups' /> }
            paper={ false }
            controls={ <PriceGroupForm /> }
        >
            <Catcher>
                <Paper>
                    <PriceGroupsTable />
                </Paper>
            </Catcher>
        </Layout>
    );
};
