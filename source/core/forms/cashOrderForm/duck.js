import _ from 'lodash';
/**
 * Constants
 * */
export const moduleName = 'cashOrderForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_CASH_ORDER_NEXT_ID = `${prefix}/FETCH_CASH_ORDER_NEXT_ID`;
export const FETCH_CASH_ORDER_NEXT_ID_SUCCESS = `${prefix}/FETCH_CASH_ORDER_NEXT_ID_SUCCESS`;

export const FETCH_CASH_ORDER = `${prefix}/FETCH_CASH_ORDER`;
export const FETCH_CASH_ORDER_SUCCESS = `${prefix}/FETCH_CASH_ORDER_SUCCESS`;

export const FETCH_CASH_ORDER_FORM = `${prefix}/FETCH_CASH_ORDER_FORM`;
export const FETCH_CASH_ORDER_FORM_SUCCESS = `${prefix}/FETCH_CASH_ORDER_FORM_SUCCESS`;

export const FETCH_SELECTED_CLIENT_ORDERS = `${prefix}/FETCH_SELECTED_CLIENT_ORDERS`;
export const FETCH_SELECTED_CLIENT_ORDERS_SUCCESS = `${prefix}/FETCH_SELECTED_CLIENT_ORDERS_SUCCESS`;

export const SET_SELECTED_CLIENT_ORDERS_FILTERS = `${prefix}/SET_SELECTED_CLIENT_ORDERS_FILTERS`;

export const CREATE_CASH_ORDER = `${prefix}/CREATE_CASH_ORDER`;
export const CREATE_CASH_ORDER_SUCCESS = `${prefix}/CREATE_CASH_ORDER`;

export const EDIT_CASH_ORDER = `${prefix}/EDIT_CASH_ORDER`;
export const EDIT_CASH_ORDER_SUCCESS = `${prefix}/EDIT_CASH_ORDER_SUCCESS`;

export const PRINT_CASH_ORDER = `${prefix}/PRINT_CASH_ORDER`;
export const PRINT_CASH_ORDER_SUCCESS = `${prefix}/PRINT_CASH_ORDER_SUCCESS`;

export const ON_CHANGE_CASH_ORDER_FORM = `${prefix}/ON_CHANGE_CASH_ORDER_FORM`;
export const CLEAR_CASH_ORDER_FORM = `${prefix}/CLEAR_CASH_ORDER_FILTER_FORM`;

