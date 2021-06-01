/* Constants */
export const moduleName = 'addLaborOrDetailToOrderModal';
const prefix = `cpb/${moduleName}`;

export const FETCH_ORDERS = `${prefix}/FETCH_ORDERS`;
export const FETCH_ORDERS_SUCCESS = `${prefix}/FETCH_ORDERS_SUCCESS`;


export const SET_ORDERS_PAGE = `${prefix}/SET_ORDERS_PAGE`;
export const SET_ORDERS_SEARCH_QUERY = `${prefix}/SET_ORDERS_SEARCH_QUERY`;
export const SET_DETAILS = `${prefix}/SET_DETAILS`;
export const SET_SERVICES = `${prefix}/SET_SERVICES`;


/**
 * Modes of the modal that are supported. Each mode is used to define how to fetch,
 * represent, show data, and what to do with it.
 */
export const modes = Object.freeze({
    ADD_LABOR: "ADD_LABOR",
    ADD_DETAIL: "ADD_DETAIL",
});

/* Reducer */

const ReducerState = {
    ordersData: {
        orders: [],
        stats: {},
        query: { //Filters
            page: 1,
            query: undefined,
        },
    },

    details: [],
    services: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_ORDERS_SUCCESS:
            const { orders, stats: ordersStats } = payload;
            return {
                ...state,
                ordersData: {
                    ...state.ordersData,
                    orders: orders,
                    stats: ordersStats,
                }
            };

        case SET_ORDERS_PAGE:
            const { page } = payload;
            return {
                ...state,
                ordersData: {
                    ...state.ordersData,
                    query: {
                        ...state.ordersData.query,
                        page: page,
                    }
                }
            };

        case SET_ORDERS_SEARCH_QUERY:
            const { query } = payload;
            return {
                ...state,
                ordersData: {
                    ...state.ordersData,
                    query: {
                        ...state.ordersData.query,
                        query: query,
                    }
                }
            };

        case SET_DETAILS:
            const { details } = payload;
            return {
                ...state,
                details: details,
            };

        case SET_SERVICES:
            const { services } = payload;
            return {
                ...state,
                services: services
            };

        default: return state;
    }
}

/* Selectors */

// ----------------- Orders --------------------------------
export const selectOrders = state => state[ moduleName ].ordersData.orders;
export const selectOrdersStats = state => state[ moduleName ].ordersData.stats;
export const selectOrdersQuery = state => state[ moduleName ].ordersData.query;


export const selectDetails = state => state[ moduleName ].details;
export const selectservices = state => state[ moduleName ].services;


/* Actions */

export const fetchOrders = () => ({
    type:    FETCH_ORDERS,
});

export const fetchOrdersSuccess = ({orders, stats}) => ({
    type:    FETCH_ORDERS_SUCCESS,
    payload: { orders, stats },
});

export const setOrdersPage = ({page}) => ({
    type:    SET_ORDERS_PAGE,
    payload: {page},
});

export const setOrdersSearchQuery = ({query}) => ({
    type:    SET_ORDERS_SEARCH_QUERY,
    payload: {query},
});

export const setDetails = ({details}) => ({
    type:    SET_DETAILS,
    payload: {details},
});

export const setServices = ({services}) => ({
    type:    SET_SERVICES,
    payload: {services},
});