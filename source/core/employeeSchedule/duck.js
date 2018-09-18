/**
 * Constants
 * */
export const moduleName = 'employeeSchedule';
const prefix = `cpb/${moduleName}`;

export const FETCH_EMPLOYEE_SCHEDULE = `${prefix}/FETCH_EMPLOYEE_SCHEDULE`;
export const FETCH_EMPLOYEE_SCHEDULE_SUCCESS = `${prefix}/FETCH_EMPLOYEE_SCHEDULE_SUCCESS`;

export const CREATE_EMPLOYEE_SCHEDULE = `${prefix}/CREATE_EMPLOYEE_SCHEDULE`;
export const UPDATE_EMPLOYEE_SCHEDULE = `${prefix}/UPDATE_EMPLOYEE_SCHEDULE`;
export const DELETE_EMPLOYEE_SCHEDULE = `${prefix}/DELETE_EMPLOYEE_SCHEDULE`;

export const CREATE_EMPLOYEE_SCHEDULE_SUCCESS = `${prefix}/CREATE_EMPLOYEE_SCHEDULE_SUCCESS`;
export const UPDATE_EMPLOYEE_SCHEDULE_SUCCESS = `${prefix}/UPDATE_EMPLOYEE_SCHEDULE_SUCCESS`;
export const DELETE_EMPLOYEE_SCHEDULE_SUCCESS = `${prefix}/DELETE_EMPLOYEE_SCHEDULE_SUCCESS`;

export const CREATE_BREAK_EMPLOYEE_SCHEDULE = `${prefix}/CREATE_BREAK_EMPLOYEE_SCHEDULE`;
export const UPDATE_BREAK_EMPLOYEE_SCHEDULE = `${prefix}/UPDATE_BREAK_EMPLOYEE_SCHEDULE`;
export const DELETE_BREAK_EMPLOYEE_SCHEDULE = `${prefix}/DELETE_BREAK_EMPLOYEE_SCHEDULE`;

export const CREATE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS = `${prefix}/CREATE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS`;
export const UPDATE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS = `${prefix}/UPDATE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS`;
export const DELETE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS = `${prefix}/DELETE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS`;
/**
 * Reducer
 * */

const ReducerState = {
    schedule:       [],
    nonWorkingDays: [],
    loadings:       false,
};

/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    const crudActions = [ CREATE_BREAK_EMPLOYEE_SCHEDULE, CREATE_EMPLOYEE_SCHEDULE, UPDATE_EMPLOYEE_SCHEDULE, UPDATE_BREAK_EMPLOYEE_SCHEDULE, CREATE_EMPLOYEE_SCHEDULE, CREATE_BREAK_EMPLOYEE_SCHEDULE ];
    const crudSuccessActions = [ CREATE_EMPLOYEE_SCHEDULE, CREATE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS, UPDATE_EMPLOYEE_SCHEDULE_SUCCESS, DELETE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS, CREATE_EMPLOYEE_SCHEDULE_SUCCESS, CREATE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS ];
    if (crudActions.includes(type)) {
        return {
            ...state,
            loading: true,
        };
    }

    if (crudSuccessActions.includes(type)) {
        return {
            ...state,
            loading: false,
        };
    }

    switch (type) {
        case FETCH_EMPLOYEE_SCHEDULE:
            return {
                ...state,
                schedule:       [],
                nonWorkingDays: [],
                loading:        true,
            };

        case FETCH_EMPLOYEE_SCHEDULE_SUCCESS:
            return {
                ...state,
                schedule:       payload.schedule,
                nonWorkingDays: payload.nonWorkingDays,
                loading:        false,
            };

        default:
            return state;
    }
}

export const createEmployeeSchedule = (employeeId, schedule) => ({
    type:    CREATE_EMPLOYEE_SCHEDULE,
    payload: { schedule, employeeId },
});

export const updateEmployeeSchedule = (employeeId, scheduleId, schedule) => ({
    type:    UPDATE_EMPLOYEE_SCHEDULE,
    payload: { scheduleId, schedule, employeeId },
});

export const deleteEmployeeSchedule = (employeeId, scheduleId) => ({
    type:    DELETE_EMPLOYEE_SCHEDULE,
    payload: { scheduleId, employeeId },
});

export const createEmployeeBreakSchedule = (employeeId, breakSchedule) => ({
    type:    CREATE_BREAK_EMPLOYEE_SCHEDULE,
    payload: { breakSchedule, employeeId },
});

export const updateEmployeeBreakSchedule = (
    employeeId,
    breakScheduleId,
    breakSchedule,
) => ({
    type:    UPDATE_BREAK_EMPLOYEE_SCHEDULE,
    payload: { breakScheduleId, breakSchedule, employeeId },
});

export const deleteEmployeeBreakSchedule = (employeeId, breakScheduleId) => ({
    type:    DELETE_BREAK_EMPLOYEE_SCHEDULE,
    payload: { breakScheduleId, employeeId },
});

export const createEmployeeScheduleSuccess = () => ({
    type: CREATE_EMPLOYEE_SCHEDULE_SUCCESS,
});

export const updateEmployeeScheduleSuccess = () => ({
    type: UPDATE_EMPLOYEE_SCHEDULE_SUCCESS,
});

export const deleteEmployeeScheduleSuccess = () => ({
    type: DELETE_EMPLOYEE_SCHEDULE_SUCCESS,
});

export const createEmployeeBreakScheduleSuccess = () => ({
    type: CREATE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS,
});

export const updateEmployeeBreakScheduleSuccess = () => ({
    type: UPDATE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS,
});

export const deleteEmployeeBreakScheduleSuccess = () => ({
    type: DELETE_EMPLOYEE_BREAK_SCHEDULE_SUCCESS,
});

export const fetchEmployeeSchedule = id => ({
    type:    FETCH_EMPLOYEE_SCHEDULE,
    payload: id,
});

export const fetchEmployeeScheduleSuccess = entity => ({
    type:    FETCH_EMPLOYEE_SCHEDULE_SUCCESS,
    payload: entity,
});
