// vendor
import { call, put, all, delay, take, takeLatest } from 'redux-saga/effects';
import _ from 'lodash';

//proj
import { emitError, setCashOrderFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchCashOrderNextIdSuccess,
    fetchCashOrderFormSuccess,
    createCashOrderSuccess,
    //
    onChangeClientSearchQuery,
    onChangeClientSearchQueryRequest,
    onChangeClientSearchQuerySuccess,
    //
    onClientSelectSuccess,
    // SET_SEARCH_QUERY,
    FETCH_CASH_ORDER_NEXT_ID,
    FETCH_CASH_ORDER_FORM,
    CREATE_CASH_ORDER,
    ON_CHANGE_CASH_ORDER_FORM,
    ON_CHANGE_CLIENT_SEARCH_QUERY,
    ON_CLIENT_SELECT,
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
            const data = yield call(fetchAPI, 'GET', payload);
            yield put(fetchCashOrderFormSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* onChangeCashOrderFormSaga() {
    while (true) {
        try {
            const {
                meta: { field }, // form
                payload,
            } = yield take(ON_CHANGE_CASH_ORDER_FORM);

            if (field === 'searchClientQuery') {
                yield put(onChangeClientSearchQuery(payload[ field ].value));
            }
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* handleClientSearchSaga({ payload }) {
    try {
        yield put(onChangeClientSearchQueryRequest());
        yield delay(1000);
        console.log('**handleClientSearchSaga ', payload);
        if (payload.length > 2) {
            const data = yield call(fetchAPI, 'GET', 'clients/search', {
                query: payload,
            });
            yield put(onChangeClientSearchQuerySuccess(data));
        } else {
            yield put(onChangeClientSearchQuerySuccess([]));
        }
    } catch (error) {
        yield put(emitError(error));
    }
}

export function* handleClientSelectSaga() {
    while (true) {
        try {
            const {
                payload: { clientId },
            } = yield take(ON_CLIENT_SELECT);

            const selectedClientOrders = yield call(fetchAPI, 'GET', 'orders', {
                client: clientId,
            });
            yield put(onClientSelectSuccess(selectedClientOrders));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* createCashOrderSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_CASH_ORDER);
            const cashOrder = _.omit(payload, 'counterpartyType');
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
        call(createCashOrderSaga),
        call(fetchCashOrderFormSaga),
        call(onChangeCashOrderFormSaga),
        call(handleClientSelectSaga),
        takeLatest(FETCH_CASH_ORDER_NEXT_ID, fetchCashOrderNextIdSaga),
        takeLatest(ON_CHANGE_CLIENT_SEARCH_QUERY, handleClientSearchSaga),
    ]);
}
