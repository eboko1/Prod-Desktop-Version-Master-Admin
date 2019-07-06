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

    const orderDatetime = {
        title: props.intl.formatMessage({
            id: 'storage.date',
        }),
        dataIndex: 'orderDatetime',
        width:     '20%',
        render:    orderDatetime => <DatetimeFormatter datetime={ orderDatetime } />,
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
                    status === 'NEW' ? 'var(--not_complete)' : 'var(--green)'
                }
            >
                { props.intl.formatMessage({
                    id: `storage.status.${status === 'DONE' ? 'OFF' : status}`,
                }) }
            </Tag>
        ),
    };

    const order = {
        title: props.intl.formatMessage({
            id: 'storage.order',
        }),
        dataIndex: 'orderId',
        width:     '20%',
        render:    (order, { orderId, orderNum }) => (
            <Link
                to={ `${book.order}/${orderId}` }
                style={ { color: 'var(--link)' } }
            >
                { orderNum }
            </Link>
        ),
    };

    const client = {
        title: props.intl.formatMessage({
            id: 'storage.client',
        }),
        dataIndex: 'clientName',
        width:     '20%',
        render:    (client, { clientId, clientName, clientSurname }) => (
            <Link to={ `${book.client}/${clientId}` }>
                { clientName } { clientSurname }
            </Link>
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
        orderDatetime,
        status,
        order,
        client,
        sum,
        actions,
    ];
};
