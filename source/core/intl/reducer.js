// Core
import types from './types';

// Proj
import { intl } from 'store/intl';

const initialState = {
    locale:   intl.locale,
    messages: intl.messages,
};

export default (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case types.INIT_INTL_SUCCESS:
            return payload;

        case types.UPDATE_INTL_SUCCESS:
            return payload;

        default:
            return state;
    }
};
