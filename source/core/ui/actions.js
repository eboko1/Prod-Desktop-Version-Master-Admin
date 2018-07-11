import types from './types';

export const uiActions = Object.freeze({
    setSwapiFetchingState: state => ({
        type:    types.SET_SWAPI_FETCHING_STATE,
        payload: state,
    }),

    initialize: () => ({
        type: types.INITIALIZE,
    }),

    // setOnlineStatus: state => ({
    //     type:    types.SET_ONLINE_STATUS,
    //     payload: state,
    // }),
    //
    setAuthFetchingState: state => ({
        type:    types.SET_AUTH_FETCHING_STATE,
        payload: state,
    }),
    setOrdersFetchingState: state => ({
        type:    types.SET_ORDERS_FETCHING_STATE,
        payload: state,
    }),
    setOrderFetchingState: state => ({
        type:    types.SET_ORDER_FETCHING_STATE,
        payload: state,
    }),
    setDashboardFetchingState: state => ({
        type:    types.SET_DASHBOARD_FETCHING_STATE,
        payload: state,
    }),

    setCollapsedState: state => ({
        type:    types.SET_COLLAPSED_STATE,
        payload: state,
    }),

    emitError: error => ({
        type:    types.EMIT_ERROR,
        payload: error,
        error:   true,
    }),
});
