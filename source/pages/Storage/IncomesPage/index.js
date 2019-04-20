// vendor
import React, { memo } from 'react';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';
import { IncomesTable } from 'components';

export const IncomesPage = () => {
    return (
        <Layout
            title={ <FormattedMessage id='navigation.incomes' /> }
            controls={
                <Button type='primary'>
                    <FormattedMessage id='add' />
                </Button>
            }
        >
            <IncomesTable />
        </Layout>
    );
};
