/**
 * Constants
 * */
export const moduleName = 'settingSalary';
const prefix = `cpb/${moduleName}`;

export const FETCH_SALARY = `${prefix}/FETCH_SALARY`;
export const FETCH_SALARY_SUCCESS = `${prefix}/FETCH_SALARY_SUCCESS`;
export const SAVE_SALARY = `${prefix}/SAVE_SALARY`;
export const SAVE_SALARY_SUCCESS = `${prefix}/SAVE_SALARY_SUCCESS`;
export const DELETE_SALARY = `${prefix}/DELETE_SALARY`;
export const DELETE_SALARY_SUCCESS = `${prefix}/DELETE_SALARY_SUCCESS`;
export const ON_CHANGE_SETTING_SALARY_FORM = `${prefix}/ON_CHANGE_SETTING_SALARY_FORM`;
export const FETCH_SALARY_REPORT = `${prefix}/FETCH_SALARY_REPORT`;
export const FETCH_SALARY_REPORT_SUCCESS = `${prefix}/FETCH_SALARY_REPORT_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    fields:   {},
    salaries: null,
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
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

export const fetchSalary = () => ({
    type: FETCH_SALARY,
});

export const fetchSalarySuccess = data => ({
    type:    FETCH_SALARY_SUCCESS,
    payload: data,
});

export const saveSalary = (salary, meth) => ({
    type:    SAVE_SALARY,
    payload: { salary, meth },
});

export const saveSalarySuccess = data => ({
    type:    SAVE_SALARY_SUCCESS,
    payload: data,
});

export const deleteSalary = id => ({
    type:    DELETE_SALARY,
    payload: id,
});

export const deleteSalarySuccess = data => ({
    type:    DELETE_SALARY_SUCCESS,
    payload: data,
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
