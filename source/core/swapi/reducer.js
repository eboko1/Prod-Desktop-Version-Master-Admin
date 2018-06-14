import types from './types';
import { List, fromJS } from 'immutable';

const initialState = List([]);

export default (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_SWAPI_SUCCESS:
            return fromJS(action.payload);

        default:
            return state;
    }
};
