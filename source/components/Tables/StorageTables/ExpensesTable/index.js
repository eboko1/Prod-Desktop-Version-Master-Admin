// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import {
    fetchExpenses,
    deleteExpenseDoc,
    selectExpenses,
    selectExpensesLoading,
    selectExpensesFilters,
    setExpensesPage,
} from 'core/storage/expenses';

import { Catcher } from 'commons';

// own
import columnsConfig from './columns';

const ExpensesTableComponent = props => {
    const { expenses } = props;

    useEffect(() => {
        props.fetchExpenses();
    }, []); // add expenses -> recursion

    console.log('→ expenses', expenses);
    console.log('→ filters', props.filters);

    const pagination = {
        pageSize:         25,
        size:             'large',
        total:            Math.ceil(_.get(expenses, 'stats.count', 0) / 25) * 25,
        hideOnSinglePage: true,
        current:          props.filters.page,
        onChange:         page => {
            props.setExpensesPage(page);
            props.fetchExpenses();
        },
    };

    return (
        <Catcher>
            <StyledTable
                size='small'
                columns={ columnsConfig(props) }
                dataSource={ props.expenses.list }
                pagination={ pagination }
                locale={ {
                    emptyText: props.intl.formatMessage({ id: 'no_data' }),
                } }
                loading={ props.loading }
                rowKey={ record => record.id }
            />
        </Catcher>
    );
};

const StyledTable = styled(Table)`
    background: white;
`;

const mapStateToProps = state => ({
    expenses: selectExpenses(state),
    filters:  selectExpensesFilters(state),
    loading:  selectExpensesLoading(state),
});

const mapDispatchToProps = {
    fetchExpenses,
    deleteExpenseDoc,
    setExpensesPage,
};

export const ExpensesTable = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(ExpensesTableComponent),
);
