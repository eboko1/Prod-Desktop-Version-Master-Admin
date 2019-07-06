// vendor
import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// proj
import { selectIncomesFilters, setIncomesFilters } from 'core/storage/incomes';

import { Layout } from 'commons';
import { StorageFilters, IncomesTable } from 'components';
import book from 'routes/book';

const mapStateToProps = state => ({
    filters: selectIncomesFilters(state),
});

const mapDispatchToProps = {
    setIncomesFilters,
};

export const IncomesPage = connect(
    mapStateToProps,
    mapDispatchToProps,
)(props => {
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
            paper={ false }
        >
            <StorageFilters
                filters={ props.filters }
                setFilters={ props.setIncomesFilters }
            />
            <IncomesTable filters={ props.filters } />
        </Layout>
    );
});
