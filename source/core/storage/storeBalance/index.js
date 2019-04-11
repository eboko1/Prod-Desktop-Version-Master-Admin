/**
 * Constants
 **/
export const moduleName = 'storeBalance';
const prefix = `cbp/${moduleName}`;

export const FETCH_STORE_BALANCE = `${prefix}/FETCH_STORE_BALANCE`;
export const FETCH_STORE_BALANCE_SUCCESS = `${prefix}/FETCH_STORE_BALANCE_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    storeBalanceData: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_STORE_BALANCE_SUCCESS:
            return { ...state, storeBalance: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectStoreStoreBalance = state =>
    stateSelector(state).storeBalance;

/**
 * Action Creators
 **/

export const fetchStoreBalance = () => ({
    type: FETCH_STORE_BALANCE,
});

export const fetchStoreBalanceSuccess = storeBalance => ({
    type:    FETCH_STORE_BALANCE_SUCCESS,
    payload: storeBalance,
});
