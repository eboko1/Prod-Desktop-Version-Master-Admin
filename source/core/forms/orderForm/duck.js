import _ from 'lodash';
import { v4 } from 'uuid';
import moment from 'moment';

/**
 * Constants
 * */
export const moduleName = 'orderForm';
const prefix = `cpb/${moduleName}`;

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

/**
 * Reducer
 * */

const customFieldValue = (name, value) => ({
    errors:     void 0,
    name:       name,
    touched:    true,
    validating: false,
    value:      value,
    dirty:      true,
});

const defaultFieldValue = name => customFieldValue(name, void 0);

const generateNestedObject = (
    fields,
    fieldNameGenerator,
    defaultValues = {},
) => {
    const randomName = v4();
    const pairs = fields.map(name => [
        name,
        customFieldValue(
            fieldNameGenerator(randomName, name),
            defaultValues[ name ],
        ),
    ]);

    return {
        [ randomName ]: _.fromPairs(pairs),
    };
};

const defaultService = () => {
    const defaultValues = { serviceCount: 1, servicePrice: 0 };
    const fields = [ 'serviceName', 'serviceCount', 'servicePrice' ];

    return generateNestedObject(
        fields,
        (randomName, name) => `services[${randomName}][${name}]`,
        defaultValues,
    );
};

export const defaultDetail = () => {
    const defaultValues = { detailCount: 1, detailPrice: 0 };
    const fields = [ 'detailName', 'detailBrandName', 'detailCode', 'detailCount', 'detailPrice' ];

    return generateNestedObject(
        fields,
        (randomName, name) => `details[${randomName}][${name}]`,
        defaultValues,
    );
};

const customServices = services =>
    _.fromPairs(
        services.map(({ serviceId, type, count, price }) => [
            `${type}|${serviceId}`,
            {
                serviceName: customFieldValue(
                    `services[${type}|${serviceId}][serviceName]`,
                    `${type}|${serviceId}`,
                ),
                serviceCount: customFieldValue(
                    `services[${type}|${serviceId}][serviceCount]`,
                    Number(count) || 0,
                ),
                servicePrice: customFieldValue(
                    `services[${type}|${serviceId}][servicePrice]`,
                    Number(price) || 0,
                ),
            },
        ]),
    );

const customDetails = details =>
    _.fromPairs(
        details.map(
            ({
                id,
                detailId,
                detailName,
                brandId,
                brandName,
                detailCode,
                price,
                count,
            }) => [
                [ id ],
                {
                    detailName: customFieldValue(
                        `details[${id}][detailName]`,
                        detailId || detailName
                            ? detailId || `custom|${id}`
                            : null,
                    ),
                    detailBrandName: customFieldValue(
                        `details[${id}][detailBrandName]`,
                        brandId || brandName ? brandId || `custom|${id}` : null,
                    ),
                    detailCode: customFieldValue(
                        `details[${id}][detailCode]`,
                        detailCode,
                    ),
                    detailCount: customFieldValue(
                        `details[${id}][detailCount]`,
                        Number(count) || 0,
                    ),
                    detailPrice: customFieldValue(
                        `details[${id}][detailPrice]`,
                        Number(price) || 0,
                    ),
                },
            ],
        ),
    );

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
        services:         defaultService(),
        details:          defaultDetail(),
    },
    allServices:     [],
    managers:        [],
    employees:       [],
    filteredDetails: [],
    stations:        [],
    orderServices:   [],
    orderDetails:    [],
    allDetails:      {
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
    order: {},
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

function calculateAllDetails(allDetails, selectedDetails) {
    const selectedValues = _(selectedDetails)
        .values()
        .map('detailName')
        .map('value')
        .value();

    const manuallyInsertedDetails = allDetails.filter(
        detail => detail.manuallyInserted,
    );

    const redundantManuallyInsertedDetails = manuallyInsertedDetails.filter(
        ({ detailId }) => !selectedValues.includes(detailId),
    );

    return _.differenceWith(
        allDetails,
        redundantManuallyInsertedDetails,
        _.isEqual,
    );
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

function calculateAllServices(allServices, selectedServices) {
    const selectedValues = _(selectedServices)
        .values()
        .map('serviceName')
        .map('value')
        .value();

    const manuallyInsertedServices = allServices.filter(
        service => service.manuallyInserted,
    );

    const redundantManuallyInsertedServices = manuallyInsertedServices.filter(
        ({ id }) => !selectedValues.includes(`custom|${id}`),
    );

    return _.differenceWith(
        allServices,
        redundantManuallyInsertedServices,
        _.isEqual,
    );
}

function mergeAllDetailsOrderDetails(allDetails, orderDetails) {
    const requiredOrderDetails = orderDetails
        .filter(({ detailId }) => !detailId)
        .map(({ detailName, id }) => ({
            detailId: `custom|${id}`,
            detailName,
        }));

    return [ ...allDetails, ...requiredOrderDetails ];
}

function mergeAllDetailsOrderBrands(allBrands, orderDetails) {
    const requiredOrderBrands = orderDetails
        .filter(({ brandId }) => !brandId)
        .map(({ brandName, id }) => ({
            brandId: `custom|${id}`,
            brandName,
        }));

    return [ ...allBrands, ...requiredOrderBrands ];
}

function mergeAllServicesOrderServices(allServices, orderServices) {
    const allServicesKeys = allServices.map(
        ({ serviceId, type }) => `${type}|${serviceId}`,
    );
    const requiredOrderServices = orderServices
        .filter(
            ({ serviceId, type }) =>
                !allServicesKeys.includes(`${type}|${serviceId}`),
        )
        .map(({ id, serviceName, type }) => ({
            id,
            serviceName,
            servicePrice: null,
            serviceHours: null,
            description:  '',
            serviceId:    id,
            type:         `custom|${type}`,
        }));

    return [ ...allServices, ...requiredOrderServices ];
}
// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload, meta } = action;

    switch (type) {
        case FETCH_ORDER_FORM_SUCCESS:
            return {
                ...state,
                ...payload,
                filteredDetails: payload.allDetails.details.slice(0, 100),
                allServices:     mergeAllServicesOrderServices(
                    payload.allServices,
                    payload.orderServices,
                ),
                allDetails: {
                    ...state.allDetails,
                    details: mergeAllDetailsOrderDetails(
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
                        ...customServices(payload.orderServices),
                        ...defaultService(),
                    },
                    details: {
                        ...customDetails(payload.orderDetails),
                        ...defaultDetail(),
                    },
                },
                selectedClient: payload.client || state.selectedClient,
            };

        case FETCH_ADD_ORDER_FORM_SUCCESS:
            return {
                ...state,
                ...payload,
                filteredDetails: payload.allDetails.details.slice(0, 100),
                allServices:     payload.allServices,
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
                    ...calculateAllServices(
                        state.allServices,
                        state.fields.services,
                    ),
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
                .filter(({ detailName }) => detailName.toLocaleLowerCase().includes(payload))
                .slice(0, 100);

            const includesCustomName = filteredDetails.find(
                ({ detailName }) => detailName === payload,
            );

            return {
                ...state,
                filteredDetails: [ ...filteredDetails, ...(includesCustomName ? [] : [ customDetail ]) ],
                allDetails:      {
                    ...state.allDetails,
                    details: [
                        ...calculateAllDetails(
                            state.allDetails.details,
                            state.fields.details,
                        ),
                        ...(includesCustomName ? [] : [ customDetail ]),
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
