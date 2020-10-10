// vendor
import React from 'react';

// proj
import { Numeral } from 'commons';
import { numeralFormatter } from 'utils';

//own
import { ProductTableData } from '../ProductTableData';

export default props => {
    const name = {
        title: `${props.intl.formatMessage({id: 'order_form_table.product_code'})}/${props.intl.formatMessage({id: 'storage.name'})}`,
        dataIndex: 'name',
        width:     '10%',
        sorter: (a, b) => a.code < b.code ? -1 : (a.code > b.code ? 1 : 0),
        defaultSortOrder: 'ascend',
        sortDirections: ['descend', 'ascend'],
        render:    (name, data) => (
            <ProductTableData
                link
                name={ name }
                code={ data.code }
                onClick={ () =>
                    props.redirectToTracking({
                        id:   data.id,
                        name: data.name,
                        code: data.code,
                    })
                }
            />
        ),
    };

    const remaining = {
        title: props.intl.formatMessage({
            id: 'storage.in_stock',
        }),
        dataIndex: 'remaining',
        width:     '10%',
        sorter: (a, b) => a.remaining - b.remaining,
        sortDirections: ['descend', 'ascend'],
        render:    remaining => numeralFormatter(remaining),
    };

    const reserve = {
        title: props.intl.formatMessage({
            id: 'storage.reserve',
        }),
        dataIndex: 'reserved',
        width:     '10%',
        sorter: (a, b) => a.reserved - b.reserved,
        sortDirections: ['descend', 'ascend'],
        render:    reserved => numeralFormatter(reserved),
    };

    const available = {
        title: props.intl.formatMessage({
            id: 'storage.available',
        }),
        key:    'available',
        width:  '10%',
        sorter: (a, b) => (a.remaining - a.reserved) - (b   .remaining - b.reserved),
        sortDirections: ['descend', 'ascend'],
        render: (_, data) => numeralFormatter(data.remaining - data.reserved),
    };

    const sum = {
        title: props.intl.formatMessage({
            id: 'storage.sum',
        }),
        dataIndex: 'sum',
        width:     '10%',
        sorter: (a, b) => a.sum - b.sum,
        sortDirections: ['descend', 'ascend'],
        render:    sum => (
            <Numeral currency={ props.intl.formatMessage({ id: 'currency' }) }>
                { sum }
            </Numeral>
        ),
    };

    return [
        // id,
        name,
        remaining,
        reserve,
        available,
        sum,
    ];
};
