// vendor
import { createSelector } from 'reselect';
import _ from 'lodash';
import { v4 } from 'uuid';
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

export const PREFILL_FROM_DASHBOARD = `${prefix}/PREFILL_FROM_DASHBOARD`;

// TODO ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST mv to ui (spin load state in table)
export const ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST`;
export const ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS`;

export const ON_CLIENT_SELECT = `${prefix}/ON_CLIENT_SELECT`;

export const SUBMIT_ORDER_FORM = `${prefix}/SUBMIT_ORDER_FORM`;
export const SUBMIT_ORDER_FORM_SUCCESS = `${prefix}/SUBMIT_ORDER_FORM_SUCCESS`;

export const RETURN_TO_ORDERS_PAGE = `${prefix}/RETURN_TO_ORDERS_PAGE`;

export const CREATE_INVITE_ORDER = `${prefix}/CREATE_INVITE_ORDER`;
export const CREATE_INVITE_ORDER_SUCCESS = `${prefix}/CREATE_INVITE_ORDER_SUCCESS`;

export const FETCH_ORDER_TASK = `${prefix}/FETCH_ORDER_TASK`;
export const FETCH_ORDER_TASK_SUCCESS = `${prefix}/FETCH_ORDER_TASK_SUCCESS`;

export const FETCH_AVAILABLE_HOURS = `${prefix}/FETCH_AVAILABLE_HOURS`;
export const FETCH_AVAILABLE_HOURS_SUCCESS = `${prefix}/FETCH_AVAILABLE_HOURS_SUCCESS`;

import { customFieldValue, defaultFieldValue } from './helpers/utils';

import { convertFieldsValuesToDbEntity } from './../../../pages/AddOrderPage/extractOrderEntity';

/**
 * Reducer
 * */

const createDefaultState = () => ({
    fields: {
        beginDate:         defaultFieldValue('beginDate'),
        beginTime:         defaultFieldValue('beginTime'),
        status:            defaultFieldValue('status'),
        date:              defaultFieldValue('date'),
        station:           defaultFieldValue('station'),
        manager:           defaultFieldValue('manager'),
        employee:          defaultFieldValue('employee'),
        searchClientQuery: defaultFieldValue('searchClientQuery'),
        clientPhone:       defaultFieldValue('clientPhone'),
        clientEmail:       defaultFieldValue('clientEmail'),
        clientVehicle:     defaultFieldValue('clientVehicle'),
        clientRequisite:   defaultFieldValue('clientRequisite'),
        requisite:         defaultFieldValue('requisite'),
        paymentMethod:     defaultFieldValue('paymentMethod'),
        odometerValue:     defaultFieldValue('odometerValue'),
        vehicleCondition:  defaultFieldValue('vehicleCondition'),
        businessComment:   defaultFieldValue('businessComment'),
        comment:           defaultFieldValue('comment'),
        createOrderStatus: customFieldValue(
            'createOrderStatus',
            'not_complete',
        ),
        servicesDiscount: customFieldValue('servicesDiscount', 0),
        detailsDiscount:  customFieldValue('detailsDiscount', 0),
    },
    createStatus:    'not_complete',
    allServices:     [],
    managers:        [],
    employees:       [],
    filteredDetails: [],
    stations:        [],
    orderServices:   [],
    history:         {
        count:  0,
        orders: [],
        stats:  {},
    },
    calls:        [],
    tasks:        [],
    orderDetails: [],
    allDetails:   {
        details: [],
        brands:  [],
    },
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
    order:      {},
    invited:    false,
    orderTasks: [],
});

