// vendor
import { createSelector } from 'reselect';
import { v4 } from 'uuid';
import _ from 'lodash';
import moment from 'moment';

/**
 * Constants
 * */
export const moduleName = 'orderForm';
const prefix = `cpb/${moduleName}`;

export const SET_CREATE_STATUS = `${prefix}/SET_CREATE_STATUS`;

export const CREATE_ORDER = `${prefix}/CREATE_ORDER`;
export const CREATE_ORDER_SUCCESS = `${prefix}/CREATE_ORDER_SUCCESS`;

export const UPDATE_ORDER = `${prefix}/UPDATE_ORDER`;
export const UPDATE_ORDER_SUCCESS = `${prefix}/UPDATE_ORDER_SUCCESS`;

export const FETCH_ADD_ORDER_FORM = `${prefix}/FETCH_ADD_ORDER_FORM`;
export const FETCH_ADD_ORDER_FORM_SUCCESS = `${prefix}/FETCH_ADD_ORDER_FORM_SUCCESS`;

export const FETCH_ORDER_FORM = `${prefix}/FETCH_ORDER_FORM`;
export const FETCH_ORDER_FORM_SUCCESS = `${prefix}/FETCH_ORDER_FORM_SUCCESS`;

export const ON_CHANGE_ORDER_FORM = `${prefix}/ON_CHANGE_ORDER_FORM`;
export const ON_CHANGE_CLIENT_SEARCH_QUERY = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY`;

// TODO ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST mv to ui (spin load state in table)
export const ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST`;
export const ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS`;

export const ON_CLIENT_SELECT = `${prefix}/ON_CLIENT_SELECT`;

export const SUBMIT_ORDER_FORM = `${prefix}/SUBMIT_ORDER_FORM`;
export const SUBMIT_ORDER_FORM_SUCCESS = `${prefix}/SUBMIT_ORDER_FORM_SUCCESS`;

export const RETURN_TO_ORDERS_PAGE = `${prefix}/RETURN_TO_ORDERS_PAGE`;

export const CREATE_INVITE_ORDER = `${prefix}/CREATE_INVITE_ORDER`;
export const CREATE_INVITE_ORDER_SUCCESS = `${prefix}/CREATE_INVITE_ORDER_SUCCESS`;

export const CREATE_ORDER_COPY = `${prefix}/CREATE_ORDER_COPY`;
export const CREATE_ORDER_COPY_SUCCESS = `${prefix}/CREATE_ORDER_COPY_SUCCESS`;

export const FETCH_ORDER_TASK = `${prefix}/FETCH_ORDER_TASK`;
export const FETCH_ORDER_TASK_SUCCESS = `${prefix}/FETCH_ORDER_TASK_SUCCESS`;

export const FETCH_AVAILABLE_HOURS = `${prefix}/FETCH_AVAILABLE_HOURS`;
export const FETCH_AVAILABLE_HOURS_SUCCESS = `${prefix}/FETCH_AVAILABLE_HOURS_SUCCESS`;

export const FETCH_TECDOC_SUGGESTIONS = `${prefix}/FETCH_TECDOC_SUGGESTIONS`;
export const FETCH_TECDOC_SUGGESTIONS_SUCCESS = `${prefix}/FETCH_TECDOC_SUGGESTIONS_SUCCESS`;
export const CLEAR_TECDOC_SUGGESTIONS = `${prefix}/CLEAR_SUGGESTIONS`;

export const FETCH_TECDOC_DETAILS_SUGGESTIONS = `${prefix}/FETCH_TECDOC_DETAILS_SUGGESTIONS`;
export const FETCH_TECDOC_DETAILS_SUGGESTIONS_SUCCESS = `${prefix}/FETCH_TECDOC_DETAILS_SUGGESTIONS_SUCCESS`;
export const CLEAR_TECDOC_DETAILS_SUGGESTIONS = `${prefix}/CLEAR_TECDOC_DETAILS_SUGGESTIONS`;
/**
 * Reducer
 * */

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

const createDefaultState = () => ({
    fields: {
        services:     [],
        details:      [],
        stationLoads: [],
    },
    createStatus:      'not_complete',
    managers:          [],
    employees:         [],
    stations:          [],
    businessLocations: [],
    orderServices:     [],
    orderDetails:      [],
    orderTasks:        [],
    orderStationLoads: [],
    history:           {
        count:  0,
        orders: [],
        stats:  {},
    },
    calls:      [],
    tasks:      [],
    requisites:          [],
    searchClientsResult: {
        searching: true,
        clients:   [],
    },
    order:                     {},
    invited:                   false,
    suggestions:               [],
    suggestionsHistory:        [],
    detailsSuggestions:        [],
    detailsSuggestionsHistory: [],
});

const ReducerState = createDefaultState();

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;
    /* eslint-disable */
    switch (type) {
        case FETCH_ORDER_FORM_SUCCESS:
            return {
                ...state,
                ...payload,
                fetchedOrder: payload,
            };

        case SET_CREATE_STATUS:
            return {
                ...state,
                createStatus: payload,
            };

        case CREATE_INVITE_ORDER:
            return {
                ...state,
                invited: true,
            };

        case FETCH_ADD_ORDER_FORM_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        case ON_CHANGE_ORDER_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case FETCH_ORDER_FORM:
            return { ...createDefaultState() };

        case FETCH_ADD_ORDER_FORM:
            return { ...createDefaultState() };

        case SUBMIT_ORDER_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case ON_CLIENT_SELECT:
            return {
                ...state,
                searchClientsResult: {
                    clients: [],
                    searching: false,
                },
                fields: {
                    ..._.omit(state.fields, [
                        "clientPhone",
                        "clientEmail",
                        "clientVehicle",
                        "searchClientQuery",
                        "clientRequisite",
                    ]),
                },
            };
        // TODO think about loader state for client search table
        case ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST:
            return {
                ...state,
                searchClientsResult: {
                    clients: [],
                    searching: true,
                },
            };

        case ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS:
            return {
                ...state,
                searchClientsResult: {
                    clients: duplicate(payload.clients),
                    searching: false,
                },
            };

        case FETCH_ORDER_TASK_SUCCESS:
            return {
                ...state,
                orderTasks: payload,
            };

        case FETCH_AVAILABLE_HOURS_SUCCESS:
            return {
                ...state,
                availableHours: {
                    ...state.availableHours,
                    [payload.key]: payload.availableHours,
                },
            };

        case FETCH_TECDOC_SUGGESTIONS_SUCCESS:
            const suggestionsWithId = payload.map(suggestion => ({
                id: v4(),
                ...suggestion,
            }));

            return {
                ...state,
                suggestions: [...state.suggestions, ...suggestionsWithId],
                suggestionsHistory: [
                    ...state.suggestions,
                    ...suggestionsWithId,
                ],
            };

        case CLEAR_TECDOC_SUGGESTIONS:
            return {
                ...state,
                suggestions: [],
            };

        case FETCH_TECDOC_DETAILS_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                detailsSuggestions: [
                    ...state.detailsSuggestions,
                    { key: payload.key, suggestions: payload.suggestions },
                ],
                detailsSuggestionsHistory: [
                    ...state.detailsSuggestions,
                    { key: payload.key, suggestions: payload.suggestions },
                ],
            };

        case CLEAR_TECDOC_DETAILS_SUGGESTIONS:
            return {
                ...state,
                detailsSuggestions: [],
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const orderSelector = state => state.forms[moduleName].order;
export const moduleSelector = state => state.forms[moduleName];

export const selectInviteData = createSelector(orderSelector, order => {
    const hasInviteStatus = ["success", "cancel"].includes(order.status);

    const isInviteVisible =
        !order.inviteOrderId && order.id && order.status && hasInviteStatus;

    const isInviteEnabled =
        hasInviteStatus &&
        order.id &&
        order.status &&
        order.clientVehicleId &&
        order.clientId &&
        order.clientPhone &&
        !order.invited;

    return { hasInviteStatus, isInviteVisible, isInviteEnabled };
});

export const selectCashSum = createSelector(
    moduleSelector,
    ({ cashOrders }) => {
        if (cashOrders && cashOrders.length) {
            const increase = cashOrders.reduce(
                (accumulator, { increase }) => accumulator + increase,
                0,
            );

            const decrease = cashOrders.reduce(
                (accumulator, { decrease }) => accumulator + decrease,
                0,
            );

            return Math.round(increase*100)/100 - Math.round(decrease*100)/100;
        }
        return 0;
    },
);

//export const remainSum = createSelector(
//    moduleSelector, {()
//)

export const selectCashFlowFilters = createSelector(
    moduleSelector,
    ({ cashOrders }) => {
        if (!_.isEmpty(cashOrders)) {
            const startDate = moment(
                _.get(_.first(cashOrders), "datetime"),
            ).format("YYYY-MM-DD");
            const endDate = moment(
                _.get(_.last(cashOrders), "datetime"),
            ).format("YYYY-MM-DD");
            return {
                query: _.get(_.first(cashOrders), "orderId"),
                startDate: startDate,
                endDate: endDate || startDate,
            };
        }
        return null;
    },
);

/**
 * Action Creators
 * */

export const fetchOrderForm = id => ({
    type: FETCH_ORDER_FORM,
    payload: id,
});

export const fetchOrderFormSuccess = data => ({
    type: FETCH_ORDER_FORM_SUCCESS,
    payload: data,
});

export const fetchAddOrderForm = () => ({
    type: FETCH_ADD_ORDER_FORM,
});

export const fetchAddOrderFormSuccess = data => ({
    type: FETCH_ADD_ORDER_FORM_SUCCESS,
    payload: data,
});

export const fetchOrderTask = id => ({
    type: FETCH_ORDER_TASK,
    payload: id,
});

export const fetchOrderTaskSuccess = data => ({
    type: FETCH_ORDER_TASK_SUCCESS,
    payload: data,
});

export const onChangeClientSearchQuery = searchQuery => ({
    type: ON_CHANGE_CLIENT_SEARCH_QUERY,
    payload: searchQuery,
});

export const setClientSelection = client => ({
    type: ON_CLIENT_SELECT,
    payload: client,
});

export const onChangeClientSearchQuerySuccess = data => ({
    type: ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS,
    payload: data,
});

export const onChangeClientSearchQueryRequest = () => ({
    type: ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST,
});

export const onChangeOrderForm = (fields, { form, field }) => ({
    type: ON_CHANGE_ORDER_FORM,
    payload: fields,
    meta: { form, field },
});

export const createOrder = entity => ({
    type: CREATE_ORDER,
    payload: entity,
});

export const createOrderSuccess = () => ({
    type: CREATE_ORDER_SUCCESS,
});

export const updateOrder = entity => ({
    type: UPDATE_ORDER,
    payload: entity,
});

export const updateOrderSuccess = () => ({
    type: UPDATE_ORDER_SUCCESS,
});

export const setCreateStatus = status => ({
    type: SET_CREATE_STATUS,
    payload: status,
});

export const submitOrderForm = orderForm => ({
    type: SUBMIT_ORDER_FORM,
    payload: orderForm,
});

export const submitOrderFormSuccess = () => ({
    type: SUBMIT_ORDER_FORM_SUCCESS,
});

export const returnToOrdersPage = status => ({
    type: RETURN_TO_ORDERS_PAGE,
    payload: status,
});

export const createInviteOrder = inviteOrder => ({
    type: CREATE_INVITE_ORDER,
    payload: inviteOrder,
});

export const createInviteOrderSuccess = response => ({
    type: CREATE_INVITE_ORDER_SUCCESS,
    payload: response,
});

export const createOrderCopy = order => ({
    type: CREATE_ORDER_COPY,
    payload: order,
});

export const createOrderCopySuccess = response => ({
    type: CREATE_ORDER_COPY_SUCCESS,
    payload: response,
});

export const fetchAvailableHours = (station, date, orderId, key) => ({
    type: FETCH_AVAILABLE_HOURS,
    payload: { station, date, orderId, key },
});

export const fetchAvailableHoursSuccess = (availableHours, key) => ({
    type: FETCH_AVAILABLE_HOURS_SUCCESS,
    payload: { availableHours, key },
});

export const fetchTecdocSuggestions = (modificationId, serviceId) => ({
    type: FETCH_TECDOC_SUGGESTIONS,
    payload: { modificationId, serviceId },
});

export const fetchTecdocSuggestionsSuccess = suggestions => ({
    type: FETCH_TECDOC_SUGGESTIONS_SUCCESS,
    payload: suggestions,
});

export const clearTecdocSuggestions = () => ({
    type: CLEAR_TECDOC_SUGGESTIONS,
});

export const fetchTecdocDetailsSuggestions = (
    modificationId,
    productId,
    key,
) => ({
    type: FETCH_TECDOC_DETAILS_SUGGESTIONS,
    payload: { modificationId, productId, key },
});

export const fetchTecdocDetailsSuggestionsSuccess = (suggestions, key) => ({
    type: FETCH_TECDOC_DETAILS_SUGGESTIONS_SUCCESS,
    payload: { suggestions, key },
});

export const clearTecdocDetailsSuggestions = () => ({
    type: CLEAR_TECDOC_DETAILS_SUGGESTIONS,
});
