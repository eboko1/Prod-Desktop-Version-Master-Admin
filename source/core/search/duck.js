/**
 * Constants
 * */
export const moduleName = 'search';
const prefix = `cpb/${moduleName}`;

export const IS_FETCHING_BUSINESSES = `${prefix}/IS_FETCHING_BUSINESSES`;
export const SET_BUSINESS_SEARCH_QUERY = `${prefix}/SET_BUSINESS_SEARCH_QUERY`;
export const FETCH_BUSINESSES_SUCCESS = `${prefix}/FETCH_BUSINESSES_SUCCESS`;

export const IS_FETCHING_MANAGERS = `${prefix}/IS_FETCHING_MANAGERS`;
export const SET_MANAGER_SEARCH_QUERY = `${prefix}/SET_MANAGER_SEARCH_QUERY`;
export const FETCH_MANAGERS_SUCCESS = `${prefix}/FETCH_MANAGERS_SUCCESS`;

/**
 * Reducer
 * */

let errorId = 1;

const ReducerState = {
    errors:               [],
    businesses:           [],
    isFetchingBusinesses: false,
    businessSearchQuery:  null,

    managers:           [],
    isFetchingManagers: false,
    managerSearchQuery: null,
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

        case FETCH_MANAGERS_SUCCESS:
            return {
                ...state,
                managers: payload,
            };

        case SET_BUSINESS_SEARCH_QUERY:
            return {
                ...state,
                businessSearchQuery: payload,
            };

        case SET_MANAGER_SEARCH_QUERY:
            return {
                ...state,
                managerSearchQuery: payload,
            };

        case IS_FETCHING_BUSINESSES:
            return {
                ...state,
                isFetchingBusinesses: payload,
            };

        case IS_FETCHING_MANAGERS:
            return {
                ...state,
                isFetchingManagers: payload,
            };

        default:
            return state;
    }
}

export const setBusinessSearchQuery = query => ({
    type:    SET_BUSINESS_SEARCH_QUERY,
    payload: query,
});

export const setManagerSearchQuery = query => ({
    type:    SET_MANAGER_SEARCH_QUERY,
    payload: query,
});

export const fetchBusinessesSuccess = businesses => ({
    type:    FETCH_BUSINESSES_SUCCESS,
    payload: businesses,
});

export const fetchManagersSuccess = managers => ({
    type:    FETCH_MANAGERS_SUCCESS,
    payload: managers,
});

export const setIsFetchingBusinesses = isFetching => ({
    type:    IS_FETCHING_BUSINESSES,
    payload: isFetching,
});

export const setIsFetchingManagers = isFetching => ({
    type:    IS_FETCHING_MANAGERS,
    payload: isFetching,
});
