// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Tag } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import _ from 'lodash';

// proj
import { fetchIncomeDoc, selectIncomeDoc } from 'core/storage/incomes';

import { Layout, Close, Loader } from 'commons';
import { IncomeDocForm } from 'forms';
import { goTo, withErrorMessage } from 'utils';
import book from 'routes/book';

const ModuleHeaderContent = styled.div`
    display: flex;
    align-items: center;
`;

const IncomeDoc = withErrorMessage()(props => {
    const id = props.match.params.id;
    const status = props.incomeDoc.status;
    // const status = _.get(props, 'location.state.status');

    useEffect(() => {
        if (id) {
            props.fetchIncomeDoc(id);
        }
    }, []);

    const title = (
        <ModuleHeaderContent>
            { status ? (
                <Tag
                    color={
                        status === 'NEW'
                            ? 'var(--not_complete)'
                            : 'var(--green)'
                    }
                >
                    <FormattedMessage id={ `storage.status.${status}` } />
                </Tag>
            ) : status && id ? (
                <FormattedMessage id='add' />
            ) : null }
            &nbsp;
            <FormattedMessage id='storage.income_document' />
            { id ? `: ${id}` : null }
        </ModuleHeaderContent>
    );

    const controls = (
        <ModuleHeaderContent>
            <Close onClick={ () => goTo(book.storageIncomes) } />
        </ModuleHeaderContent>
    );

    return (
        <Layout title={ title } controls={ controls }>
            { props.loading && _.isEmpty(props.incomeDoc) ? (
                <Loader loading={ props.loading && _.isEmpty(props.incomeDoc) } />
            ) : (
                <IncomeDocForm incomeDoc={ props.incomeDoc } />
            ) }
        </Layout>
    );
});

const mapStateToProps = state => ({
    incomeDoc: selectIncomeDoc(state),
});

const mapDispatchToProps = {
    fetchIncomeDoc,
};

export const IncomeDocPage = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(IncomeDoc),
);
