// vendor
import React from 'react';
import { Button, Tag, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'lodash';

// proj
import { Layout, Close } from 'commons';
import { ExpenseDocForm } from 'forms';
import book from 'routes/book';
import { linkBack } from 'utils';

const Title = styled.div`
    display: flex;
    align-items: center;
`;

const ExpenseDoc = props => {
    console.log('→ props', props);
    const id = _.get(props, 'location.state.id');
    const status = _.get(props, 'location.state.status');

    const title = (
        <Title>
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
            <FormattedMessage id='storage.expense_document' />: { id }
        </Title>
    );

    return (
        <Layout title={ title } controls={ <Close onClick={ () => linkBack() } /> }>
            <ExpenseDocForm />
        </Layout>
    );
};

export const ExpenseDocPage = withRouter(ExpenseDoc);
