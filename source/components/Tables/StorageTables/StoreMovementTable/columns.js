// vendor
import React from 'react';

// proj
import { Numeral } from 'commons';
import { numeralFormatter } from 'utils';

// own
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

    const incomePrice = {
        title: props.intl.formatMessage({
            id: 'storage.income_price',
        }),
        dataIndex: 'incomePrice',
        width:     '10%',
        className: 'income',
        render:    incomePrice => (
            <Numeral currency={ props.intl.formatMessage({ id: 'currency' }) }>
                { incomePrice }
            </Numeral>
        ),
    };

    const incomeQuantity = {
        title: props.intl.formatMessage({
            id: 'storage.quantity',
        }),
        dataIndex: 'incomeQuantity',
        width:     '5%',
        className: 'income',
        render:    incomeQuantity => numeralFormatter(incomeQuantity),
    };

    const incomeSum = {
        title: props.intl.formatMessage({
            id: 'storage.income_sum',
        }),
        dataIndex: 'incomeSum',
        width:     '10%',
        className: 'income',
        render:    incomeSum => (
            <Numeral currency={ props.intl.formatMessage({ id: 'currency' }) }>
                { incomeSum }
            </Numeral>
        ),
    };
    const expensePrice = {
        title: props.intl.formatMessage({
            id: 'storage.expense_price',
        }),
        dataIndex: 'expensePrice',
        width:     '10%',
        className: 'expense',
        render:    expensePrice => (
            <>
                -
                <Numeral
                    currency={ props.intl.formatMessage({ id: 'currency' }) }
                >
                    { expensePrice }
                </Numeral>
            </>
        ),
    };

    const expenseQuantity = {
        title: props.intl.formatMessage({
            id: 'storage.quantity',
        }),
        dataIndex: 'expenseQuantity',
        width:     '5%',
        className: 'expense',
        render:    expenseQuantity => numeralFormatter(expenseQuantity),
    };

    const expenseSum = {
        title: props.intl.formatMessage({
            id: 'storage.expense_sum',
        }),
        dataIndex: 'expenseSum',
        width:     '10%',
        className: 'expense',
        render:    expenseSum => (
            <>
                -
                <Numeral
                    currency={ props.intl.formatMessage({ id: 'currency' }) }
                >
                    { expenseSum }
                </Numeral>
            </>
        ),
    };

    return [
        name,
        incomePrice,
        incomeQuantity,
        incomeSum,
        expensePrice,
        expenseQuantity,
        expenseSum,
    ];
};
