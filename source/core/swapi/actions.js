import types from './types';

export const swapiActions = Object.freeze({
    // fetchSWAPI
    fetchSwapi: () => ({
        type: types.FETCH_SWAPI,
    }),
    fetchSwapiSuccess: swapi => ({
        type:    types.FETCH_SWAPI_SUCCESS,
        payload: swapi,
    }),
    fetchSwapiFail: error => ({
        type:    types.FETCH_SWAPI_FAIL,
        payload: error,
        error:   true,
    }),
});
