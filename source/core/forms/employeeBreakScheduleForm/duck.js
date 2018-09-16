/**
 * Constants
 * */
export const moduleName = 'employee';
const prefix = `cpb/${moduleName}`;

export const FETCH_EMPLOYEE_BREAK_SCHEDULE = `${prefix}/FETCH_EMPLOYEE_BREAK_SCHEDULE`;
export const FETCH_EMPLOYEE_BREAK_SCHEDULE_SUCCESS = `${prefix}/FETCH_EMPLOYEE_BREAK_SCHEDULE_SUCCESS`;

export const SAVE_EMPLOYEE_BREAK_SCHEDULE = `${prefix}/SAVE_EMPLOYEE_BREAK_SCHEDULE`;
export const SAVE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS = `${prefix}/SAVE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS`;
export const DELETE_EMPLOYEE_BREAK_SCHEDULE = `${prefix}/DELETE_EMPLOYEE_BREAK_SCHEDULE`;
export const DELETE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS = `${prefix}/DELETE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS`;

export const ON_CHANGE_EMPLOYEE_BREAK_SCHEDULE_FORM = `${prefix}/ON_CHANGE_EMPLOYEE_BREAK_SCHEDULE_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
    employeeSchedule: null,
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_EMPLOYEE_BREAK_SCHEDULE_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };
        case FETCH_EMPLOYEE_BREAK_SCHEDULE:
            return {
                ...state,
                employeeSchedule: null,
            };
        case FETCH_EMPLOYEE_BREAK_SCHEDULE_SUCCESS:
            return {
                ...state,
                employeeSchedule: payload,
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

export const fetchEmployeeBreakSchedule = id => ({
    type:    FETCH_EMPLOYEE_BREAK_SCHEDULE,
    payload: id,
});

export const fetchEmployeeBreakScheduleSuccess = data => ({
    type:    FETCH_EMPLOYEE_BREAK_SCHEDULE_SUCCESS,
    payload: data,
});

export const saveEmployeeBreakSchedule = ({ schedule, id, update }) => ({
    type:    SAVE_EMPLOYEE_BREAK_SCHEDULE,
    payload: { schedule, id, update },
});

export const saveEmployeeBreakScheduleSuccess = data => ({
    type:    SAVE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS,
    payload: data,
});

export const onChangeEmployeeBreakScheduleForm = update => ({
    type:    ON_CHANGE_EMPLOYEE_BREAK_SCHEDULE_FORM,
    payload: update,
});
export const deleteEmployeeBreakSchedule = (id, employeeId) => ({
    type:    DELETE_EMPLOYEE_BREAK_SCHEDULE,
    payload: { id, employeeId },
});

export const deleteEmployeeBreakScheduleSuccess = data => ({
    type:    DELETE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS,
    payload: data,
});
