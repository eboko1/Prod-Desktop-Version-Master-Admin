// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';

// proj
import { Numeral } from 'commons';
import { ActionIcons, DatetimeFormatter } from 'commons/_uikit';
import book from 'routes/book';
import { goTo } from 'utils';

export default props => {
    const id = {
        title:     '№',
        dataIndex: 'id',
        width:     'auto',
        render:    (key, { id, status }) => (
            <Link
                to={ {
                    pathname: `${book.storageIncomeDoc}/${id}`,
                    state:    { id, status },
                } }
            >
                { id }
            </Link>
        ),
    };
    const supplierDocNumber = {
        title: props.intl.formatMessage({
            id: 'storage.document_number',
        }),
        dataIndex: 'supplierDocNumber',
        width:     '20%',
    };

    const createdDatetime = {
        title: props.intl.formatMessage({
            id: 'storage.created_datetime',
        }),
        dataIndex: 'createdDatetime',
        width:     '12%',
        render:    datetime => <DatetimeFormatter datetime={ datetime } />,
    };

    const doneDatetime = {
        title: props.intl.formatMessage({
            id: 'storage.done_date',
        }),
        dataIndex: 'doneDatetime',
        width:     '12%',
        render:    datetime =>
            datetime ? <DatetimeFormatter datetime={ datetime } /> : null,
    };

    const paidDatetime = {
        title: props.intl.formatMessage({
            id: 'storage.payment_date',
        }),
        dataIndex: 'paidDatetime',
        width:     '12%',
        render:    datetime =>
            datetime ? <DatetimeFormatter datetime={ datetime } /> : null,
    };

    const status = {
        title: props.intl.formatMessage({
            id: 'storage.status',
        }),
        dataIndex: 'status',
        width:     '4%',
        render:    status => (
            <Tag
                color={
                    status === 'NEW' ? 'var(--not_complete)' : 'var(--green)'
                }
            >
                { props.intl.formatMessage({ id: `storage.status.${status}` }) }
            </Tag>
        ),
    };

    const supplier = {
        title: props.intl.formatMessage({
            id: 'storage.supplier',
        }),
        dataIndex: 'businessSupplierId',
        width:     '15%',
        render:    (supplier, { businessSupplier }) => (
            <div>{ businessSupplier ? businessSupplier.name : null }</div>
        ),
    };

    const manager = {
        title: props.intl.formatMessage({
            id: 'storage.responsible',
        }),
        dataIndex: 'manager',
        width:     '15%',
        render:    manager =>
            manager ? (
                <Link to={ `${book.employeesPage}/${manager.employeeId}` }>
                    { manager.name } { manager.surname }
                </Link>
            ) : null,
    };

    const sum = {
        title: props.intl.formatMessage({
            id: 'storage.sum',
        }),
        dataIndex: 'sum',
        width:     '15%',
        render:    sum => (
            <Numeral currency={ props.intl.formatMessage({ id: 'currency' }) }>
                { sum }
            </Numeral>
        ),
    };

    const actions = {
        width:     'auto',
        dataIndex: 'delete',
        render:    (key, { id }) => {
            return (
                <ActionIcons
                    edit={ () => goTo(`${book.storageIncomeDoc}/${id}`, { id }) }
                    delete={ () => props.deleteIncomeDoc(id) }
                />
            );
        },
    };

    return [
        id,
        supplierDocNumber,
        createdDatetime,
        doneDatetime,
        paidDatetime,
        status,
        supplier,
        manager,
        sum,
        actions,
    ];
};
