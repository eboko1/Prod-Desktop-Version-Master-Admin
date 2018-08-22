/**
 * Constants
 **/
export const moduleName = 'ui';
const prefix = `GLOBAL/${moduleName}`;

export const SET_VIEW = `${prefix}/SET_VIEW`;
export const SET_SWAPI_FETCHING_STATE = `${prefix}/SET_SWAPI_FETCHING_STATE`;
export const SET_AUTH_FETCHING_STATE = `${prefix}/SET_AUTH_FETCHING_STATE`;
export const SET_ORDERS_FETCHING_STATE = `${prefix}/SET_ORDERS_FETCHING_STATE`;
export const SET_MY_TASKS_FETCHING_STATE = `${prefix}/SET_MY_TASKS_FETCHING_STATE`;
export const SET_ORDER_FETCHING_STATE = `${prefix}/SET_ORDER_FETCHING_STATE`;
export const SET_PACKAGE_FETCHING_STATE = `${prefix}/SET_PACKAGE_FETCHING_STATE`;
export const SET_BUSINESS_PACKAGE_FETCHING_STATE = `${prefix}/SET_BUSINESS_PACKAGE_FETCHING_STATE`;
export const SET_ROLE_FETCHING_STATE = `${prefix}/SET_ROLE_FETCHING_STATE`;
export const SET_SEARCH_BUSINESSES_FETCHING_STATE = `${prefix}/SET_SEARCH_BUSINESSES_FETCHING_STATE`;
export const SET_DASHBOARD_INITALIZING_STATE = `${prefix}/SET_DASHBOARD_INITALIZING_STATE`;
export const SET_DASHBOARD_FETCHING_STATE = `${prefix}/SET_DASHBOARD_FETCHING_STATE`;
export const INITIALIZE = `${prefix}/INITIALIZE`;
export const SET_COLLAPSED_STATE = `${prefix}/SET_COLLAPSED_STATE`;
export const EMIT_ERROR = `${prefix}/EMIT_ERROR`;

/**
 * Reducer
 **/
const ReducerState = {
    initialized:              false,
    authFetching:             false,
    ordersFetching:           false,
    orderFetching:            false,
    myTasksFetching:          false,
    dashboardInitializing:    false,
    dashboardFetching:        false,
    searchBusinessesFetching: false,
    packageFetching:          false,
    businessPackageFetching:  false,
    roleFetching:             false,
    collapsed:                false,
    views:                    {},
    error:                    null,
};

/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case INITIALIZE:
            return { ...state, initialized: payload };

        case SET_COLLAPSED_STATE:
            return { ...state, collapsed: payload };

        case SET_VIEW:
            return { ...state, views: { ...payload } };

        case EMIT_ERROR:
            return { ...state, error: payload };

        case SET_AUTH_FETCHING_STATE:
            return { ...state, authFetching: payload };

        case SET_ORDERS_FETCHING_STATE:
            return { ...state, ordersFetching: payload };

        case SET_ORDER_FETCHING_STATE:
            return { ...state, orderFetching: payload };

        case SET_MY_TASKS_FETCHING_STATE:
            return { ...state, myTasksFetching: payload };

        case SET_DASHBOARD_INITALIZING_STATE:
            return { ...state, dashboardInitializing: payload };

        case SET_DASHBOARD_FETCHING_STATE:
            return { ...state, dashboardFetching: payload };

        case SET_PACKAGE_FETCHING_STATE:
            return { ...state, packageFetching: payload };

        case SET_ROLE_FETCHING_STATE:
            return { ...state, roleFetching: payload };

        case SET_SEARCH_BUSINESSES_FETCHING_STATE:
            return { ...state, searchBusinessesFetching: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

/**
 * Action Creators
 **/

export const setSwapiFetchingState = state => ({
    type:    SET_SWAPI_FETCHING_STATE,
    payload: state,
});

export const initialize = () => ({
    type: INITIALIZE,
});

export const setAuthFetchingState = state => ({
    type:    SET_AUTH_FETCHING_STATE,
    payload: state,
});

export const setOrdersFetchingState = state => ({
    type:    SET_ORDERS_FETCHING_STATE,
    payload: state,
});

export const setOrderFetchingState = state => ({
    type:    SET_ORDER_FETCHING_STATE,
    payload: state,
});

export const setMyTasksFetchingState = state => ({
    type:    SET_MY_TASKS_FETCHING_STATE,
    payload: state,
});

export const setDashboardInitializingState = state => ({
    type:    SET_DASHBOARD_INITALIZING_STATE,
    payload: state,
});

export const setDashboardFetchingState = state => ({
    type:    SET_DASHBOARD_FETCHING_STATE,
    payload: state,
});

export const setPackageFetchingState = state => ({
    type:    SET_PACKAGE_FETCHING_STATE,
    payload: state,
});

export const setBusinessPackageFetchingState = state => ({
    type:    SET_BUSINESS_PACKAGE_FETCHING_STATE,
    payload: state,
});

export const setRoleFetchingState = state => ({
    type:    SET_ROLE_FETCHING_STATE,
    payload: state,
});

export const setSearchBusinessesFetchingState = state => ({
    type:    SET_SEARCH_BUSINESSES_FETCHING_STATE,
    payload: state,
});

export const setCollapsedState = state => ({
    type:    SET_COLLAPSED_STATE,
    payload: state,
});

export const setView = state => ({
    type:    SET_VIEW,
    payload: state,
});

export const emitError = error => ({
    type:    EMIT_ERROR,
    payload: error,
    error:   true,
});
