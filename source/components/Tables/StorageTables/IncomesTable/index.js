// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import {
    fetchIncomes,
    deleteIncomeDoc,
    selectIncomes,
    selectIncomesLoading,
    setIncomesPage,
} from 'core/storage/incomes';

import { Catcher } from 'commons';

// own
import columnsConfig from './columns';

const IncomesTableComponent = props => {
    const { incomes } = props;

    useEffect(() => {
        props.fetchIncomes();
    }, []); // add incomes -> recursion

    const pagination = {
        pageSize:         25,
        size:             'large',
        total:            Math.ceil(_.get(incomes, 'stats.count', 0) / 25) * 25,
        hideOnSinglePage: true,
        current:          props.filters.page,
        onChange:         page => {
            props.setIncomesPage(page);
            props.fetchIncomes();
        },
    };

    return (
        <Catcher>
            <StyledTable
                size='small'
                columns={ columnsConfig(props) }
                dataSource={ props.incomes.list }
                pagination={ pagination }
                locale={ {
                    emptyText: props.intl.formatMessage({ id: 'no_data' }),
                } }
                loading={ props.loading }
                rowKey={ record => record.id }
                scroll={ { x: 960 } }
            />
        </Catcher>
    );
};

const StyledTable = styled(Table)`
    background: white;
`;

const mapStateToProps = state => ({
    incomes: selectIncomes(state),
    loading: selectIncomesLoading(state),
});

const mapDispatchToProps = {
    fetchIncomes,
    deleteIncomeDoc,
    setIncomesPage,
};

export const IncomesTable = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(IncomesTableComponent),
);
