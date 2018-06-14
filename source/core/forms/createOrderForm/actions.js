import types from './types';

export const swapiActions = Object.freeze({
    // fetchORDER
    fetchOrder: () => ({
        type: types.FETCH_ORDER,
    }),
    fetchOrderSuccess: swapi => ({
        type:    types.FETCH_ORDER_SUCCESS,
        payload: swapi,
    }),
    fetchOrderFail: error => ({
        type:    types.FETCH_ORDER_FAIL,
        payload: error,
        error:   true,
    }),
});
