// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';
import _ from 'lodash';

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
        dataIndex: 'code',
        width:     '10%',
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
        width:  '5%',
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
            id: 'storage.document_number',
        }),
        key:    'docNum',
        width:  '7.5%',
        render: (key, data) => {
            const docId = _.get(data, 'doc.id');

            return docId ? (
                <Link
                    to={ `${book.storageIncomeDoc}/${docId}` }
                    style={ { color: 'var(--link)', fontWeight: 'bold' } }
                >
                    { docId }
                </Link>
            ) : (
                <Link
                    to={ `${book.order}/${data.orderId}` }
                    style={ { color: 'var(--link)', fontWeight: 'bold' } }
                >
                    { data.orderId }
                </Link>
            );
        },
    };

    const createdDatetime = {
        title: props.intl.formatMessage({
            id: 'storage.date',
        }),
        dataIndex: 'datetime',
        width:     '10%',
        render:    datetime => <DatetimeFormatter datetime={ datetime } />,
    };

    const counterparty = {
        title: props.intl.formatMessage({
            id: 'storage.counterparty',
        }),
        dataIndex: 'doc',
        width:     '10%',
        render:    (doc, data) => {
            const income = Boolean(doc);
            const isCounterpartyExists =
                _.get(data, 'order.client.id') ||
                _.get(data, 'doc.businessSupplier.name');

            return isCounterpartyExists ? (
                <Link
                    to={
                        income
                            ? `${book.suppliersPage}`
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
        width:     '10%',
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
        width:     '7.5%',
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
        width:     '10%',
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
        width:     '10%',
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
        width:     '10%',
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
        width:     '10%',
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

    return [
        // id,
        code,
        type,
        docNum,
        createdDatetime,
        counterparty,
        responsible,
        quantity,
        purchasePrice,
        purchaseSum,
        sellingPrice,
        sellingSum,
    ];
};
