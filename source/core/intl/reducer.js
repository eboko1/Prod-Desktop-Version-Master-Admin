// Core
import types from './types';

const initialState = {
    locale:   '',
    messages: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.UPDATE_INTL_SUCCESS:
            return action.payload;

        default:
            return state;
    }
};
