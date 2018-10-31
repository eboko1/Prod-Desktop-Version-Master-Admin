import { createSelector } from 'reselect';

/**
 * Constants
 * */
export const moduleName = 'servicesForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_SERVICES = `${prefix}/FETCH_SERVICES`;
export const FETCH_SERVICES_SUCCESS = `${prefix}/FETCH_SERVICES_SUCCESS`;

export const ON_CHANGE_SERVICES_FORM = `${prefix}/ON_CHANGE_SERVICES_FORM`;
export const RESET_FIELDS = `${prefix}/RESET_FIELDS`;

export const UPDATE_SERVICE = `${prefix}/UPDATE_SERVICE`;
export const CREATE_SERVICE = `${prefix}/CREATE_SERVICE`;
export const DELETE_SERVICE = `${prefix}/DELETE_SERVICE`;

export const SET_FILTERS = `${prefix}/SET_FILTERS`;

/**
 * Reducer
 * */

const ReducerState = {
    fields:   {},
    filters:  {},
    services: {
        servicesPartsSuggestions: {
            stats: {
                count: '0',
            },
            list: [],
        },
        services: [],
        details:  [],
        brands:   [],
    },
    // "id": 1,
    // "serviceId": 110136,
    // "detailId": 104,
    // "createdAt": "2018-10-29T13:47:12.832Z",
    // "quantity": 1,
    // "servicename": "Экспресс мойка кузова",
    // "detailname": "Вилка сцепления / тяга"
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_SERVICES_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case FETCH_SERVICES_SUCCESS:
            return {
                ...state,
                services: payload,
            };

        case UPDATE_SERVICE:
            return {
                ...state,
            };

        case CREATE_SERVICE:
            return {
                ...state,
            };

        case RESET_FIELDS:
            return {
                ...state,
                fields: {},
            };

        case SET_FILTERS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    ...payload,
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

export const selectServicesSuggestionsList = state =>
    state.forms.servicesForm.servicesPartsSuggestions.list;

export const selectServicesSuggestionsStats = state =>
    state.forms.servicesForm.servicesPartsSuggestions.stats;

export const selectServicesOptions = state =>
    state.forms.servicesForm.services.services;

export const selectDetailsOptions = state =>
    state.forms.servicesForm.services.details;

export const selectBrandsOptions = state =>
    state.forms.servicesForm.services.brands;

// const getDashboard = state => state.dashboard;

export const selectDasboardData = createSelector(
    [ stateSelector ],
    properties => {
        console.log('→ properties', properties);

        return {
            properties,
        };
    },
);

/**
 * Actions
 * */

export const onChangeServicesForm = update => ({
    type:    ON_CHANGE_SERVICES_FORM,
    payload: update,
});

export const fetchServices = () => ({
    type: FETCH_SERVICES,
});
// export const fetchServices = businessId => ({
//     type:    FETCH_SERVICES,
//     payload: businessId,
// });

export const fetchServicesSuccess = data => ({
    type:    FETCH_SERVICES_SUCCESS,
    payload: data,
});

export const createService = suggestion => ({
    type:    CREATE_SERVICE,
    payload: suggestion,
});

export const updateService = suggestion => ({
    type:    UPDATE_SERVICE,
    payload: suggestion,
});

export const deleteService = id => ({
    type:    DELETE_SERVICE,
    payload: id,
});

export const resetFields = () => ({
    type: RESET_FIELDS,
});

export const setFilters = filters => ({
    types:   SET_FILTERS,
    payload: filters,
});
