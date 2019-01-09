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

//proj
import { emitError, setCashOrderFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchCashOrderNextIdSuccess,
    createCashOrderSuccess,
    // SET_SEARCH_QUERY,
    FETCH_CASH_ORDER_NEXT_ID,
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

export function* createCashOrderSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_CASH_ORDER);
            console.log('** payload', payload);
            yield call(fetchAPI, 'POST', 'cash_orders', null, payload, {
                handleErrorInternally: true,
            });
        } catch (error) {
            // yield put(emitError(error));
            console.log('→ error', error);
        } finally {
            yield put(createCashOrderSuccess());
        }
    }
}

export function* saga() {
    yield all([
        // takeLatest(SET_SEARCH_QUERY, handleContractorSearchSaga),
        call(createCashOrderSaga), takeLatest(FETCH_CASH_ORDER_NEXT_ID, fetchCashOrderNextIdSaga),
    ]);
}
