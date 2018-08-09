/**
 * Constants
 * */
export const moduleName = 'myTasksContainer';
const prefix = `cpb/${moduleName}`;
export const FETCH_MY_TASKS = `${prefix}/FETCH_MY_TASKS`;
export const FETCH_MY_TASKS_SUCCESS = `${prefix}/FETCH_MY_TASKS_SUCCESS`;
export const FETCH_MY_TASKS_FAILURE = `${prefix}/FETCH_MY_TASKS_FAILURE`;
export const ON_CHANGE_MY_TASKS_FORM = `${prefix}/ON_CHANGE_MY_TASKS_FORM`;


/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        filterDate:   { value: void 0, name: 'filterDate' },
        priority:     { value: void 0, name: 'priority' },
        responsible:  { value: void 0, name: 'responsible' },
        stationName:  { value: void 0, name: 'stationName' },
        deadlineDate: { value: void 0, name: 'deadlineDate' },
        deadlineTime: { value: void 0, name: 'deadlineTime' },
        comment:      { value: void 0, name: 'comment' },
    },
    myTasks:     null,
    modalStatus: '',
    taskId:      null,
    vehicle:     '',
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

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];


export const fetchMyTasks = () => ({
    type: FETCH_MY_TASKS,
});
export const fetchMyTasksSuccess = data => ({
    type:    FETCH_MY_TASKS_SUCCESS,
    payload: data,
});
export const fetchMyTasksFailure = data => ({
    type:    FETCH_MY_TASKS_FAILURE,
    payload: data,
});
