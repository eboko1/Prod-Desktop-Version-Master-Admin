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

export const FETCH_ORDER_FORM = `${prefix}/FETCH_ORDER_FORM`;
export const FETCH_ORDER_FORM_SUCCESS = `${prefix}/FETCH_ORDER_FORM_SUCCESS`;

export const ON_CHANGE_ORDER_FORM = `${prefix}/ON_CHANGE_ORDER_FORM`;
export const ON_CHANGE_CLIENT_SEARCH_QUERY = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY`;

// TODO ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST mv to ui (spin load state in table)
export const ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_REQUEST`;
export const ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS`;

export const ON_CLIENT_SELECT = `${prefix}/ON_CLIENT_SELECT`;

export const ON_SERVICE_SEARCH = `${prefix}/ON_SERVICE_SEARCH`;
export const ON_DETAIL_SEARCH = `${prefix}/ON_DETAIL_SEARCH`;
export const ON_BRAND_SEARCH = `${prefix}/ON_BRAND_SEARCH`;

export const FETCH_ADD_ORDER_FORM = `${prefix}/FETCH_ADD_ORDER_FORM`;
export const FETCH_ADD_ORDER_FORM_SUCCESS = `${prefix}/FETCH_ADD_ORDER_FORM_SUCCESS`;

export const ON_HANDLE_CUSTOM_SERVICE = `${prefix}/ON_HANDLE_CUSTOM_SERVICE`;
export const ON_HANDLE_CUSTOM_DETAIL = `${prefix}/ON_HANDLE_CUSTOM_DETAIL`;
export const ON_HANDLE_CUSTOM_BRAND = `${prefix}/ON_HANDLE_CUSTOM_BRAND`;

export const ON_CHANGE_ORDER_SERVICES = `${prefix}/ON_CHANGE_ORDER_SERVICES`;
export const ON_CHANGE_ORDER_DETAILS = `${prefix}/ON_CHANGE_ORDER_DETAILS`;

export const SUBMIT_ORDER_FORM = `${prefix}/SUBMIT_ORDER_FORM`;
export const SUBMIT_ORDER_FORM_SUCCESS = `${prefix}/SUBMIT_ORDER_FORM_SUCCESS`;

export const RETURN_TO_ORDERS_PAGE = `${prefix}/RETURN_TO_ORDERS_PAGE`;

export const CREATE_INVITE_ORDER = `${prefix}/CREATE_INVITE_ORDER`;
export const CREATE_INVITE_ORDER_SUCCESS = `${prefix}/CREATE_INVITE_ORDER_SUCCESS`;

import { customFieldValue, defaultFieldValue } from './helpers/utils';

import {
    generateAllServices,
    mapOrderServicesToSelectServices,
    mergeServices,
    defaultServices,
} from './helpers/services';

import { convertFieldsValuesToDbEntity } from './../../../pages/AddOrderPage/extractOrderEntity';

import {
    generateAllDetails,
    mapOrderDetailsToSelectDetails,
    mergeDetails,
    defaultDetails,
    getInitDetails,
} from './helpers/details';

/**
 * Reducer
 * */

const appendKey = (arr) => arr.map((item) => ({...item, key: v4()}));

const createDefaultState = () => ({
    fields: {
        beginDatetime:     defaultFieldValue('beginDatetime'),
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
        services:         defaultServices(),
        details:          defaultDetails(),
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
    order:   {},
    invited: false,
});

const ReducerState = createDefaultState();

export const fetchAddOrderForm = () => ({
    type: FETCH_ADD_ORDER_FORM,
});

export function fetchAddOrderFormSuccess(data) {
    return {
        type:    FETCH_ADD_ORDER_FORM_SUCCESS,
        payload: data,
    };
}

function calculateAllBrands(allBrands, selectedBrands) {
    const selectedValues = _(selectedBrands)
        .values()
        .map('detailBrandName')
        .map('value')
        .value();

    const manuallyInsertedBrands = allBrands.filter(
        brand => brand.manuallyInserted,
    );

    const redundantManuallyInsertedBrands = manuallyInsertedBrands.filter(
        ({ brandId }) => !selectedValues.includes(brandId),
    );

    return _.differenceWith(
        allBrands,
        redundantManuallyInsertedBrands,
        _.isEqual,
    );
}

function mergeAllDetailsOrderBrands(allBrands, orderDetails) {
    const requiredOrderBrands = orderDetails
        .filter(({ brandId }) => !brandId)
        .map(({ brandName, id }) => ({
            brandId: `custom|${id}`,
            brandName,
        }));

    return [ ...requiredOrderBrands, ...allBrands ];
}

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload, meta } = action;

    switch (type) {
        case FETCH_ORDER_FORM_SUCCESS:
            const newState = {
                ...state,
                ...payload,
                filteredDetails: getInitDetails(
                    payload.allDetails.details,
                    payload.orderDetails,
                ),
                allServices: appendKey(mergeServices(
                    payload.allServices,
                    payload.orderServices,
                )),
                allDetails: {
                    ...state.allDetails,
                    details: mergeDetails(
                        payload.allDetails.details,
                        payload.orderDetails,
                    ),
                    brands: mergeAllDetailsOrderBrands(
                        payload.allDetails.brands,
                        payload.orderDetails,
                    ),
                },
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
                        payload.order.beginDatetime
                            ? moment(payload.order.beginDatetime)
                            : void 0,
                    ),
                    requisite: customFieldValue(
                        'requisite',
                        payload.order.businessRequisiteId,
                    ),
                    clientRequisite: customFieldValue(
                        'clientRequisite',
                        payload.order.clientRequisiteId,
                    ),
                    paymentMethod: customFieldValue(
                        'paymentMethod',
                        payload.order.paymentMethod,
                    ),
                    odometerValue: customFieldValue(
                        'odometerValue',
                        payload.order.odometerValue,
                    ),
                    recommendation: customFieldValue(
                        'recommendation',
                        payload.order.recommendation,
                    ),
                    businessComment: customFieldValue(
                        'businessComment',
                        payload.order.businessComment,
                    ),
                    vehicleCondition: customFieldValue(
                        'vehicleCondition',
                        payload.order.vehicleCondition,
                    ),
                    comment:  customFieldValue('comment', payload.order.comment),
                    employee: customFieldValue(
                        'employee',
                        payload.order.employeeId,
                    ),
                    servicesDiscount: customFieldValue(
                        'servicesDiscount',
                        payload.order.servicesDiscount,
                    ),
                    detailsDiscount: customFieldValue(
                        'detailsDiscount',
                        payload.order.detailsDiscount,
                    ),
                    services: {
                        ...mapOrderServicesToSelectServices(
                            payload.orderServices,
                            payload.allServices,
                            payload.order.employeeId,
                        ),
                        ...defaultServices(payload.order.employeeId),
                    },
                    details: {
                        ...mapOrderDetailsToSelectDetails(payload.orderDetails),
                        ...defaultDetails(),
                    },
                },
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
                filteredDetails: payload.allDetails.details.slice(0, 100),
                allServices:     appendKey(payload.allServices),
                allDetails:      payload.allDetails,
                fields:          {
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
                    ...payload,
                    services: {
                        // if merge with empty object old state stayed
                        ..._.merge(
                            state.fields.services,
                            payload.services || {},
                        ),
                    },
                    details: {
                        ..._.merge(state.fields.details, payload.details || {}),
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

        case ON_CHANGE_ORDER_DETAILS:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    details: payload,
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

        case ON_HANDLE_CUSTOM_SERVICE:
            return {
                ...state,
                allServices: [
                    ...appendKey(generateAllServices(
                        state.allServices,
                        state.fields.services,
                    )),
                    {
                        id:               v4(),
                        servicePrice:     null,
                        serviceHours:     null,
                        description:      '',
                        serviceName:      payload,
                        serviceId:        v4(),
                        type:             'custom',
                        manuallyInserted: true,
                    },
                ],
            };

        case ON_HANDLE_CUSTOM_DETAIL:
            const customDetail = {
                detailId:         `custom|${v4()}`,
                detailName:       payload,
                manuallyInserted: true,
            };

            const filteredDetails = state.allDetails.details
                .filter(({ detailName }) =>
                    detailName.toLocaleLowerCase().includes(payload))
                .slice(0, 100);

            const includesCustomName = filteredDetails.find(
                ({ detailName }) => detailName === payload,
            );

            return {
                ...state,
                filteredDetails: [ ...filteredDetails, ...includesCustomName ? [] : [ customDetail ] ],
                allDetails:      {
                    ...state.allDetails,
                    details: [
                        ...generateAllDetails(
                            state.allDetails.details,
                            state.fields.details,
                        ),
                        ...includesCustomName ? [] : [ customDetail ],
                    ],
                },
            };

        case ON_HANDLE_CUSTOM_BRAND:
            return {
                ...state,
                allDetails: {
                    ...state.allDetails,
                    brands: [
                        ...calculateAllBrands(
                            state.allDetails.brands,
                            state.fields.details,
                        ),
                        {
                            brandId:          `custom|${v4()}`,
                            brandName:        payload,
                            manuallyInserted: true,
                        },
                    ],
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

export const onHandleCustomDetail = name => ({
    type:    ON_HANDLE_CUSTOM_DETAIL,
    payload: name,
});

export const onHandleCustomBrand = name => ({
    type:    ON_HANDLE_CUSTOM_BRAND,
    payload: name,
});

export const onChangeClientSearchQuery = searchQuery => ({
    type:    ON_CHANGE_CLIENT_SEARCH_QUERY,
    payload: searchQuery,
});

export const setClientSelection = client => ({
    type:    ON_CLIENT_SELECT,
    payload: client,
});

export const onChangeOrderDetails = data => ({
    type:    ON_CHANGE_ORDER_DETAILS,
    payload: data,
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

export const onBrandSearch = search => ({
    type:    ON_BRAND_SEARCH,
    payload: search,
});

export const onDetailSearch = search => ({
    type:    ON_DETAIL_SEARCH,
    payload: search,
});

export const returnToOrdersPage = status => ({
    type:    RETURN_TO_ORDERS_PAGE,
    payload: status,
});

export function createInviteOrder(inviteOrder) {
    return {
        type:    CREATE_INVITE_ORDER,
        payload: inviteOrder,
    };
}

export function createInviteOrderSuccess(response) {
    return {
        type:    CREATE_INVITE_ORDER_SUCCESS,
        payload: response,
    };
}
