// import { v4 } from 'uuid';

/**
 * Constants
 * */
export const moduleName = 'clients';
const prefix = `cpb/${moduleName}`;

export const FETCH_CLIENTS = `${prefix}/FETCH_CLIENTS`;
export const FETCH_CLIENTS_SUCCESS = `${prefix}/FETCH_CLIENTS_SUCCESS`;
// filters
export const SET_CLIENTS_PAGE_SORT = `${prefix}/SET_CLIENTS_PAGE_SORT`;
export const SET_CLIENTS_SEARCH_FILTER = `${prefix}/SET_CLIENTS_SEARCH_FILTER`;
// universal UniversalFilters
export const SET_UNIVERSAL_FILTERS = `${prefix}/SET_UNIVERSAL_FILTERS`;

export const INVITE_CLIENTS = `${prefix}/INVITE_CLIENTS`;
export const INVITE_CLIENTS_SUCCESS = `${prefix}/INVITE_CLIENTS_SUCCESS`;

/**
 * Reducer
 * */
const ReducerState = {
    stats:   {},
    clients: [],
    filter:  {},
    sort:    { page: 1, order: 'asc' },
};
// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CLIENTS_SUCCESS:
            return {
                ...state,
                ...payload,
                // clients: payload.CLIENTS.map(client =>
                //     Object.assign({ ...client }, { key: v4() })),
            };

        case SET_CLIENTS_PAGE_SORT:
            return {
                ...state,
                sort: {
                    ...state.sort,
                    ...payload,
                },
            };

        case SET_CLIENTS_SEARCH_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    query: payload,
                },
            };

        case SET_UNIVERSAL_FILTERS:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    ...payload,
                },
            };

        case INVITE_CLIENTS_SUCCESS:
            return {
                ...state,
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];
export const selectFilter = ({ clients: { filter, sort } }) => ({
    filter,
    sort,
});

/**
 * Action Creators
 * */

export const fetchClients = filter => ({
    type:    FETCH_CLIENTS,
    payload: filter,
});

export const fetchClientsSuccess = clients => ({
    type:    FETCH_CLIENTS_SUCCESS,
    payload: clients,
});

export const inviteClients = inviteCLIENTSPayload => ({
    type:    INVITE_CLIENTS,
    payload: inviteCLIENTSPayload,
});

export const inviteClientsSuccess = response => ({
    type:    INVITE_CLIENTS_SUCCESS,
    payload: response,
});

// Filter
export const setClientsPageSort = sort => ({
    type:    SET_CLIENTS_PAGE_SORT,
    payload: sort,
});

export const setClientsSearchFilter = searchFilter => ({
    type:    SET_CLIENTS_SEARCH_FILTER,
    payload: searchFilter,
});

// Universal Filters
export const setUniversalFilters = universalFilters => ({
    type:    SET_UNIVERSAL_FILTERS,
    payload: universalFilters,
});
