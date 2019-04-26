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

import { Layout, Close, StyledButton } from 'commons';
import { IncomeDocForm } from 'forms';
import book from 'routes/book';
import { linkBack } from 'utils';

const ModuleHeaderContent = styled.div`
    display: flex;
    align-items: center;
`;

const IncomeDoc = props => {
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
                            : 'var(--success'
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
            <Close onClick={ () => linkBack() } />
        </ModuleHeaderContent>
    );

    console.log('→ PAGE props.incomeDoc', props.incomeDoc);

    return (
        <Layout title={ title } controls={ controls }>
            <IncomeDocForm incomeDoc={ props.incomeDoc } />
        </Layout>
    );
};

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
