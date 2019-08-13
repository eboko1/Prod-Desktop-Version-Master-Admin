// vendor
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

// proj
import {
    selectExpensesFilters,
    setExpensesFilters,
} from 'core/storage/expenses';

import { Layout } from 'commons';
import { StorageFilters, ExpensesTable } from 'components';

const mapStateToProps = state => ({
    filters: selectExpensesFilters(state),
});

const mapDispatchToProps = {
    setExpensesFilters,
};

export const ExpensesPage = connect(
    mapStateToProps,
    mapDispatchToProps,
)(props => {
    return (
        <Layout
            paper={ false }
            title={ <FormattedMessage id='navigation.expenses' /> }
        >
            <Filters>
                <StorageFilters
                    type={ 'expenses' }
                    filters={ props.filters }
                    setFilters={ props.setExpensesFilters }
                />
            </Filters>
            <Content>
                <ExpensesTable filters={ props.filters } />
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
    padding: 116px 0 0 0;
    margin: 0 16px;
`;
