/**
 * Constants
 * */
export const moduleName = 'clientOrders';
const prefix = `cpb/${moduleName}`;

export const FETCH_CLIENT_ORDERS = `${prefix}/FETCH_CLIENT_ORDERS`;
export const FETCH_CLIENT_ORDERS_SUCCESS = `${prefix}/FETCH_CLIENT_ORDERS_SUCCESS`;
export const SET_CLIENT_ORDERS_PAGE_FILTER = `${prefix}/SET_CLIENT_ORDERS_PAGE_FILTER`;

/**
 * Reducer
 * */

const ReducerState = {
    ordersData: {},
    filter:     {
        page: 1,
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CLIENT_ORDERS_SUCCESS:
            return {
                ...state,
                ordersData: payload,
            };

        case SET_CLIENT_ORDERS_PAGE_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page: payload,
                },
            };

        default:
            return state;
    }
}


export const fetchClientOrders = ({ clientId, filter}) => ({
    type:    FETCH_CLIENT_ORDERS,
    payload: { clientId, filter },
});

export const fetchClientOrdersSuccess = clientOrdersData => ({
    type:    FETCH_CLIENT_ORDERS_SUCCESS,
    payload: clientOrdersData,
});

// Filter
export const setClientOrdersPageFilter = pageFilter => ({
    type:    SET_CLIENT_ORDERS_PAGE_FILTER,
    payload: pageFilter,
});
