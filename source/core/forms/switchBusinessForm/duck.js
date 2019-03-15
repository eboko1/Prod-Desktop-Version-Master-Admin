/**
 * Constants
 * */
export const moduleName = 'switchBusinessForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_BUSINESSES = `${prefix}/FETCH_BUSINESSES`;
export const FETCH_BUSINESSES_SUCCESS = `${prefix}/FETCH_BUSINESSES_SUCCESS`;

export const SET_SEARCH_QUERY = `${prefix}/SET_SEARCH_QUERY`;
export const SET_BUSINESS = `${prefix}/SET_BUSINESS`;

export const ON_CHANGE_SWITCH_BUSINESS_FORM = `${prefix}/ON_CHANGE_SWITCH_BUSINESS_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    businesses:  [],
    searchQuery: null,
    fields:      {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_BUSINESSES_SUCCESS:
            return {
                ...state,
                businesses: payload,
            };

        case ON_CHANGE_SWITCH_BUSINESS_FORM: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };
        }
        default:
            return state;
    }
}

export const fetchBusinesses = query => ({
    type:    FETCH_BUSINESSES,
    payload: query,
});

export const fetchBusinessesSuccess = businesses => ({
    type:    FETCH_BUSINESSES_SUCCESS,
    payload: businesses,
});

export const setSearchQuery = query => ({
    type:    SET_SEARCH_QUERY,
    payload: { query },
});

export const setBusiness = (businessId) => ({
    type:    SET_BUSINESS,
    payload: businessId,
});

export const onChangeSwitchBusinessForm = payload => ({
    type: ON_CHANGE_SWITCH_BUSINESS_FORM,
    payload,
});
