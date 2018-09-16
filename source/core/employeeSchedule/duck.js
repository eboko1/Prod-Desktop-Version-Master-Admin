/**
 * Constants
 * */
export const moduleName = 'employeeSchedule';
const prefix = `cpb/${moduleName}`;

export const CREATE_EMPLOYEE_SCHEDULE = `${prefix}/CREATE_EMPLOYEE_SCHEDULE`;
export const UPDATE_EMPLOYEE_SCHEDULE = `${prefix}/UPDATE_EMPLOYEE_SCHEDULE`;
export const DELETE_EMPLOYEE_SCHEDULE = `${prefix}/DELETE_EMPLOYEE_SCHEDULE`;
/**
 * Reducer
 * */

const ReducerState = {};

/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type } = action;

    switch (type) {
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
