/**
 * Constants
 **/
export const moduleName = 'incomes';
const prefix = `cbp/${moduleName}`;

export const FETCH_INCOMES = `${prefix}/FETCH_INCOMES`;
export const FETCH_INCOMES_SUCCESS = `${prefix}/FETCH_INCOMES_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    incomes: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_INCOMES_SUCCESS:
            return { ...state, incomes: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectStoreIncomes = state => stateSelector(state).incomes;

/**
 * Action Creators
 **/

export const fetchIncomes = () => ({
    type: FETCH_INCOMES,
});

export const fetchIncomesSuccess = incomes => ({
    type:    FETCH_INCOMES_SUCCESS,
    payload: incomes,
});
