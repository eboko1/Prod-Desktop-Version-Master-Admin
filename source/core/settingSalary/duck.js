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
/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        // filterDate: { value: void 0, name: 'filterDate' },
    },
    salaries: null,
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_SALARY:
            return {
                ...state,
                salaries: null,
            };
        case FETCH_SALARY_SUCCESS:
            return {
                ...state,
                salaries: payload,
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

export const saveSalary = (salary, id) => ({
    type:    SAVE_SALARY,
    payload: { salary: salary, id: id },
});

export const saveSalarySuccess = data => ({
    type:    SAVE_SALARY_SUCCESS,
    payload: data,
});

export const deleteSalary = id => ({
    type:    DELETE_SALARY,
    payload: { id },
});

export const deleteSalarySuccess = data => ({
    type:    DELETE_SALARY_SUCCESS,
    payload: data,
});
