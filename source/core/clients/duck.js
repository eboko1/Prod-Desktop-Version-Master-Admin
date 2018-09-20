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

export const SET_INVITE = `${prefix}/SET_INVITE`;
export const CREATE_INVITE = `${prefix}/CREATE_INVITE`;

export const SET_SEARCH_QUERY = `${prefix}/SET_SEARCH_QUERY`;

/**
 * Reducer
 * */
const ReducerState = {
    stats:           {},
    clients:         [],
    filter:          {},
    sort:            { page: 1, order: 'asc' },
    searchQuery:     '',
    universalFilter: {},
    invite:          {
        client:          null,
        clientVehicleId: null,
    },
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

        case SET_UNIVERSAL_FILTERS:
            return {
                ...state,
                universalFilter: {
                    ...payload,
                },
                sort: {
                    ...state.filter,
                    page:  1,
                    order: 'asc',
                },
            };

        case SET_INVITE:
            return {
                ...state,
                invite: payload,
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

        case SET_SEARCH_QUERY:
            return {
                ...state,
                searchQuery: payload,
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
export const selectFilter = ({
    clients: { filter, sort, universalFilter },
}) => ({
    filter,
    sort,
    universalFilter,
});

/**
 * Action Creators
 * */

export const setInvite = (client, clientVehicleId) => ({
    type:    SET_INVITE,
    payload: { client, clientVehicleId },
});

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

export const createInvite = invite => ({
    type:    CREATE_INVITE,
    payload: invite,
});

// Universal Filters
export const setUniversalFilters = universalFilters => ({
    type:    SET_UNIVERSAL_FILTERS,
    payload: universalFilters,
});

export const setSearchQuery = searchQuery => ({
    type:    SET_SEARCH_QUERY,
    payload: searchQuery,
});
