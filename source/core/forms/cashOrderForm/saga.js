// vendor
import {
    call,
    put,
    all,
    delay,
    take,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';
import _ from 'lodash';

//proj
import { emitError, setCashOrderFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchCashOrderNextIdSuccess,
    fetchCashOrderFormSuccess,
    createCashOrderSuccess,
    // SET_SEARCH_QUERY,
    FETCH_CASH_ORDER_NEXT_ID,
    FETCH_CASH_ORDER_FORM,
    CREATE_CASH_ORDER,
} from './duck';

// export function* handleContractorSearchSaga({ payload: { query } }) {
//     yield delay(1000);

//     if (query && query.length > 2) {
//         yield put(setSearchContractorFetchingState(true));

//         const businesses = yield call(fetchAPI, 'GET', 'orders', {
//             search: query,
//         });
//         yield put(fetch(businesses));
//         yield put(setSearchContractorFetchingState(false));
//     }
// }

export function* fetchCashOrderNextIdSaga() {
    yield put(setCashOrderFetchingState(true));
    const cashOrderNextId = yield call(fetchAPI, 'GET', 'cash_orders/next_id');
    yield put(fetchCashOrderNextIdSuccess(cashOrderNextId));
    yield put(setCashOrderFetchingState(false));
}

export function* fetchCashOrderFormSaga() {
    while (true) {
        try {
            const { payload } = yield take(FETCH_CASH_ORDER_FORM);
            console.log('→ payload', payload);
            const data = yield call(fetchAPI, 'GET', payload);
            console.log('** data', data);
            yield put(fetchCashOrderFormSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* createCashOrderSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_CASH_ORDER);
            // console.log('** payload', payload);
            const cashOrder = _.omit(payload, 'counterpartyType');
            // console.log('→ cashOrder', cashOrder);
            yield call(fetchAPI, 'POST', 'cash_orders', null, cashOrder);
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(createCashOrderSuccess());
        }
    }
}

export function* saga() {
    yield all([
        // takeLatest(SET_SEARCH_QUERY, handleContractorSearchSaga),
        call(createCashOrderSaga), takeLatest(FETCH_CASH_ORDER_NEXT_ID, fetchCashOrderNextIdSaga), call(fetchCashOrderFormSaga),
    ]);
}
