/**
 * Constants
 * */
export const moduleName = 'calls';
const prefix = `cpb/${moduleName}`;

export const FETCH_CALLS = `${prefix}/FETCH_CALLS`;
export const FETCH_CALLS_SUCCESS = `${prefix}/FETCH_CALLS_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    calls:  {},
    filter: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CALLS_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        default:
            return state;
    }
}

/**
 * Actions
 * */

export const fetchCalls = filter => ({
    type:    FETCH_CALLS,
    payload: filter,
});

export const fetchCallsSuccess = data => ({
    type:    FETCH_CALLS_SUCCESS,
    payload: data,
});
