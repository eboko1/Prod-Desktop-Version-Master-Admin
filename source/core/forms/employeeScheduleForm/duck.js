/**
 * Constants
 * */
export const moduleName = 'employee';
const prefix = `cpb/${moduleName}`;

export const FETCH_EMPLOYEE_SCHEDULE = `${prefix}/FETCH_EMPLOYEE_SCHEDULE`;
export const FETCH_EMPLOYEE_SCHEDULE_SUCCESS = `${prefix}/FETCH_EMPLOYEE_SCHEDULE_SUCCESS`;

export const SAVE_EMPLOYEE_SCHEDULE = `${prefix}/SAVE_EMPLOYEE_SCHEDULE`;
export const SAVE_EMPLOYEE_SCHEDULE_SUCCESS = `${prefix}/SAVE_EMPLOYEE_SCHEDULE_SUCCESS`;
export const DELETE_EMPLOYEE_SCHEDULE = `${prefix}/DELETE_EMPLOYEE_SCHEDULE`;
export const DELETE_EMPLOYEE_SCHEDULE_SUCCESS = `${prefix}/DELETE_EMPLOYEE_SCHEDULE_SUCCESS`;

export const ON_CHANGE_EMPLOYEE_SCHEDULE_FORM = `${prefix}/ON_CHANGE_EMPLOYEE_SCHEDULE_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        monday:            [{ value: false, name: 'monday' }],
        tuesday:           [{ value: false, name: 'tuesday' }],
        wednesday:         [{ value: false, name: 'wednesday' }],
        thursday:          [{ value: false, name: 'thursday' }],
        friday:            [{ value: false, name: 'friday' }],
        saturday:          [{ value: false, name: 'saturday' }],
        sunday:            [{ value: false, name: 'sunday' }],
        beginWorkingHours: [{ value: void 0, name: 'beginWorkingHours' }],
        endWorkingHours:   [{ value: void 0, name: 'endWorkingHours' }],
        beginBreakHours:   [{ value: void 0, name: 'beginBreakHours' }],
        endBreakHours:     [{ value: void 0, name: 'endBreakHours' }],
        id:                [{ value: void 0, name: 'endBreakHours' }],
    },
    // initialSchedule: {
    //     id:                { value: 0, name: '' },
    //     monday:            { value: false, name: 'monday' },
    //     tuesday:           [{ value: false, name: 'tuesday' }],
    //     wednesday:         [{ value: false, name: 'wednesday' }],
    //     thursday:          [{ value: false, name: 'thursday' }],
    //     friday:            [{ value: false, name: 'friday' }],
    //     saturday:          [{ value: false, name: 'saturday' }],
    //     sunday:            [{ value: false, name: 'sunday' }],
    //     beginWorkingHours: [{ value: void 0, name: 'beginWorkingHours' }],
    //     endWorkingHours:   [{ value: void 0, name: 'endWorkingHours' }],
    //     beginBreakHours:   [{ value: void 0, name: 'beginBreakHours' }],
    //     endBreakHours:     [{ value: void 0, name: 'endBreakHours' }],
    // },
    employeeSchedule: null,
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_EMPLOYEE_SCHEDULE_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };
        case FETCH_EMPLOYEE_SCHEDULE:
            return {
                ...state,
                employeeSchedule: null,
            };
        case FETCH_EMPLOYEE_SCHEDULE_SUCCESS:
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

export const fetchEmployeeSchedule = id => ({
    type:    FETCH_EMPLOYEE_SCHEDULE,
    payload: id,
});

export const fetchEmployeeScheduleSuccess = data => ({
    type:    FETCH_EMPLOYEE_SCHEDULE_SUCCESS,
    payload: data,
});

export const saveEmployeeSchedule = ({ schedule, id }) => ({
    type:    SAVE_EMPLOYEE_SCHEDULE,
    payload: { schedule, id },
});

export const saveEmployeeScheduleSuccess = data => ({
    type:    SAVE_EMPLOYEE_SCHEDULE_SUCCESS,
    payload: data,
});

export const onChangeEmployeeScheduleForm = update => ({
    type:    ON_CHANGE_EMPLOYEE_SCHEDULE_FORM,
    payload: update,
});
export const deleteEmployeeSchedule = (id, employeeId) => ({
    type:    DELETE_EMPLOYEE_SCHEDULE,
    payload: { id, employeeId },
});

export const deleteEmployeeScheduleSuccess = data => ({
    type:    DELETE_EMPLOYEE_SCHEDULE_SUCCESS,
    payload: data,
});
