export const cashOrderTypes = Object.freeze({
    INCOME:     'INCOME',
    EXPENSE:    'EXPENSE',
    ADJUSTMENT: 'ADJUSTMENT',
});

export const cashOrderCounterpartyTypes = Object.freeze({
    CLIENT:            'CLIENT',
    EMPLOYEE:          'EMPLOYEE',
    BUSINESS_SUPPLIER: 'BUSINESS_SUPPLIER',
    OTHER:             'OTHER',
});

//Mapper, this is used when order type is adjustment(we can adjust two types of orders)
export const adjustmentSumTypes = Object.freeze({
    INCOME: 'increase', //Incomes
    EXPENSE: 'decrease' //Expenses
});