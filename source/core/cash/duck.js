import moment from 'moment';

/**
 * Constants
 * */
export const moduleName = 'cash';
const prefix = `cpb/${moduleName}`;

export const FETCH_CASHBOXES = `${prefix}/FETCH_CASHBOXES`;
export const FETCH_CASHBOXES_SUCCESS = `${prefix}/FETCH_CASHBOXES_SUCCESS`;

export const FETCH_CASH_ORDERS = `${prefix}/FETCH_CASH_ORDERS`;
export const FETCH_CASH_ORDERS_SUCCESS = `${prefix}/FETCH_CASH_ORDERS_SUCCESS`;

export const FETCH_CASHBOXES_BALANCE = `${prefix}/FETCH_CASHBOXES_BALANCE`;
export const FETCH_CASHBOXES_BALANCE_SUCCESS = `${prefix}/FETCH_CASHBOXES_BALANCE_SUCCESS`;

export const FETCH_CASHBOXES_ACTIVITY = `${prefix}/FETCH_CASHBOXES_ACTIVITY`;
export const FETCH_CASHBOXES_ACTIVITY_SUCCESS = `${prefix}/FETCH_CASHBOXES_ACTIVITY_SUCCESS`;

export const CREATE_CASHBOX = `${prefix}/CREATE_CASHBOX`;
export const CREATE_CASHBOX_SUCCESS = `${prefix}/CREATE_CASHBOX_SUCCESS`;

export const DELETE_CASHBOX = `${prefix}/DELETE_CASHBOX`;
export const DELETE_CASHBOX_SUCCESS = `${prefix}/DELETE_CASHBOX_SUCCESS`;

export const SET_CASH_ORDERS_FILTERS = `${prefix}/SET_CASH_ORDERS_FILTERS`;
export const SET_CASH_ACCOUNTING_FILTERS = `${prefix}/SET_CASH_ACCOUNTING_FILTERS`;

export const SET_SEARCH_QUERY = `${prefix}/SET_SEARCH_QUERY`;

export const PRINT_CASH_ORDERS = `${prefix}/PRINT_CASH_ORDERS`;
export const PRINT_CASH_ORDERS_SUCCESS = `${prefix}/PRINT_CASH_ORDERS_SUCCESS`;

/**
 * Reducer
 * */
const ReducerState = {
    cashboxes: [],
    activity:  [],
    balance:   [],
    stats:     {
        totalCount: null,
        increase:   null,
        decrease:   null,
        balance:    null,
    },
    cashOrders:        [],
    cashOrdersFilters: {
        startDate: moment()
            .subtract(30, 'days')
            .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        query:   '',
        page:    1,
    },
    cashAccountingFilters: {
        date:      moment(),
        startDate: moment()
            .startOf('month')
            .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
    },
};
// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CASHBOXES_SUCCESS:
            return {
                ...state,
                cashboxes: payload,
            };

        case FETCH_CASHBOXES_BALANCE_SUCCESS:
            return {
                ...state,
                balance: [ ...payload ],
            };

        case FETCH_CASHBOXES_ACTIVITY_SUCCESS:
            return {
                ...state,
                activity: [ ...payload ],
            };

        case CREATE_CASHBOX_SUCCESS:
            return {
                ...state,
                cashboxes: [ ...state.cashboxes, payload ],
            };

        case DELETE_CASHBOX_SUCCESS:
            return {
                ...state,
                cashboxes: [ ...state.cashboxes, payload ],
            };

        case FETCH_CASH_ORDERS:
            return {
                ...state,
                cashOrdersFilters: {
                    ...state.cashOrdersFilters,
                    ...payload,
                },
            };

        case FETCH_CASH_ORDERS_SUCCESS:
            return {
                ...state,
                cashOrders: payload.list,
                stats:      payload.stats,
            };

        case SET_CASH_ORDERS_FILTERS:
            return {
                ...state,
                cashOrdersFilters: {
                    ...state.cashOrdersFilters,
                    ...payload,
                },
            };

        case SET_SEARCH_QUERY:
            return {
                ...state,
                cashOrdersFilters: {
                    ...state.cashOrdersFilters,
                    query: payload,
                    page:  1,
                },
            };

        case SET_CASH_ACCOUNTING_FILTERS:
            return {
                ...state,
                cashAccountingFilters: {
                    ...state.cashAccountingFilters,
                    ...payload,
                },
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];
export const selectCashStats = state => ({
    increase: state.cash.stats.increase,
    decrease: state.cash.stats.decrease,
    balance:  Number(state.cash.stats.increase - state.cash.stats.decrease),
});
export const selectCashOrdersFilters = state => state.cash.cashOrdersFilters;

export const selectCashAccountingFilters = state =>
    state.cash.cashAccountingFilters;

/**
 * Action Creators
 * */

// cashboxes
export const fetchCashboxes = () => ({
    type: FETCH_CASHBOXES,
});

export const fetchCashboxesSuccess = cashboxes => ({
    type:    FETCH_CASHBOXES_SUCCESS,
    payload: cashboxes,
});

export const fetchCashboxesBalance = () => ({
    type: FETCH_CASHBOXES_BALANCE,
});

export const fetchCashboxesBalanceSuccess = balance => ({
    type:    FETCH_CASHBOXES_BALANCE_SUCCESS,
    payload: balance,
});

export const fetchCashboxesActivity = () => ({
    type: FETCH_CASHBOXES_ACTIVITY,
});

export const fetchCashboxesActivitySuccess = activity => ({
    type:    FETCH_CASHBOXES_ACTIVITY_SUCCESS,
    payload: activity,
});

export const createCashbox = cashbox => ({
    type:    CREATE_CASHBOX,
    payload: cashbox,
});

export const createCashboxSuccess = cashboxes => ({
    type:    CREATE_CASHBOX_SUCCESS,
    payload: cashboxes,
});

export const deleteCashbox = id => ({
    type:    DELETE_CASHBOX,
    payload: id,
});

export const deleteCashboxSuccess = cashbox => ({
    type:    DELETE_CASHBOX_SUCCESS,
    payload: cashbox,
});

export const setCashOrdersFilters = filters => ({
    type:    SET_CASH_ORDERS_FILTERS,
    payload: filters,
});

export const setCashAccountingFilters = filters => ({
    type:    SET_CASH_ACCOUNTING_FILTERS,
    payload: filters,
});

// cash orders

export const fetchCashOrders = filters => ({
    type:    FETCH_CASH_ORDERS,
    payload: filters,
});

export const fetchCashOrdersSuccess = cashOrders => ({
    type:    FETCH_CASH_ORDERS_SUCCESS,
    payload: cashOrders,
});

export const printCashOrder = () => ({
    type: PRINT_CASH_ORDERS,
});

export const printCashOrderSuccess = doc => ({
    type:    PRINT_CASH_ORDERS_SUCCESS,
    payload: doc,
});

export const setSearchQuery = searchQuery => ({
    type:    SET_SEARCH_QUERY,
    payload: searchQuery,
});
