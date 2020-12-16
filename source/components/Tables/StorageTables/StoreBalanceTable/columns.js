// vendor
import React from 'react';

// proj
import { Numeral } from 'commons';
import { numeralFormatter } from 'utils';

//own
import { ProductTableData } from '../ProductTableData';
import Styles from './styles.m.css';

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
                        date: props.filters.date,
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
        render:    (remaining, data) => {
            return (
                <div className={Styles.cellWrapp} 
                    onClick={()=>{
                        props.redirectToTracking({
                            id:   data.id,
                            name: data.name,
                            code: data.code,
                            date: props.filters.date,
                        })
                    }}
                >
                    {numeralFormatter(remaining)}
                </div>
            )
        },
    };

    const reserve = {
        title: props.intl.formatMessage({
            id: 'storage.reserve',
        }),
        dataIndex: 'reserved',
        width:     '10%',
        sorter: (a, b) => a.reserved - b.reserved,
        sortDirections: ['descend', 'ascend'],
        render:    (reserved, data) => {
            return (
                <div className={Styles.cellWrapp} 
                    onClick={()=>{
                        props.redirectToTracking({
                            id:   data.id,
                            name: data.name,
                            code: data.code,
                            type: "reserves",
                            date: props.filters.date,
                        })
                    }}
                >
                    {numeralFormatter(reserved)}
                </div>
            )
        },
    };

    const available = {
        title: props.intl.formatMessage({
            id: 'storage.available',
        }),
        key:    'available',
        width:  '10%',
        sorter: (a, b) => (a.remaining - a.reserved) - (b   .remaining - b.reserved),
        sortDirections: ['descend', 'ascend'],
        render:    (_, data) => {
            return (
                <div className={Styles.cellWrapp} 
                    onClick={()=>{
                        props.redirectToTracking({
                            id:   data.id,
                            name: data.name,
                            code: data.code,
                            date: props.filters.date,
                        })
                    }}
                >
                    {numeralFormatter(data.remaining - data.reserved)}
                </div>
            )
        },
    };

    const ordered = {
        title: props.intl.formatMessage({
            id: 'storage.ordered',
        }),
        key:    'countInStoreOrders',
        dataIndex: 'countInStoreOrders',
        width:  '10%',
        sorter: (a, b) => a.countInStoreOrders - b.countInStoreOrders,
        sortDirections: ['descend', 'ascend'],
        render:    (ordered, data) => {
            return (
                <div className={Styles.cellWrapp} 
                    onClick={()=>{
                        props.redirectToTracking({
                            id:   data.id,
                            name: data.name,
                            code: data.code,
                            type: "orders",
                            date: props.filters.date,
                        })
                    }}
                >
                    {numeralFormatter(ordered)}
                </div>
            )
        },
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
        ordered,
        sum,
    ];
};
