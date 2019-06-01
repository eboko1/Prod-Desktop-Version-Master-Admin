// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import moment from 'moment';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

/**
 * Constants
 **/
export const moduleName = 'store_balance';
const prefix = `cbp/${moduleName}`;

export const FETCH_STORE_BALANCE = `${prefix}/FETCH_STORE_BALANCE`;
export const FETCH_STORE_BALANCE_SUCCESS = `${prefix}/FETCH_STORE_BALANCE_SUCCESS`;

export const SET_STORE_BALANCE_LOADING = `${prefix}/SET_STORE_BALANCE_LOADING`;

export const SET_STORE_BALANCE_PAGE = `${prefix}/SET_STORE_BALANCE_PAGE`;

/**
 * Reducer
 **/

const ReducerState = {
    balance: {
        total: {},
        stats: {
            count: '0',
        },
        list: [],
    },
    storeBalanceLoading: false,
    filters:             {
        page: 1,
        date: '2019-05-25',
        // date: moment().format('YYYY-MM-DD'),
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_STORE_BALANCE_SUCCESS:
            return { ...state, balance: payload };

        case SET_STORE_BALANCE_PAGE:
            return { ...state, filters: { ...state.filters, page: payload } };

        case SET_STORE_BALANCE_LOADING:
            return { ...state, storeBalanceLoading: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectStoreBalance = state => stateSelector(state).balance;
export const selectStoreBalanceFilters = state => stateSelector(state).filters;
export const selectStoreBalanceLoading = state =>
    stateSelector(state).storeBalanceLoading;

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

export const setStoreBalancePage = page => ({
    type:    SET_STORE_BALANCE_PAGE,
    payload: page,
});

export const setStoreBalanceLoading = isLoading => ({
    type:    SET_STORE_BALANCE_LOADING,
    payload: isLoading,
});

/**
 * Sagas
 **/

export function* fetchStoreBalanceSaga() {
    while (true) {
        try {
            yield take(FETCH_STORE_BALANCE);
            yield put(setStoreBalanceLoading(true));
            const filters = yield select(selectStoreBalanceFilters);
            const response = yield call(
                fetchAPI,
                'GET',
                '/store_doc_products/balance',
                filters,
            );
            console.log('** response', response);
            yield put(fetchStoreBalanceSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setStoreBalanceLoading(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchStoreBalanceSaga) ]);
}
