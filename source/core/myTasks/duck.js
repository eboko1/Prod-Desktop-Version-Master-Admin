/**
 * Constants
 * */
export const moduleName = 'myTasks';
const prefix = `cpb/${moduleName}`;

export const FETCH_MY_TASKS = `${prefix}/FETCH_MY_TASKS`;
export const FETCH_MY_TASKS_SUCCESS = `${prefix}/FETCH_MY_TASKS_SUCCESS`;

export const GET_ACTIVE_ORDER = `${prefix}/GET_ACTIVE_ORDER`;
export const GET_ACTIVE_VEHICLE = `${prefix}/GET_ACTIVE_VEHICLE`;
export const SET_CURRENT_PAGE = `${prefix}/SET_CURRENT_PAGE`;
export const RESET_DATA = `${prefix}/RESET_DATA`;
export const SET_MY_TASKS_DATERANGE_FILTER = `${prefix}/SET_MY_TASKS_DATERANGE_FILTER`;
export const SET_MY_TASKS_SEARCH_FILTER = `${prefix}/SET_MY_TASKS_SEARCH_FILTER`;
export const SET_MY_TASKS_STATUS_FILTER = `${prefix}/SET_MY_TASKS_STATUS_FILTER`;
export const SET_MY_TASKS_SORT_FIELD_FILTER = `${prefix}/SET_MY_TASKS_SORT_FIELD_FILTER`;
export const SET_MY_TASKS_SORT_ORDER_FILTER = `${prefix}/SET_MY_TASKS_SORT_ORDER_FILTER`;

export const SET_MANAGER = `${prefix}/SET_MANAGER`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        filterDate: { value: void 0, name: 'filterDate' },
    },
    myTasks:     null,
    activeOrder: null,
    managerId:   void 0,
    page:        1,
    vehicle:     null,
    filters:     {
        page:      1,
        status:    'active',
        query:     '',
        daterange: { startDate: '', endDate: '' },
        sortField: 'startDate',
        sortOrder: 'asc',
    },
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_MY_TASKS_SUCCESS:
            return {
                ...state,
                myTasks: payload,
            };

        case SET_MANAGER:
            return {
                ...state,
                managerId: payload,
            };

        case GET_ACTIVE_ORDER:
            return {
                ...state,
                activeOrder: payload,
            };

        case GET_ACTIVE_VEHICLE:
            return {
                ...state,
                vehicle: payload,
            };
        case SET_CURRENT_PAGE:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    page: payload,
                },
            };

        case SET_MY_TASKS_DATERANGE_FILTER:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    daterange: payload,
                },
            };

        case SET_MY_TASKS_SEARCH_FILTER:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    query: payload,
                },
            };

        case SET_MY_TASKS_STATUS_FILTER:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    status: payload,
                },
            };

        case SET_MY_TASKS_SORT_ORDER_FILTER:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    sortOrder: payload,
                },
            };

        case SET_MY_TASKS_SORT_FIELD_FILTER:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    sortField: payload,
                },
            };

        case RESET_DATA:
            return {
                ...state,
                activeOrder: null,
                vehicle:     null,
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

export const setManager = managerId => ({
    type:    SET_MANAGER,
    payload: managerId,
});

export const fetchMyTasks = (filter, firstLoading) => ({
    type:    FETCH_MY_TASKS,
    payload: {filter, firstLoading},
});

export const fetchMyTasksSuccess = data => ({
    type:    FETCH_MY_TASKS_SUCCESS,
    payload: data,
});

export const getActiveOrder = id => ({
    type:    GET_ACTIVE_ORDER,
    payload: id,
});
export const getActiveVehicle = vehicle => ({
    type:    GET_ACTIVE_VEHICLE,
    payload: vehicle,
});
export const setPage = page => ({
    type:    SET_CURRENT_PAGE,
    payload: page,
});
export const resetData = () => ({
    type: RESET_DATA,
});
export const setMyTasksDaterangeFilter = range => ({
    type:    SET_MY_TASKS_DATERANGE_FILTER,
    payload: range,
});
export const setMyTasksSearchFilter = update => ({
    type:    SET_MY_TASKS_SEARCH_FILTER,
    payload: update,
});
export const setMyTasksStatusFilter = update => ({
    type:    SET_MY_TASKS_STATUS_FILTER,
    payload: update,
});
export const setMyTasksSortFieldFilter = update => ({
    type:    SET_MY_TASKS_SORT_FIELD_FILTER,
    payload: update,
});
export const setMyTasksSortOrderFilter = update => ({
    type:    SET_MY_TASKS_SORT_ORDER_FILTER,
    payload: update,
});
