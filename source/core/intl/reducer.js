// Core
import types from './types';

// Proj
import { intl } from 'store/intl';

const initialState = {
    locale:   intl.locale,
    messages: intl.messages,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.INIT_INTL_SUCCESS:
            return action.payload;

        case types.UPDATE_INTL_SUCCESS:
            return action.payload;

        default:
            return state;
    }
};
