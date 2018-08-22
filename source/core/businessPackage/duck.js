/**
 * Constants
 * */
export const moduleName = 'businessPackage';
const prefix = `cpb/${moduleName}`;

export const FETCH_BUSINESS_PACKAGES = `${prefix}/FETCH_BUSINESS_PACKAGES`;
export const FETCH_BUSINESS_PACKAGES_SUCCESS = `${prefix}/FETCH_BUSINESS_PACKAGES_SUCCESS`;
export const FETCH_BUSINESS_PACKAGES_ERROR = `${prefix}/FETCH_BUSINESS_PACKAGES_ERROR`;

export const SET_PAGE = `${prefix}/SET_PAGE`;
export const SET_SORT = `${prefix}/SET_SORT`;

export const ADD_ERROR = `${prefix}/ADD_ERROR`;
export const HANDLE_ERROR = `${prefix}/HANDLE_ERROR`;
/**
 * Reducer
 * */

let errorId = 1;

const ReducerState = {
    errors:           [],
    businessPackages: [],
    count:            0,
    page:             1,
    sort:             {
        field: 'activationDatetime',
        order: 'desc',
    },
};

/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_BUSINESS_PACKAGES_SUCCESS:
            return {
                ...state,
                businessPackages: payload.businessPackages,
                count:            payload.stats.count,
            };

        case ADD_ERROR:
            return {
                ...state,
                errors: [ ...state.errors, { id: errorId++, ...payload }],
            };

        case HANDLE_ERROR:
            return {
                ...state,
                errors: state.errors.filter(({ id }) => id !== payload),
            };

        case SET_PAGE:
            return {
                ...state,
                page: payload,
            };

        case SET_SORT:
            return {
                ...state,
                sort: payload,
            };

        default:
            return state;
    }
}

export const fetchBusinessPackages = () => ({
    type: FETCH_BUSINESS_PACKAGES,
});

export const fetchBusinessPackagesSuccess = data => ({
    type:    FETCH_BUSINESS_PACKAGES_SUCCESS,
    payload: data,
});

export const fetchBusinessPackagesError = () => ({
    type: FETCH_BUSINESS_PACKAGES_ERROR,
});

export const setPage = page => ({
    type:    SET_PAGE,
    payload: page,
});

export const setSort = sort => ({
    type:    SET_SORT,
    payload: sort,
});

export const addError = error => ({
    type:    ADD_ERROR,
    payload: error,
    error:   true,
});

export const handleError = id => ({
    type:    HANDLE_ERROR,
    payload: id,
});
