/**
 * Constants
 * */
export const moduleName = 'employee';
const prefix = `cpb/${moduleName}`;

export const FETCH_EMPLOYEES = `${prefix}/FETCH_EMPLOYEES`;
export const FETCH_EMPLOYEES_SUCCESS = `${prefix}/FETCH_EMPLOYEES_SUCCESS`;

export const SET_CURRENT_PAGE = `${prefix}/SET_CURRENT_PAGE`;
/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        // filterDate: { value: void 0, name: 'filterDate' },
    },
    employees:   null,
    activeOrder: null,
    page:        1,
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {

        case FETCH_EMPLOYEES:
            return {
                ...state,
                employees: null,
            };
        case FETCH_EMPLOYEES_SUCCESS:
                    
            return {
                ...state,
                employees: payload,
            };

        case SET_CURRENT_PAGE:
            return {
                ...state,
                page: payload,
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

export const fetchEmployee = ({page, kind}) =>({
    type:    FETCH_EMPLOYEES,
    payload: {page, kind},
});

export const fetchEmployeeSuccess = data => ({
    type:    FETCH_EMPLOYEES_SUCCESS,
    payload: data,
});

export const setPage = page => ({
    type:    SET_CURRENT_PAGE,
    payload: page,
});
