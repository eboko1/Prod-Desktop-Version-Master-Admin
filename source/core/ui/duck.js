/**
 * Constants
 **/
export const moduleName = 'ui';
const prefix = `GLOBAL/${moduleName}`;

export const SET_VIEW = `${prefix}/SET_VIEW`;

export const SET_AUTH_FETCHING_STATE = `${prefix}/SET_AUTH_FETCHING_STATE`;
export const SET_PROFILE_UPDATING_STATE = `${prefix}/SET_PROFILE_UPDATING_STATE`;

export const SET_SEARCH_BUSINESSES_FETCHING_STATE = `${prefix}/SET_SEARCH_BUSINESSES_FETCHING_STATE`;
export const SET_ORDERS_FETCHING_STATE = `${prefix}/SET_ORDERS_FETCHING_STATE`;
export const SET_ORDER_FETCHING_STATE = `${prefix}/SET_ORDER_FETCHING_STATE`;
export const SET_MY_TASKS_FETCHING_STATE = `${prefix}/SET_MY_TASKS_FETCHING_STATE`;
export const SET_CLIENT_FETCHING_STATE = `${prefix}/SET_CLIENT_FETCHING_STATE`;
export const SET_CLIENTS_FETCHING_STATE = `${prefix}/SET_CLIENTS_FETCHING_STATE`;
export const SET_CLIENT_ORDERS_FETCHING_STATE = `${prefix}/SET_CLIENT_ORDERS_FETCHING_STATE`;
export const SET_REVIEWS_FETCHING_STATE = `${prefix}/SET_REVIEWS_FETCHING_STATE`;
export const SET_REVIEW_FETCHING_STATE = `${prefix}/SET_REVIEW_FETCHING_STATE`;
export const SET_CHART_FETCHING_STATE = `${prefix}/SET_CHART_FETCHING_STATE`;
export const SET_CALLS_FETCHING_STATE = `${prefix}/SET_CALLS_FETCHING_STATE`;
export const SET_CALLS_CHART_FETCHING_STATE = `${prefix}/SET_CALLS_CHART_FETCHING_STATE`;
export const SET_PACKAGE_FETCHING_STATE = `${prefix}/SET_PACKAGE_FETCHING_STATE`;
export const SET_BUSINESS_PACKAGE_FETCHING_STATE = `${prefix}/SET_BUSINESS_PACKAGE_FETCHING_STATE`;
export const SET_MANAGER_ROLE_FETCHING_STATE = `${prefix}/SET_MANAGER_ROLE_FETCHING_STATE`;
export const SET_ROLE_FETCHING_STATE = `${prefix}/SET_ROLE_FETCHING_STATE`;
export const SET_BRANDS_FETCHING_STATE = `${prefix}/SET_BRANDS_FETCHING_STATE`;

export const SET_REVIEW_REPLY_STATE = `${prefix}/SET_REVIEW_REPLY_STATE`;
export const SET_REVIEW_COMPLAINT_STATE = `${prefix}/SET_REVIEW_COMPLAINT_STATE`;

export const SET_DASHBOARD_INITALIZING_STATE = `${prefix}/SET_DASHBOARD_INITALIZING_STATE`;
export const SET_DASHBOARD_FETCHING_STATE = `${prefix}/SET_DASHBOARD_FETCHING_STATE`;

export const SET_DETAILS_SUGGESTIONS_FETCHING_STATE = `${prefix}/SET_DETAILS_SUGGESTIONS_FETCHING_STATE`;
export const SET_SUGGESTIONS_FETCHING_STATE = `${prefix}/SET_SUGGESTIONS_FETCHING_STATE`;
export const SET_SUGGESTIONS_LOADING_STATE = `${prefix}/SET_SUGGESTIONS_LOADING_STATE`;

export const SET_CASH_ORDER_FETCHING_STATE = `${prefix}/SET_CASH_ORDER_FETCHING_STATE`;
export const SET_CASH_ORDERS_FETCHING_STATE = `${prefix}/SET_CASH_ORDERS_FETCHING_STATE`;

export const INITIALIZE = `${prefix}/INITIALIZE`;
export const SET_COLLAPSED_STATE = `${prefix}/SET_COLLAPSED_STATE`;
export const EMIT_ERROR = `${prefix}/EMIT_ERROR`;

export const ADD_ERROR = `${prefix}/ADD_ERROR`;
export const HANDLE_ERROR = `${prefix}/HANDLE_ERROR`;

/**
 * Reducer
 **/

let errorId = 1;

