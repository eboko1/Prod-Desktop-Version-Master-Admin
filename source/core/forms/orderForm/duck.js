import _ from 'lodash';
import { v4 } from 'uuid';
import moment from 'moment';
/**
 * Constants
 * */
export const moduleName = 'orderForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_ORDER_FORM = `${prefix}/FETCH_ORDER_FORM`;
export const FETCH_ORDER_FORM_SUCCESS = `${prefix}/FETCH_ORDER_FORM_SUCCESS`;

export const ON_CHANGE_ORDER_FORM = `${prefix}/ON_CHANGE_ORDER_FORM`;
export const ON_CHANGE_CLIENT_SEARCH_QUERY = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY`;

// TODO ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST mv to ui (spin load state in table)
export const ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST`;
export const ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS`;

export const ON_CLIENT_SELECT = `${prefix}/ON_CLIENT_SELECT`;

export const ON_SERVICE_SEARCH = `${prefix}/ON_SERVICE_SEARCH`;
export const ON_HANDLE_CUSTOM_SERVICE = `${prefix}/ON_HANDLE_CUSTOM_SERVICE`;

export const ON_CHANGE_ORDER_SERVICES = `${prefix}/ON_CHANGE_ORDER_SERVICES`;

export const SUBMIT_ORDER_FORM = `${prefix}/SUBMIT_ORDER_FORM`;
export const SUBMIT_ORDER_FORM_SUCCESS = `${prefix}/SUBMIT_ORDER_FORM_SUCCESS`;

/**
 * Reducer
 * */

const defaultFieldValue = name => ({
    errors:     void 0,
    name:       name,
    touched:    true,
    validating: false,
    value:      void 0,
    dirty:      false,
});

const customFieldValue = (name, value) => ({
    errors:     void 0,
    name:       name,
    touched:    true,
    validating: false,
    value:      value,
    dirty:      false,
});

const ReducerState = {
    fields: {
        beginDatetime:     defaultFieldValue('beginDatetime'),
        status:            defaultFieldValue('status'),
        date:              defaultFieldValue('date'),
        station:           defaultFieldValue('station'),
        manager:           defaultFieldValue('manager'),
        searchClientQuery: defaultFieldValue('searchClientQuery'),
        clientPhone:       defaultFieldValue('clientPhone'),
        clientEmail:       defaultFieldValue('clientEmail'),
        clientVehicle:     defaultFieldValue('clientVehicle'),
        clientRequisite:   defaultFieldValue('clientRequisite'),
        services:          {
            [ v4() ]: {
                serviceName:  defaultFieldValue('serviceName'),
                serviceCount: defaultFieldValue('serviceCount'),
                servicePrice: defaultFieldValue('servicePrice'),
            },
        },
    },
    allServices:         [],
    clients:             [],
    managers:            [],
    employees:           [],
    vehicles:            [],
    stations:            [],
    allDetails:          {},
    requisites:          [],
    searchClientsResult: {
        searching: true,
        clients:   [],
    },
    selectedClient: {
        requisites: [],
        phones:     [],
        emails:     [],
        vehicles:   [],
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload, meta } = action;

    switch (type) {
        case FETCH_ORDER_FORM_SUCCESS:
            return {
                ...state,
                ...payload,
                fields: {
                    ...state.fields,
                    clientPhone: customFieldValue(
                        'clientPhone',
                        payload.order.clientPhone,
                    ),
                    clientEmail: customFieldValue(
                        'clientEmail',
                        payload.order.clientEmail,
                    ),
                    clientVehicle: customFieldValue(
                        'clientVehicle',
                        payload.order.clientVehicleId,
                    ),
                    station: customFieldValue(
                        'station',
                        payload.order.stationNum,
                    ),
                    manager: customFieldValue(
                        'manager',
                        payload.order.managerId,
                    ),
                    beginDatetime: customFieldValue(
                        'beginDatetime',
                        moment(payload.order.beginDatetime),
                    ),
                },
                selectedClient: payload.client || state.selectedClient,
            };

        case ON_CHANGE_ORDER_FORM:
            // console.group('→ REDUX');
            // console.log('@@payload', payload);
            // console.log('@@ meta field', meta.field);
            // console.log('@@ return', {
            //     ...state,
            //     fields: {
            //         [ meta.field ]: { ...payload[ meta.field ] },
            //     },
            // });
            // console.groupEnd();

            return {
                ...state,
                fields: {
                    ...state.fields,
                    [ meta.field ]: { ...payload[ meta.field ] },
                    services:       {
                        // if merge with empty object old state stayed
                        ..._.merge(
                            state.fields.services,
                            payload.services || {},
                        ),
                    },
                },
            };

        case ON_CHANGE_ORDER_SERVICES:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    services: payload,
                },
            };

        case SUBMIT_ORDER_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case ON_HANDLE_CUSTOM_SERVICE:
            return {
                ...state,
                allServices: [
                    ...state.allServices,
                    {
                        id:           v4(),
                        servicePrice: null,
                        serviceHours: null,
                        description:  '',
                        serviceName:  payload,
                        serviceId:    v4(),
                        type:         'custom',
                    },
                ],
            };

        case ON_CLIENT_SELECT:
            return {
                ...state,
                selectedClient:      payload,
                searchClientsResult: {
                    clients:   [],
                    searching: true,
                },
                fields: {
                    ...state.fields,
                    // clearing provided fields with default values
                    ..._.pick(ReducerState.fields, [ 'clientPhone', 'clientEmail', 'clientVehicle', 'searchClientQuery' ]),
                },
            };
        // TODO think about spinners
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
                    clients:   payload.clients,
                    searching: false,
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
// export const ordersSelector = createSelector(stateSelector, state => {
//     // console.log('ordersSelector', state.orders);
//
//     // return state.orders.valueSeq().toArray();
//     return state.data.orders;
// });

/**
 * Action Creators
 * */

export const fetchOrderForm = id => ({
    type:    FETCH_ORDER_FORM,
    payload: id,
});

export function fetchOrderFormSuccess(data) {
    return {
        type:    FETCH_ORDER_FORM_SUCCESS,
        payload: data,
    };
}

export const onHandleCustomService = searchService => ({
    type:    ON_HANDLE_CUSTOM_SERVICE,
    payload: searchService,
});

export const onChangeClientSearchQuery = searchQuery => ({
    type:    ON_CHANGE_CLIENT_SEARCH_QUERY,
    payload: searchQuery,
});

export const setClientSelection = client => ({
    type:    ON_CLIENT_SELECT,
    payload: client,
});

export const onChangeOrderServices = data => ({
    type:    ON_CHANGE_ORDER_SERVICES,
    payload: data,
});

export const onChangeClientSearchQuerySuccess = data => ({
    type:    ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS,
    payload: data,
});

export const onChangeClientSearchQueryRequest = () => ({
    type: ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST,
});

export const onChangeOrderForm = (fields, { form, field }) => ({
    type:    ON_CHANGE_ORDER_FORM,
    payload: fields,
    meta:    { form, field },
});

export const submitOrderForm = addOrderForm => ({
    type:    SUBMIT_ORDER_FORM,
    payload: addOrderForm,
});

export const submitOrderFormSuccess = () => ({
    type: SUBMIT_ORDER_FORM_SUCCESS,
});

export const onServiceSearch = search => ({
    type:    ON_SERVICE_SEARCH,
    payload: search,
});
