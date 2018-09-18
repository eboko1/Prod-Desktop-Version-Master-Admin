/**
 * Constants
 * */
export const moduleName = 'employees';
const prefix = `cpb/${moduleName}`;

export const FETCH_EMPLOYEES = `${prefix}/FETCH_EMPLOYEES`;
export const FETCH_EMPLOYEES_SUCCESS = `${prefix}/FETCH_EMPLOYEES_SUCCESS`;
export const DELETE_EMPLOYEE = `${prefix}/DELETE_EMPLOYEE`;
export const DELETE_EMPLOYEE_SUCCESS = `${prefix}/DELETE_EMPLOYEE_SUCCESS`;

export const SET_EMPLOYEES_STATUS = `${prefix}/SET_EMPLOYEES_STATUS`;
export const SET_EMPLOYEES_DISABLED = `${prefix}/SET_EMPLOYEES_DISABLED`;
/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
    filter: {
        disabled: null,
    },
    employees:   null,
    status:      'all',
    activeOrder: null,
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_EMPLOYEES_SUCCESS:
            return {
                ...state,
                employees: payload,
            };

        case SET_EMPLOYEES_STATUS:
            return {
                ...state,
                status: payload.status,
                filter: {
                    disabled: payload.disabled,
                },
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

export const fetchEmployees = () => ({
    type: FETCH_EMPLOYEES,
});

export const fetchEmployeesSuccess = data => ({
    type:    FETCH_EMPLOYEES_SUCCESS,
    payload: data,
});

export const setEmployeesStatus = ({ status, disabled }) => ({
    type:    SET_EMPLOYEES_STATUS,
    payload: { status, disabled },
});

export const deleteEmployee = id => ({
    type:    DELETE_EMPLOYEE,
    payload: id,
});

export const deleteEmployeeSuccess = data => ({
    type:    DELETE_EMPLOYEE_SUCCESS,
    payload: data,
});
