// Core
import types from './types';

export const intlActions = Object.freeze({
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