const ReducerState = createDefaultState();

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload, meta } = action;
    /* eslint-disable */
    switch (type) {
        case FETCH_ORDER_FORM_SUCCESS:
            const newState = {
                ...state,
                ...payload,
                fields: {
                    ...state.fields,
                    clientPhone: customFieldValue(
                        "clientPhone",
                        payload.order.clientPhone,
                    ),
                    clientEmail: customFieldValue(
                        "clientEmail",
                        payload.order.clientEmail,
                    ),
                    clientVehicle: customFieldValue(
                        "clientVehicle",
                        payload.order.clientVehicleId,
                    ),
                    station: customFieldValue(
                        "station",
                        payload.order.stationNum,
                    ),
                    manager: customFieldValue(
                        "manager",
                        payload.order.managerId,
                    ),
                    beginDate: customFieldValue(
                        "beginDate",
                        payload.order.beginDatetime
                            ? moment(payload.order.beginDatetime)
                            : void 0,
                    ),
                    beginTime: customFieldValue(
                        "beginTime",
                        payload.order.beginDatetime
                            ? moment(payload.order.beginDatetime)
                            : void 0,
                    ),
                    requisite: customFieldValue(
                        "requisite",
                        payload.order.businessRequisiteId,
                    ),
                    clientRequisite: customFieldValue(
                        "clientRequisite",
                        payload.order.clientRequisiteId,
                    ),
                    paymentMethod: customFieldValue(
                        "paymentMethod",
                        payload.order.paymentMethod,
                    ),
                    odometerValue: customFieldValue(
                        "odometerValue",
                        payload.order.odometerValue,
                    ),
                    recommendation: customFieldValue(
                        "recommendation",
                        payload.order.recommendation,
                    ),
                    businessComment: customFieldValue(
                        "businessComment",
                        payload.order.businessComment,
                    ),
                    vehicleCondition: customFieldValue(
                        "vehicleCondition",
                        payload.order.vehicleCondition,
                    ),
                    comment: customFieldValue("comment", payload.order.comment),
                    ...(payload.order.duration
                        ? {
                              duration: customFieldValue(
                                  "duration",
                                  payload.order.duration,
                              ),
                          }
                        : {}),
                    employee: customFieldValue(
                        "employee",
                        payload.order.employeeId,
                    ),
                    servicesDiscount: customFieldValue(
                        "servicesDiscount",
                        payload.order.servicesDiscount,
                    ),
                    detailsDiscount: customFieldValue(
                        "detailsDiscount",
                        payload.order.detailsDiscount,
                    ),
                },

                fetchedOrder: payload,
                selectedClient: payload.client || state.selectedClient,
            };

            const initOrderEntity = convertFieldsValuesToDbEntity(
                {
                    ...newState.fields,
                    selectedClient: newState.selectedClient,
                },
                newState.allServices,
                newState.allDetails,
            );

            /* eslint-enable */

            return { ...newState, initOrderEntity };

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
                fields: {
                    ...state.fields,
                    station: customFieldValue(
                        'station',
                        payload.stations[ 0 ].num,
                    ),
                    manager: customFieldValue(
                        'manager',
                        payload.managers[ 0 ].id,
                    ),
                },
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

        case PREFILL_FROM_DASHBOARD:
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
                selectedClient:      payload,
                searchClientsResult: {
                    clients:   [],
                    searching: true,
                },
                fields: {
                    ...state.fields,
                    // clearing provided fields with default values
                    ..._.pick(ReducerState.fields, [ 'clientPhone', 'clientEmail', 'clientVehicle', 'searchClientQuery', 'clientRequisite' ]),
                    clientPhone: customFieldValue(
                        'clientPhone',
                        _.get(payload, 'phones[0]'),
                    ),
                    clientEmail: customFieldValue(
                        'clientEmail',
                        _.get(payload, 'emails[0]'),
                    ),
                    clientVehicle: customFieldValue(
                        'clientVehicle',
                        _.get(payload, 'vehicles[0].id'),
                    ),
                },
            };
        // TODO think about loader state for client search table
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
        case FETCH_ORDER_TASK_SUCCESS:
            return {
                ...state,
                orderTasks: payload,
            };

        case FETCH_AVAILABLE_HOURS_SUCCESS:
            return {
                ...state,
                availableHours: payload,
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const orderSelector = state => state.forms[ moduleName ].order;

export const selectInviteData = createSelector(orderSelector, order => {
    const hasInviteStatus = [ 'success', 'cancel' ].includes(order.status);

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

/**
 * Action Creators
 * */

export const fetchOrderForm = id => ({
    type:    FETCH_ORDER_FORM,
    payload: id,
});

export const fetchOrderFormSuccess = data => ({
    type:    FETCH_ORDER_FORM_SUCCESS,
    payload: data,
});

export const fetchAddOrderForm = () => ({
    type: FETCH_ADD_ORDER_FORM,
});

export const fetchAddOrderFormSuccess = data => ({
    type:    FETCH_ADD_ORDER_FORM_SUCCESS,
    payload: data,
});

export const fetchOrderTask = id => ({
    type:    FETCH_ORDER_TASK,
    payload: id,
});

export const fetchOrderTaskSuccess = data => ({
    type:    FETCH_ORDER_TASK_SUCCESS,
    payload: data,
});

export const onChangeClientSearchQuery = searchQuery => ({
    type:    ON_CHANGE_CLIENT_SEARCH_QUERY,
    payload: searchQuery,
});

export const setClientSelection = client => ({
    type:    ON_CLIENT_SELECT,
    payload: client,
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

export const createOrder = entity => ({
    type:    CREATE_ORDER,
    payload: entity,
});

export const createOrderSuccess = () => ({
    type: CREATE_ORDER_SUCCESS,
});

export const updateOrder = entity => ({
    type:    UPDATE_ORDER,
    payload: entity,
});

export const updateOrderSuccess = () => ({
    type: UPDATE_ORDER_SUCCESS,
});

export const setCreateStatus = status => ({
    type:    SET_CREATE_STATUS,
    payload: status,
});

export const submitOrderForm = orderForm => ({
    type:    SUBMIT_ORDER_FORM,
    payload: orderForm,
});

export const submitOrderFormSuccess = () => ({
    type: SUBMIT_ORDER_FORM_SUCCESS,
});

export const returnToOrdersPage = status => ({
    type:    RETURN_TO_ORDERS_PAGE,
    payload: status,
});

export const prefillFromDashboard = data => ({
    type:    PREFILL_FROM_DASHBOARD,
    payload: data,
});

export const createInviteOrder = inviteOrder => ({
    type:    CREATE_INVITE_ORDER,
    payload: inviteOrder,
});

export const createInviteOrderSuccess = response => ({
    type:    CREATE_INVITE_ORDER_SUCCESS,
    payload: response,
});

export const fetchAvailableHours = (station, date) => ({
    type:    FETCH_AVAILABLE_HOURS,
    payload: { station, date },
});
// export const fetchAvailableHours = ({ beginDatetime, station }) => ({
//     type:    FETCH_AVAILABLE_HOURS,
//     payload: { stationNum: station, date: beginDatetime },
// });

export const fetchAvailableHoursSuccess = availableHours => ({
    type:    FETCH_AVAILABLE_HOURS_SUCCESS,
    payload: availableHours,
});
