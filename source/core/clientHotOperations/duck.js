/**
 * Constants
 * */
export const moduleName = 'clientHotOperations';
const prefix = `cpb/${moduleName}`;

export const FETCH_CLIENTS = `${prefix}/FETCH_CLIENTS`;
export const FETCH_CLIENTS_SUCCESS = `${prefix}/FETCH_CLIENTS_SUCCESS`;

export const SET_FILTERS_SEARCH_QUERY = `${prefix}/SET_FILTERS_SEARCH_QUERY`;

export const SET_CLIENTS_FETCHING = `${prefix}/SET_CLIENTS_FETCHING`;
export const SET_SORT_PAGE = `${prefix}/SET_SORT_PAGE`;

/**
 * Reducer
 * */

const ReducerState = {
    clients: [],
    clientsFetching: false, 
    stats: {
        countCliens: undefined,
    },
    filters: {
        query: undefined,
    },
    sort: {
        page: 1
    }
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {

        case FETCH_CLIENTS_SUCCESS:
            const {clients, stats} = payload;
            return {
                ...state,
                clients: clients,
                stats: stats
            };

        case SET_FILTERS_SEARCH_QUERY:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    query: payload
                }
            };

        case SET_CLIENTS_FETCHING:
            return {
                ...state,
                clientsFetching: payload
            };

        case SET_SORT_PAGE:
            return {
                ...state,
                sort: {
                    ...state.sort,
                    page: payload
                }
            };

        default:
            return state;
    }
}

//Selectors
export const selectFilters = state => state[moduleName].filters;
export const selectSort = state => state[moduleName].sort;

//Actions:
export const fetchClients = () => ({
    type: FETCH_CLIENTS
});

export const fetchClientsSuccess = ({clients, stats}) => ({
    type: FETCH_CLIENTS_SUCCESS,
    payload: {clients, stats}
});

export const setFiltersSearchQuery = (query) => {
    return function(dispatch) {
        dispatch({
            type: SET_FILTERS_SEARCH_QUERY,
            payload: query
        });

        return dispatch(fetchClients());
    }
};

export const setSortPage = (page) => {
    return function(dispatch) {
        dispatch({
            type: SET_SORT_PAGE,
            payload: page
        });

        return dispatch(fetchClients());
    }
};

export const setClientsFetching = (clientsFetching) => ({
    type: SET_CLIENTS_FETCHING,
    payload: clientsFetching
});