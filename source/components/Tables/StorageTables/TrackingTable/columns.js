// vendor
import React from 'react';
import { Tag } from 'antd';
import _ from 'lodash';

// proj
import { MODALS } from 'core/modals/duck';
import { DatetimeFormatter } from 'commons/_uikit';
import { Numeral } from 'commons';

export default props => {
    // const id = {
    //     title:     '№',
    //     dataIndex: 'id',
    // };

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
                { product.code }
            </div>
        ),
    };

    const type = {
        title: props.intl.formatMessage({
            id: 'storage.operation_type',
        }),
        key:    'type',
        width:  '5%',
        render: ({ doc }) => (
            <Tag
                color={
                    doc.type === 'INCOME' ? 'var(--green)' : 'var(--warning)'
                }
            >
                { props.intl.formatMessage({ id: `storage.${doc.type}` }) }
            </Tag>
        ),
    };

    const docNum = {
        title: props.intl.formatMessage({
            id: 'storage.document_number',
        }),
        key:    'docNum',
        width:  '7.5%',
        render: ({ doc }) => doc.id,
    };

    const createdDatetime = {
        title: props.intl.formatMessage({
            id: 'storage.date',
        }),
        key:    'createdDatetime',
        width:  '10%',
        render: ({ doc }) => (
            <DatetimeFormatter datetime={ doc.createdDatetime } />
        ),
    };

    const tradeCode = {
        title: props.intl.formatMessage({
            id: 'storage.trade_code',
        }),
        key:    'tradeCode',
        width:  '10%',
        render: ({ doc }) => doc.tradeCode,
    };

    const quantity = {
        title: props.intl.formatMessage({
            id: 'storage.quantity',
        }),
        dataIndex: 'quantity',
        width:     '7.5%',
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
        render:    purchaseSum => (
            <Numeral currency={ props.intl.formatMessage({ id: 'currency' }) }>
                { purchaseSum }
            </Numeral>
        ),
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
        render:    sellingSum => (
            <Numeral currency={ props.intl.formatMessage({ id: 'currency' }) }>
                { sellingSum }
            </Numeral>
        ),
    };

    return [
        // id,
        code,
        type,
        docNum,
        createdDatetime,
        tradeCode,
        quantity,
        purchasePrice,
        purchaseSum,
        sellingPrice,
        sellingSum,
    ];
};
