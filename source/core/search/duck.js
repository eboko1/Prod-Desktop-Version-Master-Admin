/**
 * Constants
 * */
export const moduleName = 'search';
const prefix = `cpb/${moduleName}`;

export const IS_FETCHING_BUSINESSES = `${prefix}/IS_FETCHING_BUSINESSES`;
export const SET_BUSINESS_SEARCH_QUERY = `${prefix}/SET_BUSINESS_SEARCH_QUERY`;
export const FETCH_BUSINESSES_SUCCESS = `${prefix}/FETCH_BUSINESSES_SUCCESS`;

/**
 * Reducer
 * */

let errorId = 1;

const ReducerState = {
    errors:               [],
    businesses:           [],
    isFetchingBusinesses: false,
    businessSearchQuery:  null,
};

/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_BUSINESSES_SUCCESS:
            return {
                ...state,
                businesses: payload,
            };

        case SET_BUSINESS_SEARCH_QUERY:
            return {
                ...state,
                businessSearchQuery: payload,
            };

        case IS_FETCHING_BUSINESSES:
            return {
                ...state,
                isFetchingBusinesses: payload,
            };

        default:
            return state;
    }
}

export const setBusinessSearchQuery = query => ({
    type:    SET_BUSINESS_SEARCH_QUERY,
    payload: query,
});

export const fetchBusinessesSuccess = businesses => ({
    type:    FETCH_BUSINESSES_SUCCESS,
    payload: businesses,
});

export const setIsFetchingBusinesses = isFetching => ({
    type:    IS_FETCHING_BUSINESSES,
    payload: isFetching,
});
