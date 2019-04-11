/**
 * Constants
 **/
export const moduleName = 'expenses';
const prefix = `cbp/${moduleName}`;

export const FETCH_EXPENSES = `${prefix}/FETCH_EXPENSES`;
export const FETCH_EXPENSES_SUCCESS = `${prefix}/FETCH_EXPENSES_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    expenses: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_EXPENSES_SUCCESS:
            return { ...state, expenses: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectStoreExpenses = state => stateSelector(state).expenses;

/**
 * Action Creators
 **/

export const fetchExpenses = () => ({
    type: FETCH_EXPENSES,
});

export const fetchExpensesSuccess = expenses => ({
    type:    FETCH_EXPENSES_SUCCESS,
    payload: expenses,
});
