// vendor
import React from 'react';

// proj
import { Numeral } from 'commons';
import { numeralFormatter } from 'utils';

export default props => {
    const name = {
        title: props.intl.formatMessage({
            id: 'storage.name',
        }),
        dataIndex: 'name',
        width:     '10%',
    };
    const remaining = {
        title: props.intl.formatMessage({
            id: 'storage.quantity',
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
        sum,
    ];
};
