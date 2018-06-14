import { Record, List } from 'immutable';
import { createSelector } from 'reselect';
import { v4 as uid } from 'uuid';

/**
 * Constants
 * */
export const moduleName = 'orders';
const prefix = `cpb/${moduleName}`;

export const FETCH_ORDERS = `${prefix}/FETCH_ORDERS`;
export const FETCH_ORDERS_SUCCESS = `${prefix}/FETCH_ORDERS_SUCCESS`;
export const FETCH_ORDERS_FAIL = `${prefix}/FETCH_ORDERS_FAIL`;

export const FETCH_ORDERS_STATS = `${prefix}/FETCH_ORDERS_STATS`;
export const FETCH_ORDERS_STATS_SUCCESS = `${prefix}/FETCH_ORDERS_STATS_SUCCESS`;
export const FETCH_ORDERS_STATS_FAIL = `${prefix}/FETCH_ORDERS_STATS_FAIL`;

export const FETCH_ORDERS_FILTERS = `${prefix}/FETCH_ORDERS_FILTERS`;
export const FETCH_ORDERS_FILTERS_SUCCESS = `${prefix}/FETCH_ORDERS__FILTERS_SUCCESS`;
export const FETCH_ORDERS_FILTERS_FAIL = `${prefix}/FETCH_ORDERS__FILTERS_FAIL`;

export const ORDERS_SEARCH = `${prefix}/ORDERS_SEARCH`;
export const ORDERS_SEARCH_SUCCESS = `${prefix}/ORDERS_SEARCH_SUCCESS`;

/**
 * Reducer
 * */
// const ReducerState = Record({
//     orders: new List([]),
// });

const ReducerState = {
    stats:  {},
    count:  '',
    data:   [],
    search: '',
    filter: {},
};

export default function reducer(state = ReducerState, action) {
    // export default function reducer(state = new ReducerState(), action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_ORDERS_SUCCESS:
            // console.group('orders reducer');
            // console.log('state', state.orders);
            // console.log('payload', payload);
            // console.log('return', state.set('orders', payload.orders));
            // console.groupEnd();

            // return state.orders.set(0, payload);
            // return state.set('orders', payload);

            return {
                ...state,
                count: payload.count,
                data:  payload.orders.map(order =>
                    Object.assign({ ...order }, { key: uid() })),
            };

        case FETCH_ORDERS_STATS_SUCCESS:
            return {
                ...state,
                stats: payload,
            };

        case FETCH_ORDERS_FILTERS_SUCCESS:
            return {
                ...state,
                filter: payload,
            };

        case ORDERS_SEARCH:
            return {
                ...state,
                search: payload,
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];
// export const ordersSelector = createSelector(stateSelector, state => {
//     // console.log('ordersSelector', state.orders);
//
//     // return state.orders.valueSeq().toArray();
//     return state.data.orders;
// });

/**
 * Action Creators
 * */

export function fetchOrders(filter) {
    return {
        type:    FETCH_ORDERS,
        payload: filter,
    };
}

export function fetchOrdersSuccess(orders) {
    return {
        type:    FETCH_ORDERS_SUCCESS,
        payload: orders,
    };
}

export function fetchOrdersFail(error) {
    return {
        type:    FETCH_ORDERS_FAIL,
        payload: error,
        error:   true,
    };
}

export function fetchOrdersStats() {
    return {
        type: FETCH_ORDERS_STATS,
    };
}

export function fetchOrdersStatsSuccess(stats) {
    return {
        type:    FETCH_ORDERS_STATS_SUCCESS,
        payload: stats,
    };
}

export function fetchOrdersStatsFail(error) {
    return {
        type:    FETCH_ORDERS_STATS_FAIL,
        payload: error,
        error:   true,
    };
}

export function ordersSearch(search) {
    return {
        type:    ORDERS_SEARCH,
        payload: search,
    };
}

export function ordersSearchSuccess(search) {
    return {
        type:    ORDERS_SEARCH_SUCCESS,
        payload: search,
    };
}

export function ordersFilter({ filter }) {
    return {
        type:    FETCH_ORDERS_FILTERS,
        payload: filter,
    };
}

export function ordersFilterSuccess({ filter }) {
    return {
        type:    FETCH_ORDERS_FILTERS_SUCCESS,
        payload: filter,
    };
}

export function fetchFilterFail(error) {
    return {
        type:    FETCH_ORDERS_STATS_FAIL,
        payload: error,
        error:   true,
    };
}
