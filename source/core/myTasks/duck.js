/**
 * Constants
 * */
export const moduleName = 'myTasksContainer';
const prefix = `cpb/${moduleName}`;
export const FETCH_MY_TASKS = `${prefix}/FETCH_MY_TASKS`;
export const FETCH_MY_TASKS_SUCCESS = `${prefix}/FETCH_MY_TASKS_SUCCESS`;
export const FETCH_MY_TASKS_FAILURE = `${prefix}/FETCH_MY_TASKS_FAILURE`;
export const ON_CHANGE_MY_TASKS_FORM = `${prefix}/ON_CHANGE_MY_TASKS_FORM`;
export const GET_ACTIVE_ORDER = `${prefix}/GET_ACTIVE_ORDER`;
export const SET_CURRENT_PAGE = `${prefix}/SET_CURRENT_PAGE`;
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
        case SET_CURRENT_PAGE:
            return {
                ...state,
                page: payload,
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

export const fetchMyTasksFailure = data => ({
    type:    FETCH_MY_TASKS_FAILURE,
    payload: data,
});

export const getActiveOrder = id => ({
    type:    GET_ACTIVE_ORDER,
    payload: id,
});
export const setPage = page => ({
    type:    SET_CURRENT_PAGE,
    payload: page,
});
