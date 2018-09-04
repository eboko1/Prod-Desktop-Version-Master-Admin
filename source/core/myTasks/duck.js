/**
 * Constants
 * */
export const moduleName = 'myTasksContainer';
const prefix = `cpb/${moduleName}`;

export const FETCH_MY_TASKS = `${prefix}/FETCH_MY_TASKS`;
export const FETCH_MY_TASKS_SUCCESS = `${prefix}/FETCH_MY_TASKS_SUCCESS`;

export const ON_CHANGE_MY_TASKS_FORM = `${prefix}/ON_CHANGE_MY_TASKS_FORM`;
export const GET_ACTIVE_ORDER = `${prefix}/GET_ACTIVE_ORDER`;
export const GET_ACTIVE_VEHICLE = `${prefix}/GET_ACTIVE_VEHICLE`;
export const SET_CURRENT_PAGE = `${prefix}/SET_CURRENT_PAGE`;
export const RESET_DATA = `${prefix}/RESET_DATA`;
export const SET_MY_TASKS_DATERANGE_FILTER = `${prefix}/SET_MY_TASKS_DATERANGE_FILTER`;
export const SET_MY_TASKS_SEARCH_FILTER = `${prefix}/SET_MY_TASKS_SEARCH_FILTER`;
export const SET_MY_TASKS_STATUS_FILTER = `${prefix}/SET_MY_TASKS_STATUS_FILTER`;
export const SET_MY_TASKS_SORT_FIELD_FILTER = `${prefix}/SET_MY_TASKS_SORT_FIELD_FILTER`;
export const SET_MY_TASKS_SORT_ORDER_FILTER = `${prefix}/SET_MY_TASKS_SORT_ORDER_FILTER`;





/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        filterDate: { value: void 0, name: 'filterDate' },
    },
    myTasks:     null,
    activeOrder: null,
    page:        1,
    vehicle:     null,
    filters:     {
        page:      1,
        status:    'active',
        query:     '',
        daterange: {},
        sortField: void 0,
        sortOrder: void 0,
    },
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_MY_TASKS_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };
        case FETCH_MY_TASKS_SUCCESS:
            return {
                ...state,
                myTasks: payload,
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
                    ...state, 
                    page: payload},
            };
        case SET_MY_TASKS_DATERANGE_FILTER:
            return {
                ...state,
                filters: {
                    ...state,
                    daterange: payload,
                },
            };
        case SET_MY_TASKS_SEARCH_FILTER:
            return {
                ...state,
                filters: {
                    ...state,
                    query: payload,
                },
            };
        case SET_MY_TASKS_STATUS_FILTER:
            return {
                ...state,
                filters: {
                    ...state,
                    status: payload,
                },
            };
        case SET_MY_TASKS_SORT_ORDER_FILTER:
            return {
                ...state,
                filters: {
                    ...state,
                    sortOrder: payload,
                },
            };
        case SET_MY_TASKS_SORT_FIELD_FILTER:
            return {
                ...state,
                filters: {
                    ...state,
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

export const fetchMyTasks = page => ({
    type:    FETCH_MY_TASKS,
    payload: page,
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
export const setMyTasksDaterangeFilter = (range) => ({
    type:    SET_MY_TASKS_DATERANGE_FILTER,
    payload: range,
});
export const setMyTasksSearchFilter = (update) => ({
    type:    SET_MY_TASKS_SEARCH_FILTER,
    payload: update,
});
export const setMyTasksStatusFilter = (update) => ({
    type:    SET_MY_TASKS_STATUS_FILTER,
    payload: update,
});
export const setMyTasksSortFieldFilter = (update) => ({
    type:    SET_MY_TASKS_SORT_FIELD_FILTER,
    payload: update,
});
export const setMyTasksSortOrderFilter = (update) => ({
    type:    SET_MY_TASKS_SORT_ORDER_FILTER,
    payload: update,
});
