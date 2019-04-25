// vendor
import React from 'react';
import { Tag } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import _ from 'lodash';

// proj
import { Layout, Close, StyledButton } from 'commons';
import { IncomeDocForm } from 'forms';
import book from 'routes/book';
import { linkBack } from 'utils';

const ModuleHeaderContent = styled.div`
    display: flex;
    align-items: center;
`;

const IncomeDoc = props => {
    const id = _.get(props, 'location.state.id');
    const status = _.get(props, 'location.state.status');

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

    return (
        <Layout title={ title } controls={ controls }>
            <IncomeDocForm />
        </Layout>
    );
};

export const IncomeDocPage = withRouter(IncomeDoc);
