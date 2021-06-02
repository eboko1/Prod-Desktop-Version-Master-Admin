/* Constants */
export const moduleName = 'addLaborOrDetailToOrderModal';
const prefix = `cpb/${moduleName}`;

export const FETCH_ORDERS = `${prefix}/FETCH_ORDERS`;
export const FETCH_ORDERS_SUCCESS = `${prefix}/FETCH_ORDERS_SUCCESS`;

export const ADD_LABOR_TO_ORDER = `${prefix}/ADD_LABOR_TO_ORDER`;
export const ADD_DETAILS_TO_ORDER = `${prefix}/ADD_DETAILS_TO_ORDER`;

export const SET_ORDERS_PAGE = `${prefix}/SET_ORDERS_PAGE`;
export const SET_ORDERS_SEARCH_QUERY = `${prefix}/SET_ORDERS_SEARCH_QUERY`;
export const SET_DETAILS = `${prefix}/SET_DETAILS`;
export const SET_SERVICES = `${prefix}/SET_SERVICES`;
export const SET_SELECTED_ORDER_ID = `${prefix}/SET_SELECTED_ORDER_ID`;


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

    selectedOrderId: undefined,

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

        case SET_SELECTED_ORDER_ID:
            const { orderId } = payload;
            return {
                ...state,
                selectedOrderId: orderId
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
export const selectSelectedOrderId = state => state[ moduleName ].selectedOrderId;


/* Actions */

export const fetchOrders = () => ({
    type:    FETCH_ORDERS,
});

export const addLaborToOrder = () => ({
    type:    ADD_LABOR_TO_ORDER,
});

export const addDetailsToOrder = () => ({
    type:    ADD_DETAILS_TO_ORDER,
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

export const setSelectedOrderId = ({orderId}) => ({
    type:    SET_SELECTED_ORDER_ID,
    payload: {orderId},
});