export const ON_CHANGE_CLIENT_SEARCH_QUERY = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY`;
export const ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST`;
export const ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS`;

export const ON_CLIENT_SELECT = `${prefix}/ON_CLIENT_SELECT`;
export const ON_CLIENT_SELECT_SUCCESS = `${prefix}/ON_CLIENT_SELECT_SUCCESS`;

export const ON_ORDER_SELECT = `${prefix}/ON_ORDER_SELECT`;

export const ON_ORDER_SEARCH = `${prefix}/ON_ORDER_SEARCH`;
export const ON_ORDER_SEARCH_SUCCESS = `${prefix}/ON_ORDER_SEARCH_SUCCESS`;

function duplicate(clients) {
    return _.flatten(
        _.map(clients, client => {
            const { vehicles } = client;
            const hasVehicles = _.isArray(vehicles) && vehicles.length;
            if (!hasVehicles) {
                return client;
            }

            return vehicles.map((vehicle, index) => {
                const duplicatedVehicles = _.cloneDeep(vehicles);
                duplicatedVehicles.splice(index, 1);

                return {
                    ...client,
                    vehicles: [ vehicles[ index ], ...duplicatedVehicles ],
                };
            });
        }),
    );
}

/**
 * Reducer
 * */

const ReducerState = {
    fields:              {},
    searchClientsResult: {
        searching: true,
        clients:   [],
    },
    counterpartyList: [],
    selectedClient:   {
        clientOrders: {},
        filters:      {
            page: 1,
        },
    },
    selectedOrder: {},
};
/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_CASH_ORDER_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case FETCH_CASH_ORDER_NEXT_ID_SUCCESS:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case FETCH_CASH_ORDER_FORM_SUCCESS:
            return {
                ...state,
                counterpartyList: [ ...payload ],
            };

        case EDIT_CASH_ORDER_SUCCESS:
        case CREATE_CASH_ORDER_SUCCESS:
            return {
                ...state,
                fields: {},
            };

        case CLEAR_CASH_ORDER_FORM:
            return ReducerState;

        case ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST:
            return {
                ...state,
                searchClientsResult: {
                    clients:   [],
                    searching: true,
                },
            };

        case ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS:
            return {
                ...state,
                searchClientsResult: {
                    clients:   duplicate(payload.clients),
                    searching: false,
                },
            };

        case ON_CLIENT_SELECT:
            return {
                ...state,
                selectedClient: {
                    ...state.selectedClient,
                    ...payload,
                },
                searchClientsResult: {
                    clients:   [],
                    searching: false,
                },
                fields: {
                    ..._.omit(state.fields, [
                        'clientPhone',
                        'clientEmail',
                        'clientVehicle',
                        'searchClientQuery',
                        'clientRequisite',
                    ]),
                },
            };

        case ON_CLIENT_SELECT_SUCCESS:
            return {
                ...state,
                selectedClient: {
                    ...state.selectedClient,
                    clientOrders: payload,
                },
            };

        case ON_ORDER_SELECT:
            return {
                ...state,
                selectedOrder: payload,
            };

        case SET_SELECTED_CLIENT_ORDERS_FILTERS:
            return {
                ...state,
                selectedClient: {
                    ...state.selectedClient,
                    filters: {
                        ...state.selectedClient.filters,
                        ...payload,
                    },
                },
            };

        case FETCH_SELECTED_CLIENT_ORDERS_SUCCESS:
            return {
                ...state,
                selectedClient: {
                    ...state.selectedClient,
                    ...payload,
                },
            };

        case ON_ORDER_SEARCH_SUCCESS:
            return {
                ...state,
                selectedOrder: payload,
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state.forms[ moduleName ];

export const selectCounterpartyList = state =>
    state.forms.cashOrderForm.counterpartyList;

export const selectClientOrders = state =>
    state.forms.cashOrderForm.selectedClient.clientOrders;

export const selectClientOrdersFilters = state =>
    state.forms.cashOrderForm.selectedClient.filters;

export const selectClient = state => state.forms.cashOrderForm.selectedClient;

export const selectOrder = state => state.forms.cashOrderForm.selectedOrder;

/**
 * Action Creators
 * */

export const fetchCashOrderNextId = () => ({
    type: FETCH_CASH_ORDER_NEXT_ID,
});

export const fetchCashOrder = () => ({
    type: FETCH_CASH_ORDER,
});

export const fetchCashOrderSuccess = cashOrder => ({
    type:    FETCH_CASH_ORDER_SUCCESS,
    payload: cashOrder,
});

export const fetchCashOrderNextIdSuccess = orderId => ({
    type:    FETCH_CASH_ORDER_NEXT_ID_SUCCESS,
    payload: orderId,
});

export const fetchCashOrderForm = endpoint => ({
    type:    FETCH_CASH_ORDER_FORM,
    payload: endpoint,
});

export const fetchCashOrderFormSuccess = data => ({
    type:    FETCH_CASH_ORDER_FORM_SUCCESS,
    payload: data,
});

export const createCashOrder = payload => ({
    type: CREATE_CASH_ORDER,
    payload,
});

export const createCashOrderSuccess = () => ({
    type: CREATE_CASH_ORDER_SUCCESS,
});

export const editCashOrder = id => ({
    type:    EDIT_CASH_ORDER,
    payload: id,
});

export const editCashOrderSuccess = () => ({
    type: EDIT_CASH_ORDER_SUCCESS,
});

export const onChangeCashOrderForm = (fields, { form, field }) => ({
    type:    ON_CHANGE_CASH_ORDER_FORM,
    payload: fields,
    meta:    { form, field },
});

export const clearCashOrderForm = () => ({
    type: CLEAR_CASH_ORDER_FORM,
});

export const onClientSelect = client => ({
    type:    ON_CLIENT_SELECT,
    payload: client,
});

export const onOrderSelect = orderId => ({
    type:    ON_ORDER_SELECT,
    payload: orderId,
});

export const onClientSelectSuccess = clientOrders => ({
    type:    ON_CLIENT_SELECT_SUCCESS,
    payload: clientOrders,
});

export const onChangeClientSearchQuery = searchQuery => ({
    type:    ON_CHANGE_CLIENT_SEARCH_QUERY,
    payload: searchQuery,
});

export const onChangeClientSearchQueryRequest = () => ({
    type: ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST,
});

export const onChangeClientSearchQuerySuccess = data => ({
    type:    ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS,
    payload: data,
});

export const fetchSelectedClientOrders = () => ({
    type: FETCH_SELECTED_CLIENT_ORDERS,
});

export const fetchSelectedClientOrdersSuccess = clientOrders => ({
    type:    FETCH_SELECTED_CLIENT_ORDERS_SUCCESS,
    payload: clientOrders,
});

export const setSelectedClientOrdersFilters = filters => ({
    type:    SET_SELECTED_CLIENT_ORDERS_FILTERS,
    payload: filters,
});

// Search by Order
export const onOrderSearch = orderSearch => ({
    type:    ON_ORDER_SEARCH,
    payload: orderSearch,
});

export const onOrderSearchSuccess = order => ({
    type:    ON_ORDER_SEARCH_SUCCESS,
    payload: order,
});

// Print cash order
export const printCashOrder = id => ({
    type:    PRINT_CASH_ORDER,
    payload: id,
});

export const printCashOrderSuccess = () => ({
    type: PRINT_CASH_ORDER_SUCCESS,
});
