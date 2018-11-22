import _ from 'lodash';

/**
 * Constants
 * */

export const moduleName = 'spreadBusinessBrandsForm';
const prefix = `cpb/${moduleName}`;

export const SEARCH_BUSINESSES = `${prefix}/SEARCH_BUSINESSES`;
export const SEARCH_BUSINESSES_SUCCESS = `${prefix}/SEARCH_BUSINESSES_SUCCESS`;

export const ON_CHANGE_SPREAD_BUSINESSES_BRANDS_FORM = `${prefix}/ON_CHANGE_SPREAD_BUSINESSES_BRANDS_FORM`;

export const SUBMIT_SPREAD_BUSINESS_BRANDS = `${prefix}/SUBMIT_SPREAD_BUSINESS_BRANDS`;
export const SUBMIT_SPREAD_BUSINESS_BRANDS_SUCCESS = `${prefix}/SUBMIT_SPREAD_BUSINESS_BRANDS_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
    search: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_SPREAD_BUSINESSES_BRANDS_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case SEARCH_BUSINESSES_SUCCESS:
            return {
                ...state,
                search: {
                    ...state.search,
                    [ payload.id ]: payload.data,
                },
            };

        case SUBMIT_SPREAD_BUSINESS_BRANDS_SUCCESS:
            return {
                ...state,
                fields: {},
                search: {},
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];

/**
 * Action Creators
 * */

export const searchBusinesses = (id, query) => ({
    type:    SEARCH_BUSINESSES,
    payload: { id, query },
});

export const searchBusinessesSuccess = (id, data) => ({
    type:    SEARCH_BUSINESSES_SUCCESS,
    payload: { id, data },
});

export const submitSpreadBusinessBrands = (businessId, businessIds) => ({
    type:    SUBMIT_SPREAD_BUSINESS_BRANDS,
    payload: { businessId, businessIds },
});

export const submitSpreadBusinessBrandsSuccess = () => ({
    type: SUBMIT_SPREAD_BUSINESS_BRANDS_SUCCESS,
});

export const onChangeSpreadBusinessBrandsForm = fields => ({
    type:    ON_CHANGE_SPREAD_BUSINESSES_BRANDS_FORM,
    payload: fields,
});
