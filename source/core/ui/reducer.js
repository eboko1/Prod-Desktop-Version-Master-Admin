import types from './types';
import { Map } from 'immutable';

const initialState = Map({
    swapiFetching:  false,
    initialized:    false,
    // online:        false,
    authFetching:   false,
    ordersFetching: false,
    orderFetching:  false,
    collapsed:      false,
    error:          null,
});

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_SWAPI_FETCHING_STATE:
            return state.set('swapiFetching', action.payload);

        case types.INITIALIZE:
            return state.set('initialized', true);

        // case types.SET_ONLINE_STATUS:
        //     return state.set('online', action.payload);
        //
        case types.SET_AUTH_FETCHING_STATE:
            return state.set('authFetching', action.payload);

        case types.SET_ORDERS_FETCHING_STATE:
            return state.set('ordersFetching', action.payload);

        case types.SET_ORDER_FETCHING_STATE:
            return state.set('orderFetching', action.payload);

        case types.SET_COLLAPSED_STATE:
            return state.set('collapsed', action.payload);

        case types.EMIT_ERROR:
            return state.set('error', action.payload);

        default:
            return state;
    }
};
