// vendor
import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

// proj
import { selectIncomesFilters, setIncomesFilters } from 'core/storage/incomes';

import { Layout } from 'commons';
import { StorageFilters, IncomesTable } from 'components';
import { withErrorMessage } from 'utils';
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
)(withErrorMessage()(props => {
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
            <Filters>
                <StorageFilters
                    type={ 'incomes' }
                    filters={ props.filters }
                    setFilters={ props.setIncomesFilters }
                />
            </Filters>
            <Content>
                <IncomesTable filters={ props.filters } />
            </Content>
        </Layout>
    );
});

const Filters = styled.section`
    display: flex;
    justify-content: space-between;
    overflow: initial;
    box-sizing: border-box;
    background-color: rgb(255, 255, 255);
    padding: 16px;
    margin-bottom: 24px;
    z-index: 210;
    border-top: 1px dashed var(--primary);
    border-bottom: 1px dashed var(--primary);
    position: fixed;
    top: 128px;
    left: ${props => props.collapsed ? '80px' : '256px'};
    width: ${props =>
        props.collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)'};
`;

const Content = styled.section`
    padding: 150px 0 0 0;
    margin: 0 16px;
`;
