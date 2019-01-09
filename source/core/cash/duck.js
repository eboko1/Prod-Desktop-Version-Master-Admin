// import { v4 } from 'uuid';

/**
 * Constants
 * */
export const moduleName = 'cash';
const prefix = `cpb/${moduleName}`;

export const FETCH_CASHBOXES = `${prefix}/FETCH_CASHBOXES`;
export const FETCH_CASHBOXES_SUCCESS = `${prefix}/FETCH_CASHBOXES_SUCCESS`;

export const FETCH_CASHBOXES_ORDERS = `${prefix}/FETCH_CASHBOXES_ORDERS`;
export const FETCH_CASHBOXES_ORDERS_SUCCESS = `${prefix}/FETCH_CASHBOXES_ORDERS_SUCCESS`;

export const CREATE_CASHBOX = `${prefix}/CREATE_CASHBOX`;
export const CREATE_CASHBOX_SUCCESS = `${prefix}/CREATE_CASHBOX_SUCCESS`;

export const DELETE_CASHBOX = `${prefix}/DELETE_CASHBOX`;
export const DELETE_CASHBOX_SUCCESS = `${prefix}/DELETE_CASHBOX_SUCCESS`;

/**
 * Reducer
 * */
const ReducerState = {
    cashboxes: [],
    stats:     {
        totalCount: null,
        increase:   null,
        decrease:   null,
        // balance:    null,
    },
    cashOrders: [],
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

/**
 * Action Creators
 * */

export const fetchCashboxes = () => ({
    type: FETCH_CASHBOXES,
});

export const fetchCashboxesSuccess = cashboxes => ({
    type:    FETCH_CASHBOXES_SUCCESS,
    payload: cashboxes,
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
