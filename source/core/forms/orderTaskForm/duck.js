/**
 * Constants
 * */
export const moduleName = 'orderTaskForm';
const prefix = `cpb/${moduleName}`;
import moment from 'moment';
export const ON_CHANGE_ORDER_TASKS_FORM = `${prefix}/ON_CHANGE_ORDER_TASKS_FORM`;
export const INIT_ORDER_TASKS_FORM = `${prefix}/INIT_ORDER_TASKS_FORM`;
export const RESET_ORDER_TASKS_FORM = `${prefix}/RESET_ORDER_TASKS_FORM`;
export const SAVE_ORDER_TASK = `${prefix}/SAVE_ORDER_TASK`;
export const SAVE_ORDER_TASK_SUCCESS = `${prefix}/SAVE_ORDER_TASK_SUCCESS`;
export const SAVE_ORDER_TASK_FAILURE = `${prefix}/SAVE_ORDER_TASK_FAILURE`;
export const CHANGE_MODAL_STATUS = `${prefix}/CHANGE_MODAL_STATUS`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
    initialOrderTask:      null,
    progressStatusOptions: [
        {
            value: 'Звонок',
            id:    'CALL',
        },
        {
            value: 'Калькуляция',
            id:    'CALCULATION',
        },
        {
            value: 'Согласование',
            id:    'WAITING_FOR_APPROVE',
        },
        {
            value: 'Ожидание заезда',
            id:    'APPROVED',
        },
        {
            value: 'Приемка',
            id:    'RECEPTION',
        },
        {
            value: 'Диагностика',
            id:    'DIAGNOSTICS',
        },
        {
            value: 'Ожидание ремонта',
            id:    'WAITING_REPAIR',
        },
        {
            value: 'Ожидание з/ч',
            id:    'WAITING_FOR_PARTS',
        },
        {
            value: 'Ремонт',
            id:    'REPAIR',
        },
        {
            value: 'Выдача',
            id:    'COMPLETED',
        },
        {
            value: 'Закрыто',
            id:    'CLOSED',
        },
        {
            value: 'Другое',
            id:    'OTHER',
        },
    ],
    priorityOptions: [
        {
            value: 'Низкий',
            id:    'LOW',
        },
        {
            value: 'Норм',
            id:    'NORMAL',
        },
        {
            value: 'Высокий',
            id:    'HIGH',
        },
        {
            value: 'Супер высокий',
            id:    'CRITICAL',
        },
    ],

    modalStatus: '',
    taskId:      null,
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

        case CHANGE_MODAL_STATUS:
            return {
                ...state,
                modalStatus: action.payload,
            };

        case INIT_ORDER_TASKS_FORM:
            return {
                ...state,
                fields: {},
                taskId:           payload.id,
                initialOrderTask: payload,
            };

        case RESET_ORDER_TASKS_FORM:
            return ReducerState;

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
export const saveOrderTask = (data, id, taskId, myTasks) => ({
    type:    SAVE_ORDER_TASK,
    payload: data,
    id:      id,
    taskId:  taskId,
    myTasks: myTasks,
});
export const saveOrderTaskSuccess = data => ({
    type:    SAVE_ORDER_TASK_SUCCESS,
    payload: data,
});
export const saveOrderTaskFailure = data => ({
    type:    SAVE_ORDER_TASK_FAILURE,
    payload: data,
});
export const changeModalStatus = status => ({
    type:    CHANGE_MODAL_STATUS,
    payload: status,
});
