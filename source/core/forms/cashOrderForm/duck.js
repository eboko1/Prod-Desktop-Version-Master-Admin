import _ from 'lodash';
/**
 * Constants
 * */
export const moduleName = 'cashOrderForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_CASH_ORDER_NEXT_ID = `${prefix}/FETCH_CASH_ORDER_NEXT_ID`;
export const FETCH_CASH_ORDER_NEXT_ID_SUCCESS = `${prefix}/FETCH_CASH_ORDER_NEXT_ID_SUCCESS`;

export const FETCH_CASH_ORDER_FORM = `${prefix}/FETCH_CASH_ORDER_FORM`;
export const FETCH_CASH_ORDER_FORM_SUCCESS = `${prefix}/FETCH_CASH_ORDER_FORM_SUCCESS`;

export const CREATE_CASH_ORDER = `${prefix}/CREATE_CASH_ORDER`;
export const CREATE_CASH_ORDER_SUCCESS = `${prefix}/CREATE_CASH_ORDER`;

export const ON_CHANGE_CASH_ORDER_FORM = `${prefix}/ON_CHANGE_CASH_ORDER_FORM`;
export const CLEAR_CASH_ORDER_FORM = `${prefix}/CLEAR_CASH_ORDER_FILTER_FORM`;

export const ON_CHANGE_CLIENT_SEARCH_QUERY = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY`;
export const ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST`;
export const ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS`;

export const ON_CLIENT_SELECT = `${prefix}/ON_CLIENT_SELECT`;

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
};

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

        case CREATE_CASH_ORDER_SUCCESS:
            return {
                ...state,
                fields: {},
            };

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
                selectedClient:      payload,
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

/**
 * Action Creators
 * */

export const fetchCashOrderNextId = () => ({
    type: FETCH_CASH_ORDER_NEXT_ID,
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

export const onChangeCashOrderForm = (fields, { form, field }) => ({
    type:    ON_CHANGE_CASH_ORDER_FORM,
    payload: fields,
    meta:    { form, field },
});

export const clearCashOrderForm = () => ({
    type: CLEAR_CASH_ORDER_FORM,
});

export const setClientSelection = client => ({
    type:    ON_CLIENT_SELECT,
    payload: client,
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
