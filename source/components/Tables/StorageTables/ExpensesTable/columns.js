// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';

// proj
import { ActionIcons, DatetimeFormatter } from 'commons/_uikit';
import book from 'routes/book';
import { goTo } from 'utils';

export default props => {
    const id = {
        title:     '№',
        dataIndex: 'id',
        width:     '20%',
        render:    (key, { id, status }) => (
            <Link
                to={ {
                    pathname: `${book.storageExpenseDoc}/${id}`,
                    state:    { id, status },
                } }
            >
                { id }
            </Link>
        ),
    };

    const createdDatetime = {
        title: props.intl.formatMessage({
            id: 'storage.created_datetime',
        }),
        dataIndex: 'createdDatetime',
        width:     '20%',
        render:    datetime => <DatetimeFormatter datetime={ datetime } />,
    };

    const status = {
        title: props.intl.formatMessage({
            id: 'storage.status',
        }),
        dataIndex: 'status',
        width:     '20%',
        render:    status => (
            <Tag
                color={
                    status === 'NEW' ? 'var(--not_complete)' : 'var(--success'
                }
            >
                { props.intl.formatMessage({ id: `storage.status.${status}` }) }
            </Tag>
        ),
    };

    const client = {
        title: props.intl.formatMessage({
            id: 'storage.client',
        }),
        dataIndex: 'businessSupplierId',
        width:     '20%',
        render:    (client, { businessSupplier }) => (
            <div>{ businessSupplier.name }</div>
        ),
    };

    const sum = {
        title: props.intl.formatMessage({
            id: 'storage.sum',
        }),
        dataIndex: 'sum',
        width:     '20%',
    };

    const actions = {
        width:     'auto',
        dataIndex: 'delete',
        render:    (key, { id }) => {
            return (
                <ActionIcons
                    edit={ () => goTo(`${book.storageExpenseDoc}/${id}`, { id }) }
                    delete={ () => props.deleteExpenseDoc(id) }
                />
            );
        },
    };

    return [
        id,
        createdDatetime,
        status,
        client,
        sum,
        actions,
    ];
};
