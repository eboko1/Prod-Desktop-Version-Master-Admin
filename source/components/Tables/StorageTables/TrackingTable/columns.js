// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { MODALS } from 'core/modals/duck';
import { DatetimeFormatter } from 'commons/_uikit';
import { Numeral } from 'commons';
import book from 'routes/book';
import { numeralFormatter } from 'utils';

// own
import { ProductTableData } from '../ProductTableData';

const getMinus = (docType, value) => {
    if (docType) {
        return '';
    }
    if (!docType && value === 0) {
        return '';
    }

    return '-';
};

export default props => {
    const code = {
        title: props.intl.formatMessage({
            id: 'storage.product_code',
        }),
        key: 'code',
        dataIndex: 'code',
        render:    (code, { product }) => (
            <div
                onClick={ () =>
                    props.setModal(MODALS.STORE_PRODUCT, {
                        id:      product.id,
                        name:    product.name,
                        code:    product.code,
                        editing: true,
                    })
                }
            >
                { }
                <ProductTableData name={ product.name } code={ product.code } />
            </div>
        ),
    };

    const type = {
        title: props.intl.formatMessage({
            id: 'storage.operation_type',
        }),
        key:    'type',
        render: (key, data) => {
            const type = _.get(data, 'doc.type');

            return (
                <Tag
                    color={
                        type === 'INCOME' ? 'var(--green)' : 'var(--warning)'
                    }
                >
                    { props.intl.formatMessage({
                        id: `storage.${type ? type : 'EXPENSE'}`,
                    }) }
                </Tag>
            );
        },
    };

    const docNum = {
        title: props.intl.formatMessage({
            id: 'storage.document',
        }),
        key:    'docNum',
        render: (key, data) => {
            const docId = _.get(data, 'doc.id'),
                  documentNumber = _.get(data, 'doc.documentNumber');

            return data.orderId ? (
                <a
                    href={ `${book.order}/${data.orderId}` }
                    style={ { color: 'var(--link)', fontWeight: 'bold' } }
                >
                    { data.orderId }
                </a>
            ) : (
                <a
                    href={ `${book.storageDocument}/${docId}` }
                    style={ { color: 'var(--link)', fontWeight: 'bold' } }
                >
                    { documentNumber }
                </a>
            );
        },
    };

    const docNumAndType = {
        title: props.intl.formatMessage({
            id: 'storage.document',
        }),
        key:    'docNumAndType',
        render: (key, data) => {
            const docId = _.get(data, 'doc.id'),
                  documentNumber = _.get(data, 'doc.documentNumber');
            const type = _.get(data, 'doc.type');

            return data.orderId ? (
                <div>   
                    <a
                        href={ `${book.order}/${data.orderId}` }
                        style={ { color: 'var(--link)', fontWeight: 'bold' } }
                    >
                        { data.orderId }
                    </a>
                    <Tag
                        color={
                            type === 'INCOME' ? 'var(--green)' : 'var(--warning)'
                        }
                    >
                        { props.intl.formatMessage({
                            id: `storage.${type ? type : 'EXPENSE'}`,
                        }) }
                    </Tag>
                </div>
            ) : (
                <div>
                    <a
                        href={ `${book.storageDocument}/${docId}` }
                        style={ { color: 'var(--link)', fontWeight: 'bold' } }
                    >
                        { documentNumber }
                    </a>
                    <Tag
                        color={
                            type === 'INCOME' ? 'var(--green)' : 'var(--warning)'
                        }
                    >
                        { props.intl.formatMessage({
                            id: `storage.${type ? type : 'EXPENSE'}`,
                        }) }
                    </Tag>
                </div>
            );
        },
    }

    const createdDatetime = {
        title: props.intl.formatMessage({
            id: 'storage.date',
        }),
        dataIndex: 'datetime',
        sorter:    (a, b) =>
            moment(a.datetime).isAfter(b.datetime)
                ? 1
                : moment(b.datetime).isAfter(a.datetime)
                    ? -1
                    : 0,
        defaultSortOrder: 'descend',
        render:    datetime => <DatetimeFormatter datetime={ datetime } />,
    };

    const counterparty = {
        title: props.intl.formatMessage({
            id: 'storage.counterparty',
        }),
        dataIndex: 'doc',
        render:    (doc, data) => {
            const income = Boolean(doc);
            const isCounterpartyExists =
                _.get(data, 'order.client.id') ||
                _.get(data, 'doc.businessSupplier.name');

            return isCounterpartyExists ? (
                <Link
                    to={
                        income
                            ? `${book.supplier}/${_.get(data, 'doc.businessSupplier.id')}`
                            : `${book.client}/${_.get(data, 'order.client.id')}`
                    }
                >
                    { income
                        ? `${_.get(data, 'doc.businessSupplier.name', '')}`
                        : `${_.get(data, 'order.client.name', '')} ${_.get(
                            data,
                            'order.client.surname',
                            '',
                        )}` }
                </Link>
            ) : null;
        },
    };

    const responsible = {
        title: props.intl.formatMessage({
            id: 'storage.responsible',
        }),
        dataIndex: 'order',
        render:    (order, data) => {
            const expense = Boolean(order);
            const isManagerExists =
                _.get(data, 'order.manager.employeeId') ||
                _.get(data, 'doc.manager.employeeId');

            return isManagerExists ? (
                <Link
                    to={ `${book.employeesPage}/${
                        expense
                            ? _.get(data, 'order.manager.employeeId')
                            : _.get(data, 'doc.manager.employeeId')
                    }` }
                >
                    { expense
                        ? `${_.get(data, 'order.manager.name', '')} ${_.get(
                            data,
                            'order.manager.surname',
                            '',
                        )}`
                        : `${_.get(data, 'doc.manager.name', '')} ${_.get(
                            data,
                            'doc.manager.surname',
                            '',
                        )}` }
                </Link>
            ) : null;
        },
    };

    const quantity = {
        title: props.intl.formatMessage({
            id: 'storage.quantity',
        }),
        dataIndex: 'quantity',
        render:    (quantity, data) => {
            return (
                <>
                    { getMinus(
                        _.get(data, 'doc.type'),
                        Number.parseInt(quantity, 0),
                    ) }
                    <Numeral>{ Number.parseInt(quantity, 0) }</Numeral>
                </>
            );
        },
    };

    const purchasePrice = {
        title: props.intl.formatMessage({
            id: 'storage.purchase_price',
        }),
        dataIndex: 'purchasePrice',
        render:    purchasePrice => (
            <Numeral currency={ props.intl.formatMessage({ id: 'currency' }) }>
                { purchasePrice }
            </Numeral>
        ),
    };

    const purchaseSum = {
        title: props.intl.formatMessage({
            id: 'storage.purchase_sum',
        }),
        dataIndex: 'purchaseSum',
        render:    (purchaseSum, data) => {
            return (
                <>
                    { getMinus(_.get(data, 'doc.type'), purchaseSum) }
                    <Numeral
                        currency={ props.intl.formatMessage({ id: 'currency' }) }
                    >
                        { purchaseSum }
                    </Numeral>
                </>
            );
        },
    };

    const sellingPrice = {
        title: props.intl.formatMessage({
            id: 'storage.selling_price',
        }),
        dataIndex: 'sellingPrice',
        render:    sellingPrice => (
            <Numeral currency={ props.intl.formatMessage({ id: 'currency' }) }>
                { sellingPrice }
            </Numeral>
        ),
    };

    const sellingSum = {
        title: props.intl.formatMessage({
            id: 'storage.selling_sum',
        }),
        dataIndex: 'sellingSum',
        render:    (sellingSum, data) => {
            return (
                <>
                    { getMinus(_.get(data, 'doc.type'), sellingSum) }
                    <Numeral
                        currency={ props.intl.formatMessage({ id: 'currency' }) }
                    >
                        { sellingSum }
                    </Numeral>
                </>
            );
        },
    };

    const columns = [
        code,
        type,
        docNum,
        docNumAndType,
        createdDatetime,
        counterparty,
        responsible,
        quantity,
        purchasePrice,
        purchaseSum,
        sellingPrice,
        sellingSum,
    ];

    if(props.rawData) {
        _.remove(columns, ({key}) => key == 'type' || key == 'docNum')
    } else {
        _.remove(columns, ({key}) => key == 'docNumAndType')
    }
    if(props.hideCode) {
        _.remove(columns, ({key}) => key == 'code')
    }

    return columns;
};
