// Core
import types from './types';

export const intlActions = Object.freeze({
    initIntl: intl => ({
        type:    types.INIT_INTL,
        payload: intl,
    }),
    initIntlSuccess: intl => ({
        type:    types.INIT_INTL_SUCCESS,
        payload: intl,
    }),
    fetchLocaleContent: () => ({
        type: types.FETCH_LOCALE_CONTENT,
    }),
    updateIntl: intl => ({
        type:    types.UPDATE_INTL,
        payload: intl,
    }),
    updateIntlSuccess: intl => ({
        type:    types.UPDATE_INTL_SUCCESS,
        payload: intl,
    }),
    updateIntlFail: error => ({
        type:    types.UPDATE_INTL_FAIL,
        payload: error,
        error:   true,
    }),
});
