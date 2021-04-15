/**
 * Constants
 * */
export const moduleName = 'clientHotOperations';
const prefix = `cpb/${moduleName}`;

export const FETCH_CLIENTS = `${prefix}/FETCH_CLIENTS`;
export const FETCH_CLIENTS_SUCCESS = `${prefix}/FETCH_CLIENTS_SUCCESS`;

export const FETCH_CLIENT_ORDERS = `${prefix}/FETCH_CLIENT_ORDERS`;
export const FETCH_CLIENT_ORDERS_SUCCESS = `${prefix}/FETCH_CLIENT_ORDERS_SUCCESS`;

export const CREATE_ORDER_FOR_CLIENT = `${prefix}/CREATE_ORDER_FOR_CLIENT`;
export const CREATE_ORDER_FOR_CLIENT_SUCCESS = `${prefix}/CREATE_ORDER_FOR_CLIENT_SUCCESS`

export const SET_FILTERS_SEARCH_QUERY = `${prefix}/SET_FILTERS_SEARCH_QUERY`;
export const SET_CLIENT_ORDERS_FETCHING = `${prefix}/SET_CLIENT_ORDERS_FETCHING`;

export const SET_CLIENTS_FETCHING = `${prefix}/SET_CLIENTS_FETCHING`;
export const SET_SORT_PAGE = `${prefix}/SET_SORT_PAGE`;

export const SET_EXPANDED_CLIENT_ROW_KEY = `${prefix}/SET_EXPANDED_CLIENT_ROW_KEY`;


/**
 * Reducer
 * */

const ReducerState = {
    clients: [],
    clientsFetching: false,
    clientOrdersFetching: false,
    expandedClientRow: '', //Row in clients table which is expanded, clientId is used to generate key
    clientOrdersData: {
        orders: [],
        stats: {},
    }, 
    stats: {
        countCliens: undefined,
    },
    filters: {
        query: undefined,
    },
    sort: {
        page: 1
    }
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {

        case FETCH_CLIENTS_SUCCESS:
            const {clients, stats} = payload;
            return {
                ...state,
                clients: clients,
                stats: stats
            };

        case SET_FILTERS_SEARCH_QUERY:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    query: payload
                }
            };

        case SET_CLIENTS_FETCHING:
            return {
                ...state,
                clientsFetching: payload
            };

        case SET_CLIENT_ORDERS_FETCHING:
            return {
                ...state,
                clientOrdersFetching: payload
            };

        case SET_SORT_PAGE:
            return {
                ...state,
                sort: {
                    ...state.sort,
                    page: payload
                }
            };

        case SET_EXPANDED_CLIENT_ROW_KEY:
            return {
                ...state,
                expandedClientRow: payload
            };

        case FETCH_CLIENT_ORDERS_SUCCESS:
            const {orders, stats: ordersStats} = payload;
            return {
                ...state,
                clientOrdersData: {
                    ...state.clientOrdersData,
                    orders: orders,
                    stats: ordersStats
                }
            };

        default:
            return state;
    }
}

//Selectors
export const selectFilters = state => state[moduleName].filters;
export const selectSort = state => state[moduleName].sort;

//Actions:
export const fetchClients = () => ({
    type: FETCH_CLIENTS
});

export const fetchClientsSuccess = ({clients, stats}) => ({
    type: FETCH_CLIENTS_SUCCESS,
    payload: {clients, stats}
});

export const fetchClientOrders = ({clientId}) => ({
    type: FETCH_CLIENT_ORDERS,
    payload: {clientId}
});

export const fetchClientOrdersSuccess = ({orders, stats}) => ({
    type: FETCH_CLIENT_ORDERS_SUCCESS,
    payload: {orders, stats}
});

/**
 * Create new order(н/з)  which will contain specific client.
 * New client will be fetched by id , is is used to pass differences in data from different routes
 * @param {*} param0 {
 *      clientId - id of a client,
 *      managerId - id of a manager who created an order(current user)
 *      }
 */
export const createOrderForClient = ({clientId, managerId}) => ({
    type: CREATE_ORDER_FOR_CLIENT,
    payload: {clientId, managerId}
});

export const setFiltersSearchQuery = (query) => {
    return function(dispatch) {
        dispatch({
            type: SET_FILTERS_SEARCH_QUERY,
            payload: query
        });

        return dispatch(fetchClients());
    }
};

export const setSortPage = (page) => {
    return function(dispatch) {
        dispatch({
            type: SET_SORT_PAGE,
            payload: page
        });

        return dispatch(fetchClients());
    }
};

export const setClientsFetching = (clientsFetching) => ({
    type: SET_CLIENTS_FETCHING,
    payload: clientsFetching
});

export const setClientOrdersFetching = (clientOrdersFetching) => ({
    type: SET_CLIENT_ORDERS_FETCHING,
    payload: clientOrdersFetching
});

export const setClientRowKey = (rowKey) => ({
    type: SET_EXPANDED_CLIENT_ROW_KEY,
    payload: rowKey
});