const ReducerState = {
    errors:                     [],
    initialized:                false,
    authFetching:               false,
    profileUpdating:            false,
    ordersFetching:             false,
    orderFetching:              false,
    cashOrderFetching:          false,
    cashOrdersFetching:         false,
    myTasksFetching:            false,
    clientsFetching:            false,
    clientFetching:             false,
    clientOrdersFetching:       false,
    reviewsFetching:            false,
    reviewFetching:             false,
    reviewReplyLoading:         false,
    reviewComplaintLoading:     false,
    chartFetching:              false,
    callsFetching:              false,
    callsChartFetching:         false,
    dashboardInitializing:      false,
    dashboardFetching:          false,
    searchBusinessesFetching:   false,
    packageFetching:            false,
    businessPackageFetching:    false,
    managerRoleFetching:        false,
    roleFetching:               false,
    brandsFetching:             false,
    collapsed:                  false,
    views:                      {},
    error:                      null,
    suggestionsFetching:        false,
    suggestionsLoading:         false,
    detailsSuggestionsFetching: false,
    cashOrderFetching:          false,
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

        case SET_PROFILE_UPDATING_STATE:
            return { ...state, profileUpdating: payload };

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

        case SET_BUSINESS_PACKAGE_FETCHING_STATE:
            return { ...state, businessPackageFetching: payload };

        case SET_ROLE_FETCHING_STATE:
            return { ...state, roleFetching: payload };

        case SET_SEARCH_BUSINESSES_FETCHING_STATE:
            return { ...state, searchBusinessesFetching: payload };

        case SET_MANAGER_ROLE_FETCHING_STATE:
            return { ...state, managerRoleFetching: payload };

        case SET_CLIENTS_FETCHING_STATE:
            return { ...state, clientsFetching: payload };

        case SET_CLIENT_FETCHING_STATE:
            return { ...state, clientFetching: payload };

        case SET_CLIENT_ORDERS_FETCHING_STATE:
            return { ...state, clientOrdersFetching: payload };

        case SET_REVIEWS_FETCHING_STATE:
            return { ...state, reviewsFetching: payload };

        case SET_REVIEW_FETCHING_STATE:
            return { ...state, reviewFetching: payload };

        case SET_CHART_FETCHING_STATE:
            return { ...state, chartFetching: payload };

        case SET_CALLS_FETCHING_STATE:
            return { ...state, callsFetching: payload };

        case SET_CALLS_CHART_FETCHING_STATE:
            return { ...state, callsChartFetching: payload };

        case SET_REVIEW_REPLY_STATE:
            return { ...state, reviewReplyLoading: payload };

        case SET_REVIEW_COMPLAINT_STATE:
            return { ...state, reviewComplaintLoading: payload };

        case SET_SUGGESTIONS_FETCHING_STATE:
            return { ...state, suggestionsFetching: payload };

        case SET_SUGGESTIONS_LOADING_STATE:
            return { ...state, suggestionsLoading: payload };

        case SET_DETAILS_SUGGESTIONS_FETCHING_STATE:
            return { ...state, detailsSuggestionsFetching: payload };

        case SET_BRANDS_FETCHING_STATE:
            return { ...state, brandsFetching: payload };

        case SET_CASH_ORDER_FETCHING_STATE:
            return { ...state, cashOrderFetching: payload };

        case SET_CASH_ORDERS_FETCHING_STATE:
            return { ...state, cashOrdersFetching: payload };

        case ADD_ERROR:
            return {
                ...state,
                errors: !payload
                    ? state.errors
                    : [ ...state.errors, { id: errorId++, ...payload }],
            };

        case HANDLE_ERROR:
            return {
                ...state,
                errors: state.errors.filter(({ id }) => id !== payload),
            };

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

export const initialize = () => ({
    type: INITIALIZE,
});

export const setAuthFetchingState = state => ({
    type:    SET_AUTH_FETCHING_STATE,
    payload: state,
});

export const setProfileUpdatingState = state => ({
    type:    SET_PROFILE_UPDATING_STATE,
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

export const setManagerRoleFetchingState = state => ({
    type:    SET_MANAGER_ROLE_FETCHING_STATE,
    payload: state,
});

export const setRoleFetchingState = state => ({
    type:    SET_ROLE_FETCHING_STATE,
    payload: state,
});

export const setClientsFetchingState = state => ({
    type:    SET_CLIENTS_FETCHING_STATE,
    payload: state,
});

export const setClientFetchingState = state => ({
    type:    SET_CLIENT_FETCHING_STATE,
    payload: state,
});

export const setClientOrdersFetchingState = state => ({
    type:    SET_CLIENT_ORDERS_FETCHING_STATE,
    payload: state,
});

export const setReviewsFetchingState = state => ({
    type:    SET_REVIEWS_FETCHING_STATE,
    payload: state,
});

export const setReviewFetchingState = state => ({
    type:    SET_REVIEW_FETCHING_STATE,
    payload: state,
});

export const setReviewReplyState = state => ({
    type:    SET_REVIEW_REPLY_STATE,
    payload: state,
});

export const setReviewComplaintState = state => ({
    type:    SET_REVIEW_COMPLAINT_STATE,
    payload: state,
});

export const setChartFetchingState = state => ({
    type:    SET_CHART_FETCHING_STATE,
    payload: state,
});

export const setCallsFetchingState = state => ({
    type:    SET_CALLS_FETCHING_STATE,
    payload: state,
});

export const setCallsChartFetchingState = state => ({
    type:    SET_CALLS_CHART_FETCHING_STATE,
    payload: state,
});

export const setSearchBusinessesFetchingState = state => ({
    type:    SET_SEARCH_BUSINESSES_FETCHING_STATE,
    payload: state,
});

export const setSuggestionsFetchingState = state => ({
    type:    SET_SUGGESTIONS_FETCHING_STATE,
    payload: state,
});

export const setDetailsSuggestionsFetchingState = state => ({
    type:    SET_DETAILS_SUGGESTIONS_FETCHING_STATE,
    payload: state,
});

export const setBrandsFetchingState = state => ({
    type:    SET_BRANDS_FETCHING_STATE,
    payload: state,
});

export const setSuggestionsFetching = state => ({
    type:    SET_SUGGESTIONS_FETCHING_STATE,
    payload: state,
});

export const setSuggestionsLoading = state => ({
    type:    SET_SUGGESTIONS_LOADING_STATE,
    payload: state,
});

export const setCashOrderFetchingState = state => ({
    type:    SET_CASH_ORDER_FETCHING_STATE,
    payload: state,
});
export const setCashOrdersFetchingState = state => ({
    type:    SET_CASH_ORDERS_FETCHING_STATE,
    payload: state,
});

// GLOBALS
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

export const addError = error => ({
    type:    ADD_ERROR,
    payload: error,
    error:   true,
});

export const handleError = id => ({
    type:    HANDLE_ERROR,
    payload: id,
});
