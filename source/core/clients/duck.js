import { v4 } from 'uuid';

/**
 * Constants
 * */
export const moduleName = 'CLIENTS';
const prefix = `cpb/${moduleName}`;

export const FETCH_CLIENTS = `${prefix}/FETCH_CLIENTS`;
export const FETCH_CLIENTS_SUCCESS = `${prefix}/FETCH_CLIENTS_SUCCESS`;

export const FETCH_CLIENTS_STATS = `${prefix}/FETCH_CLIENTS_STATS`;
export const FETCH_CLIENTS_STATS_SUCCESS = `${prefix}/FETCH_CLIENTS_STATS_SUCCESS`;
// filters
export const SET_CLIENTS_PAGE_FILTER = `${prefix}/SET_CLIENTS_PAGE_FILTER`;
export const SET_CLIENTS_SEARCH_FILTER = `${prefix}/SET_CLIENTS_SEARCH_FILTER`;
// universal UniversalFilters
export const FETCH_STATS_COUNTS_PANEL = `${prefix}/FETCH_STATS_COUNTS_PANEL`;
export const FETCH_STATS_COUNTS_PANEL_SUCCESS = `${prefix}/FETCH_STATS_COUNTS_PANEL_SUCCESS`;
export const SET_UNIVERSAL_FILTERS = `${prefix}/SET_UNIVERSAL_FILTERS`;

export const INVITE_CLIENTS = `${prefix}/INVITE_CLIENTS`;
export const INVITE_CLIENTS_SUCCESS = `${prefix}/INVITE_CLIENTS_SUCCESS`;

export const SET_CLIENTS_PAGE_SORT = `${prefix}/SET_CLIENTS_PAGE_SORT`;
/**
 * Reducer
 * */
const ReducerState = {
    stats:  {},
    data:   [],
    filter: {
        page:  1,
        query: '',
    },
    statsCountsPanel: {
        stats: {},
    },
};
// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CLIENTS_SUCCESS:
            return {
                ...state,
                count: payload.count,
                data:  payload.CLIENTS.map(client =>
                    Object.assign({ ...client }, { key: v4() })),
            };

        case FETCH_CLIENTS_STATS_SUCCESS:
            return {
                ...state,
                stats: payload,
            };

        case SET_CLIENTS_PAGE_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page: payload,
                },
            };

        case SET_CLIENTS_PAGE_SORT:
            return {
                ...state,
                sort: payload,
            };

        case SET_CLIENTS_SEARCH_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page:  1,
                    query: payload,
                },
            };

        case SET_UNIVERSAL_FILTERS:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page: 1,
                    ...payload,
                },
            };

        case FETCH_STATS_COUNTS_PANEL_SUCCESS:
            return {
                ...state,
                statsCountsPanel: {
                    stats: payload,
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

export const fetchClientsStats = (filters = {}) => ({
    type:    FETCH_CLIENTS_STATS,
    payload: filters,
});

export const fetchClientsStatsSuccess = stats => ({
    type:    FETCH_CLIENTS_STATS_SUCCESS,
    payload: stats,
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
export const setClientsPageFilter = pageFilter => ({
    type:    SET_CLIENTS_PAGE_FILTER,
    payload: pageFilter,
});

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

// StatsCountsPanel
export const fetchStatsCounts = () => ({
    type: FETCH_STATS_COUNTS_PANEL,
});

export const fetchStatsCountsSuccess = stats => ({
    type:    FETCH_STATS_COUNTS_PANEL_SUCCESS,
    payload: stats,
});
