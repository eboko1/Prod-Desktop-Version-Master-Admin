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
export const RESET_ORDERS_DATERANGE_FILTER = `${prefix}/RESET_ORDERS_DATERANGE_FILTER`;
export const SET_ORDERS_STATUS_FILTER = `${prefix}/SET_ORDERS_STATUS_FILTER`;
export const SET_ORDERS_SEARCH_FILTER = `${prefix}/SET_ORDERS_SEARCH_FILTER`;
export const SET_ORDERS_NPS_FILTER = `${prefix}/SET_ORDERS_NPS_FILTER`;
export const FETCH_ORDERS_CANCEL_REASON_FILTER = `${prefix}/FETCH_CANCEL_REASON_FILTER`;
export const SET_ORDERS_CANCEL_REASON_FILTER = `${prefix}/SET_CANCEL_REASON_FILTER`;
// universal UniversalFilters
export const FETCH_STATS_COUNTS_PANEL = `${prefix}/FETCH_STATS_COUNTS_PANEL`;
export const FETCH_STATS_COUNTS_PANEL_SUCCESS = `${prefix}/FETCH_STATS_COUNTS_PANEL_SUCCESS`;
export const SET_UNIVERSAL_FILTERS = `${prefix}/SET_UNIVERSAL_FILTERS`;

export const CREATE_INVITE_ORDERS = `${prefix}/CREATE_INVITE_ORDERS`;
export const CREATE_INVITE_ORDERS_SUCCESS = `${prefix}/CREATE_INVITE_ORDERS_SUCCESS`;
export const CREATE_INVITE_ORDERS_FAIL = `${prefix}/CREATE_INVITE_ORDERS_FAIL`;

export const SET_ORDERS_PAGE_SORT = `${prefix}/SET_ORDERS_PAGE_SORT`;
/**
 * Reducer
 * */
const ReducerState = {
    stats:  {},
    count:  0,
    data:   [],
    filter: {
        page:          1,
        status:        'not_complete,required,call',
        query:         '',
        daterange:     {},
        minNps:        void 0,
        maxNps:        void 0,
        orderComments: void 0,
    },
    sort: {
        field: 'datetime',
        order: 'descend',
    },
    statsCountsPanel: {
        stats: {},
    },
};
// eslint-disable-next-line
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

        case RESET_ORDERS_DATERANGE_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    daterange: {},
                },
            };

        case SET_ORDERS_PAGE_SORT:
            return {
                ...state,
                sort: payload,
            };

        case SET_ORDERS_STATUS_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page:          1,
                    minNps:        void 0,
                    maxNps:        void 0,
                    status:        payload,
                    cancelReasons: void 0,
                },
                sort: {
                    order: 'desc',
                    field: 'datetime',
                },
            };

        case SET_ORDERS_SEARCH_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page:  1,
                    query: payload,
                },
            };

        case SET_ORDERS_NPS_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page:   1,
                    minNps: payload.minNps,
                    maxNps: payload.maxNps,
                },
            };

        case SET_ORDERS_CANCEL_REASON_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    cancelReasons: payload,
                },
            };

        case SET_UNIVERSAL_FILTERS:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page: 1,
                    ...payload,
                },
            };

        case FETCH_STATS_COUNTS_PANEL_SUCCESS:
            return {
                ...state,
                statsCountsPanel: {
                    stats: payload,
                },
            };

        case CREATE_INVITE_ORDERS_SUCCESS:
            return {
                ...state,
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];

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

export function fetchOrdersStats(filters = {}) {
    return {
        type:    FETCH_ORDERS_STATS,
        payload: filters,
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

export const resetOrdersDaterangeFilter = () => ({
    type: RESET_ORDERS_DATERANGE_FILTER,
});

export const setOrdersStatusFilter = statusFilter => ({
    type:    SET_ORDERS_STATUS_FILTER,
    payload: statusFilter,
});

export const setOrdersPageSort = sort => ({
    type:    SET_ORDERS_PAGE_SORT,
    payload: sort,
});

export const setOrdersSearchFilter = searchFilter => ({
    type:    SET_ORDERS_SEARCH_FILTER,
    payload: searchFilter,
});

export const setOrdersNPSFilter = nps => ({
    type:    SET_ORDERS_NPS_FILTER,
    payload: nps,
});

export const setOrdersCancelReasonFilter = cancelReason => ({
    type:    SET_ORDERS_CANCEL_REASON_FILTER,
    payload: cancelReason,
});

// Universal Filters
export const setUniversalFilters = universalFilters => ({
    type:    SET_UNIVERSAL_FILTERS,
    payload: universalFilters,
});

// StatsCountsPanel
export const fetchStatsCounts = () => ({
    type: FETCH_STATS_COUNTS_PANEL,
});

export function fetchStatsCountsSuccess(stats) {
    return {
        type:    FETCH_STATS_COUNTS_PANEL_SUCCESS,
        payload: stats,
    };
}

export function createInviteOrders(inviteOrdersPayload) {
    return {
        type:    CREATE_INVITE_ORDERS,
        payload: inviteOrdersPayload,
    };
}

export function createInviteOrdersSuccess(response) {
    return {
        type:    CREATE_INVITE_ORDERS_SUCCESS,
        payload: response,
    };
}

export function createInviteOrdersFail(error) {
    return {
        type:    CREATE_INVITE_ORDERS_FAIL,
        payload: error,
        error:   true,
    };
}
