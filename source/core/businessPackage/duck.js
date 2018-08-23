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
export const SET_FILTERS = `${prefix}/SET_FILTERS`;

export const IS_FETCHING_BUSINESSES = `${prefix}/IS_FETCHING_BUSINESSES`;
export const SET_BUSINESS_SEARCH_QUERY = `${prefix}/SET_BUSINESS_SEARCH_QUERY`;
export const FETCH_BUSINESSES = `${prefix}/FETCH_BUSINESSES`;
export const FETCH_BUSINESSES_SUCCESS = `${prefix}/FETCH_BUSINESSES_SUCCESS`;

export const SET_SHOW_CREATE_BUSINESS_PACKAGE_FORM = `${prefix}/SET_SHOW_CREATE_BUSINESS_PACKAGE_FORM`;
export const SET_SHOW_UPDATE_BUSINESS_PACKAGE_FORM = `${prefix}/SET_SHOW_UPDATE_BUSINESS_PACKAGE_FORM`;
export const HIDE_FORMS = `${prefix}/HIDE_FORMS`;

export const CREATE_BUSINESS_PACKAGE = `${prefix}/CREATE_BUSINESS_PACKAGE`;
export const UPDATE_BUSINESS_PACKAGE = `${prefix}/UPDATE_BUSINESS_PACKAGE`;

export const ADD_ERROR = `${prefix}/ADD_ERROR`;
export const HANDLE_ERROR = `${prefix}/HANDLE_ERROR`;
/**
 * Reducer
 * */

let errorId = 1;

const ReducerState = {
    showCreateBusinessPackageForm: false,
    errors:                        [],
    rolesPackages:                 [],
    businessPackage:               null,
    businessPackages:              [],
    businesses:                    [],
    isFetchingBusinesses:          false,
    filters:                       {
        businessId: null,
        packageId:  null,
    },
    count: 0,
    page:  1,
    sort:  {
        field: 'activationDatetime',
        order: 'desc',
    },
    businessSearchQuery: null,
};

/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_BUSINESSES_SUCCESS:
            return {
                ...state,
                businesses: payload,
            };

        case FETCH_BUSINESS_PACKAGES_SUCCESS:
            return {
                ...state,
                businessPackages: payload.businessPackages,
                rolesPackages:    payload.rolesPackages,
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

        case SET_FILTERS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    ...payload,
                },
            };

        case SET_BUSINESS_SEARCH_QUERY:
            return {
                ...state,
                businessSearchQuery: payload,
            };

        case IS_FETCHING_BUSINESSES:
            return {
                ...state,
                isFetchingBusinesses: payload,
            };

        case SET_SHOW_CREATE_BUSINESS_PACKAGE_FORM:
            return {
                ...state,
                showCreateBusinessPackageForm: payload,
                businessPackage:               null,
            };

        case SET_SHOW_UPDATE_BUSINESS_PACKAGE_FORM:
            return {
                ...state,
                businessPackage:               payload,
                showCreateBusinessPackageForm: false,
            };

        case HIDE_FORMS:
            return {
                ...state,
                showCreateBusinessPackageForm: false,
                businessPackage:               null,
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

export const setFilters = filters => ({
    type:    SET_FILTERS,
    payload: filters,
});

export const setBusinessSearchQuery = query => ({
    type:    SET_BUSINESS_SEARCH_QUERY,
    payload: query,
});

export const fetchBusinessesSuccess = businesses => ({
    type:    FETCH_BUSINESSES_SUCCESS,
    payload: businesses,
});

export const setIsFetchingBusinesses = isFetching => ({
    type:    IS_FETCHING_BUSINESSES,
    payload: isFetching,
});

export const setShowCreateBusinessPackageForm = show => ({
    type:    SET_SHOW_CREATE_BUSINESS_PACKAGE_FORM,
    payload: show,
});

export const setShowUpdateBusinessPackageForm = businessPackage => ({
    type:    SET_SHOW_UPDATE_BUSINESS_PACKAGE_FORM,
    payload: businessPackage,
});

export const createBusinessPackage = (
    businessId,
    packageId,
    datetimeRange,
) => ({
    type:    CREATE_BUSINESS_PACKAGE,
    payload: {
        businessId,
        packageId,
        datetimeRange,
    },
});

export const updateBusinessPackage = (businessPackageId, datetimeRange) => ({
    type:    UPDATE_BUSINESS_PACKAGE,
    payload: {
        businessPackageId,
        datetimeRange,
    },
});

export const hideForms = () => ({
    type: HIDE_FORMS,
});
