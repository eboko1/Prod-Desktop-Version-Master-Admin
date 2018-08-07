/**
 * Constants
 * */
export const moduleName = 'orderTaskForm';
const prefix = `cpb/${moduleName}`;
import moment from 'moment'
export const ON_CHANGE_ORDER_TASKS_FORM = `${prefix}/ON_CHANGE_ORDER_TASKS_FORM`;
export const INIT_ORDER_TASKS_FORM = `${prefix}/INIT_ORDER_TASKS_FORM`;
export const RESET_ORDER_TASKS_FORM = `${prefix}/RESET_ORDER_TASKS_FORM`;
export const SAVE_ORDER_TASK = `${prefix}/SAVE_ORDER_TASK`;
export const SAVE_ORDER_TASK_SUCCESS = `${prefix}/SAVE_ORDER_TASK_SUCCESS`;
export const SAVE_ORDER_TASK_FAILURE = `${prefix}/SAVE_ORDER_TASK_FAILURE`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        status:       { value: void 0, name: 'status' },
        priority:     { value: void 0, name: 'priority' },
        responsible:  { value: void 0, name: 'responsible' },
        stationName:  { value: void 0, name: 'stationName' },
        deadlineDate: { value: void 0, name: 'deadlineDate' },
        comment:      { value: void 0, name: 'comment' },
    },
    progressStatusOptions: [],
    priorityOptions:       [],
    responsibleOptions:    [],
    stationNameOptions:    [],
    
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_ORDER_TASKS_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };
        case INIT_ORDER_TASKS_FORM:
            return {
                ...state,
                fields: {
                    status:       { value: payload.status, name: 'status', dirty: false, touched: true },
                    priority:     { value: payload.priority, name: 'priority', dirty: false, touched: true},
                    responsible:  { value: payload.responsible, name: 'responsible', dirty: false, touched: true },
                    stationName:  { value: payload.stationName, name: 'stationName', dirty: false, touched: true},
                    deadlineDate: { value: moment(payload.deadlineDate), name: 'deadlineDate', dirty: false, touched: true},
                    comment:      { value: payload.comment, name: 'comment', dirty: false, touched: true},
                },
            };
        case RESET_ORDER_TASKS_FORM:
            return ReducerState
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

export const onChangeOrderTasksForm = update => ({
    type:    ON_CHANGE_ORDER_TASKS_FORM,
    payload: update,
});
export const initOrderTasksForm = data => ({
    type:    INIT_ORDER_TASKS_FORM,
    payload: data,
});
export const resetOrderTasksForm = () => ({
    type: RESET_ORDER_TASKS_FORM,
});
export const saveOrderTask = (data, id) => ({
    type:    SAVE_ORDER_TASK,
    payload: data,
    id:      id,
});
export const saveOrderTaskSuccess = data => ({
    type:    SAVE_ORDER_TASK_SUCCESS,
    payload: data,
});
export const saveOrderTaskFailure = data => ({
    type:    SAVE_ORDER_TASK_FAILURE,
    payload: data,
});
