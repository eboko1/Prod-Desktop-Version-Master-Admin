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
// filters
export const SET_ORDERS_PAGE_FILTER = `${prefix}/SET_ORDERS_PAGE_FILTER`;
export const SET_ORDERS_DATERANGE_FILTER = `${prefix}/SET_ORDERS_DATERANGE_FILTER`;
export const SET_ORDERS_STATUS_FILTER = `${prefix}/SET_ORDERS_STATUS_FILTER`;
export const SET_ORDERS_SEARCH_FILTER = `${prefix}/SET_ORDERS_SEARCH_FILTER`;

/**
 * Reducer
 * */
// const ReducerState = Record({
//     orders: new List([]),
// });

const ReducerState = {
    stats:  {},
    count:  0,
    data:   [],
    filter: {
        page:      1,
        status:    'not_complete,required,reserve,call',
        query:     '',
        daterange: {},
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_ORDERS_SUCCESS:
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

        case SET_ORDERS_PAGE_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page: payload,
                },
            };

        case SET_ORDERS_DATERANGE_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page:      1,
                    daterange: payload,
                },
            };

        case SET_ORDERS_STATUS_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page:   1,
                    status: payload,
                },
            };

        case SET_ORDERS_SEARCH_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    query: payload,
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
// export const selectFilter = state => state.orders.filter;
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

// Filter
export const setOrdersPageFilter = pageFilter => ({
    type:    SET_ORDERS_PAGE_FILTER,
    payload: pageFilter,
});

export const setOrdersDaterangeFilter = datarangeFilter => ({
    type:    SET_ORDERS_DATERANGE_FILTER,
    payload: datarangeFilter,
});

export const setOrdersStatusFilter = statusFilter => ({
    type:    SET_ORDERS_STATUS_FILTER,
    payload: statusFilter,
});

export const setOrdersSearchFilter = searchFilter => ({
    type:    SET_ORDERS_SEARCH_FILTER,
    payload: searchFilter,
});
