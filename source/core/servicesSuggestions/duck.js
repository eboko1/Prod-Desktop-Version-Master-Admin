// import { createSelector } from 'reselect';

/**
 * Constants
 * */
export const moduleName = 'servicesSuggestions';
const prefix = `cpb/${moduleName}`;

export const FETCH_SERVICES_SUGGESTIONS = `${prefix}/FETCH_SERVICES_SUGGESTIONS`;
export const FETCH_SERVICES_SUGGESTIONS_SUCCESS = `${prefix}/FETCH_SERVICES_SUGGESTIONS_SUCCESS`;

export const SET_FILTERS = `${prefix}/SET_FILTERS`;

/**
 * Reducer
 * */

const ReducerState = {
    filters: {
        businessId: null,
        page:       1,
    },
    servicesPartsSuggestions: {
        stats: {
            count: '0',
        },
        list: [],
    },
    services: [],
    details:  [],
    brands:   [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_SERVICES_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                ...payload,
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

export const stateSelector = state => state[ moduleName ];

export const selectFilters = state => state.servicesSuggestions.filters;

export const selectServicesSuggestions = state =>
    state.servicesSuggestions.servicesPartsSuggestions;

export const selectServicesSuggestionsOptions = state => ({
    brands:   state.servicesSuggestions.brands,
    details:  state.servicesSuggestions.details,
    services: state.servicesSuggestions.services,
});

/**
 * Actions
 * */

export const fetchServicesSuggestions = () => ({
    type: FETCH_SERVICES_SUGGESTIONS,
});

export const fetchServicesSuggestionsSuccess = data => ({
    type:    FETCH_SERVICES_SUGGESTIONS_SUCCESS,
    payload: data,
});

export const setFilters = filters => ({
    type:    SET_FILTERS,
    payload: filters,
});
