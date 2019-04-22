// vendor
import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout } from 'commons';
import { IncomesTable } from 'components';
import book from 'routes/book';

export const IncomesPage = () => {
    return (
        <Layout
            title={ <FormattedMessage id='navigation.incomes' /> }
            controls={
                <Link to={ book.storageIncomeDoc }>
                    <Button type='primary'>
                        <FormattedMessage id='add' />
                    </Button>
                </Link>
            }
        >
            <IncomesTable />
        </Layout>
    );
};
