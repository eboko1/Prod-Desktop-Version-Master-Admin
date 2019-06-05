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
            <ProductTableData link name={ name } code={ data.code } />
        ),
    };

    const quantity = {
        title: props.intl.formatMessage({
            id: 'storage.quantity',
        }),
        dataIndex: 'incomeQuantity',
        width:     '10%',
        render:    (incomeQuantity, data) =>
            incomeQuantity
                ? numeralFormatter(incomeQuantity)
                : numeralFormatter(data.expenseQuantity),
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
            <Numeral currency={ props.intl.formatMessage({ id: 'currency' }) }>
                { expensePrice }
            </Numeral>
        ),
    };
    const expenseSum = {
        title: props.intl.formatMessage({
            id: 'storage.expense_sum',
        }),
        dataIndex: 'expenseSum',
        width:     '10%',
        className: 'expense',
        render:    expenseSum => (
            <Numeral currency={ props.intl.formatMessage({ id: 'currency' }) }>
                { expenseSum }
            </Numeral>
        ),
    };

    return [
        name,
        quantity,
        incomePrice,
        incomeSum,
        expensePrice,
        expenseSum,
    ];
};
