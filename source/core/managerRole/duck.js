/**
 * Constants
 * */
export const moduleName = 'managerRole';
const prefix = `cpb/${moduleName}`;

export const FETCH_MANAGER_ROLES = `${prefix}/FETCH_MANAGER_ROLES`;
export const FETCH_MANAGER_ROLES_SUCCESS = `${prefix}/FETCH_MANAGER_ROLES_SUCCESS`;
export const FETCH_MANAGER_ROLES_ERROR = `${prefix}/FETCH_MANAGER_ROLES_ERROR`;

export const SET_PAGE = `${prefix}/SET_PAGE`;
export const SET_SORT = `${prefix}/SET_SORT`;
export const SET_FILTERS = `${prefix}/SET_FILTERS`;

export const SET_MANAGER_SEARCH_FILTER = `${prefix}/SET_MANAGER_SEARCH_FILTER`;

export const SET_SHOW_UPDATE_MANAGER_ROLE_FORM = `${prefix}/SET_SHOW_UPDATE_MANAGER_ROLE_FORM`;
export const HIDE_FORMS = `${prefix}/HIDE_FORMS`;

export const UPDATE_MANAGER_ROLE = `${prefix}/UPDATE_MANAGER_ROLE`;

export const ADD_ERROR = `${prefix}/ADD_ERROR`;
export const HANDLE_ERROR = `${prefix}/HANDLE_ERROR`;
/**
 * Reducer
 * */

let errorId = 1;

const ReducerState = {
    errors:       [],
    managerRole:  null,
    managerRoles: [],
    searchQuery:  null,

    filters: {
        businessId: null,
        search:     null,
    },
    count: 0,
    page:  1,
    sort:  {
        field: 'managerSurname',
        order: 'desc',
    },
};

/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_MANAGER_ROLES_SUCCESS:
            return {
                ...state,
                managerRoles: payload.managersRoles,
                count:        payload.stats.count,
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

        case SET_SHOW_UPDATE_MANAGER_ROLE_FORM:
            return {
                ...state,
                managerRole: payload,
            };

        case SET_MANAGER_SEARCH_FILTER:
            return {
                ...state,
                searchQuery: payload,
            };

        case HIDE_FORMS:
            return {
                ...state,
                managerRole: null,
            };

        default:
            return state;
    }
}

export const fetchManagerRoles = () => ({
    type: FETCH_MANAGER_ROLES,
});

export const fetchManagerRolesSuccess = data => ({
    type:    FETCH_MANAGER_ROLES_SUCCESS,
    payload: data,
});

export const fetchManagerRolesError = () => ({
    type: FETCH_MANAGER_ROLES_ERROR,
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

export const setSearchQuery = searchQuery => ({
    type:    SET_MANAGER_SEARCH_FILTER,
    payload: searchQuery,
});

export const setShowUpdateManagerRoleForm = businessPackage => ({
    type:    SET_SHOW_UPDATE_MANAGER_ROLE_FORM,
    payload: businessPackage,
});

export const updateManagerRole = (managerId, roleIds, businessId) => ({
    type:    UPDATE_MANAGER_ROLE,
    payload: {
        managerId,
        roleIds,
        businessId,
    },
});

export const hideForms = () => ({
    type: HIDE_FORMS,
});
