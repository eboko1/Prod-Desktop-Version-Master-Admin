/**
 * Constants
 **/
export const moduleName = 'subscription';
const prefix = `GLOBAL/${moduleName}`;

export const FETCH_HEADER_DATA = `${prefix}/FETCH_HEADER_DATA`;
export const FETCH_HEADER_DATA_SUCCESS = `${prefix}/FETCH_HEADER_DATA_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    header: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_HEADER_DATA_SUCCESS:
            return { ...state, header: { ...payload } };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

/**
 * Action Creators
 **/

export const fetchHeaderData = () => ({
    type: FETCH_HEADER_DATA,
});

export const fetchHeaderDataSuccess = payload => ({
    type: FETCH_HEADER_DATA_SUCCESS,
    payload,
});
