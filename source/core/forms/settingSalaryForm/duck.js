/**
 * Constants
 * */
export const moduleName = 'settingSalary';
const prefix = `cpb/${moduleName}`;

export const FETCH_SALARY = `${prefix}/FETCH_SALARY`;
export const FETCH_SALARY_SUCCESS = `${prefix}/FETCH_SALARY_SUCCESS`;

export const CREATE_SALARY = `${prefix}/CREATE_SALARY`;
export const CREATE_SALARY_SUCCESS = `${prefix}/CREATE_SALARY_SUCCESS`;
export const UPDATE_SALARY = `${prefix}/UPDATE_SALARY`;
export const UPDATE_SALARY_SUCCESS = `${prefix}/UPDATE_SALARY_SUCCESS`;
export const DELETE_SALARY = `${prefix}/DELETE_SALARY`;
export const DELETE_SALARY_SUCCESS = `${prefix}/DELETE_SALARY_SUCCESS`;

export const ON_CHANGE_SETTING_SALARY_FORM = `${prefix}/ON_CHANGE_SETTING_SALARY_FORM`;
export const RESET_FIELDS = `${prefix}/RESET_FIELDS`;

export const FETCH_SALARY_REPORT = `${prefix}/FETCH_SALARY_REPORT`;
export const FETCH_SALARY_REPORT_SUCCESS = `${prefix}/FETCH_SALARY_REPORT_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        settingSalaries: [],
    },
    salaries: [],
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_SALARY:
            return {
                ...state,
                salaries: [],
                fields:   {},
            };

        case FETCH_SALARY_SUCCESS:
            return {
                ...state,
                salaries: payload,
            };

        case ON_CHANGE_SETTING_SALARY_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case RESET_FIELDS:
            return {
                ...state,
                fields: {},
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

export const fetchSalary = employeeId => ({
    type:    FETCH_SALARY,
    payload: employeeId,
});

export const fetchSalarySuccess = data => ({
    type:    FETCH_SALARY_SUCCESS,
    payload: data,
});

export const createSalary = (employeeId, salary) => ({
    type:    CREATE_SALARY,
    payload: { salary, employeeId },
});

export const createSalarySuccess = () => ({
    type: CREATE_SALARY_SUCCESS,
});

export const updateSalary = (employeeId, salaryId, salary) => ({
    type:    UPDATE_SALARY,
    payload: { salary, employeeId, salaryId },
});

export const updateSalarySuccess = () => ({
    type: UPDATE_SALARY_SUCCESS,
});

export const deleteSalary = (employeeId, salaryId) => ({
    type:    DELETE_SALARY,
    payload: { employeeId, salaryId },
});

export const deleteSalarySuccess = () => ({
    type: DELETE_SALARY_SUCCESS,
});

export const onChangeSettingSalaryForm = update => ({
    type:    ON_CHANGE_SETTING_SALARY_FORM,
    payload: update,
});

export const fetchSalaryReport = info => ({
    type:    FETCH_SALARY_REPORT,
    payload: info,
});

export const fetchSalaryReportSuccess = data => ({
    type:    FETCH_SALARY_REPORT_SUCCESS,
    payload: data,
});

export const resetFields = () => ({
    type: RESET_FIELDS,
});
