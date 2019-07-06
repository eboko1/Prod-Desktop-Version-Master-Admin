// vendor
import React from 'react';

// proj
import { Numeral } from 'commons';
import { numeralFormatter } from 'utils';

//own
import { ProductTableData } from '../ProductTableData';

export default props => {
    const name = {
        title: props.intl.formatMessage({
            id: 'storage.name',
        }),
        dataIndex: 'name',
        width:     '10%',
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
        render:    remaining => numeralFormatter(remaining),
    };

    const reserve = {
        title: props.intl.formatMessage({
            id: 'storage.reserve',
        }),
        dataIndex: 'reserved',
        width:     '10%',
        render:    reserved => numeralFormatter(reserved),
    };

    const available = {
        title: props.intl.formatMessage({
            id: 'storage.available',
        }),
        key:    'available',
        width:  '10%',
        render: (_, data) => numeralFormatter(data.remaining - data.reserved),
    };

    const sum = {
        title: props.intl.formatMessage({
            id: 'storage.sum',
        }),
        dataIndex: 'sellingSum',
        width:     '10%',
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
