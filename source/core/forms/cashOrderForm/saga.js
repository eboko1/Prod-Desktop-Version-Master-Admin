// vendor
import {
    call,
    put,
    all,
    take,
    takeLatest,
    select,
    delay,
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
    //
    onChangeClientSearchQuery,
    onChangeClientSearchQueryRequest,
    onChangeClientSearchQuerySuccess,
    //
    onClientSelectSuccess,
    selectClient,
    selectClientOrdersFilters,
    //
    fetchSelectedClientOrdersSuccess,
    FETCH_CASH_ORDER_NEXT_ID,
    FETCH_CASH_ORDER_FORM,
    CREATE_CASH_ORDER,
    CREATE_CASH_ORDER_SUCCESS,
    ON_CHANGE_CASH_ORDER_FORM,
    ON_CHANGE_CLIENT_SEARCH_QUERY,
    ON_CLIENT_SELECT,
    // ON_CLIENT_SELECT_SUCCESS,
    FETCH_SELECTED_CLIENT_ORDERS,
} from './duck';

export function* fetchCashOrderNextIdSaga() {
    yield put(setCashOrderFetchingState(true));
    const cashOrderNextId = yield call(fetchAPI, 'GET', 'cash_orders/next_id');
    yield put(fetchCashOrderNextIdSuccess(cashOrderNextId));
    yield put(setCashOrderFetchingState(false));
}

export function* fetchCashOrderFormSaga() {
    while (true) {
        try {
            const { payload } = yield take([ FETCH_CASH_ORDER_FORM, CREATE_CASH_ORDER_SUCCESS ]);
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
        // console.log('**handleClientSearchSaga ', payload);
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

export function* fetchSelectedClientOrders() {
    while (true) {
        try {
            yield take(FETCH_SELECTED_CLIENT_ORDERS);
            const filters = yield select(selectClientOrdersFilters);
            const { clientId } = yield select(selectClient);

            const data = yield call(fetchAPI, 'GET', 'orders', {
                ...filters,
                client: clientId,
            });

            yield put(fetchSelectedClientOrdersSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* createCashOrderSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_CASH_ORDER);
            const cashOrder = _.omit(payload, [ 'counterpartyType', 'sumType' ]);
            yield call(fetchAPI, 'POST', 'cash_orders', null, cashOrder);
            yield put(createCashOrderSuccess());
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* saga() {
    yield all([
        call(createCashOrderSaga),
        call(fetchCashOrderFormSaga),
        call(onChangeCashOrderFormSaga),
        call(handleClientSelectSaga),
        call(fetchSelectedClientOrders),
        takeLatest(FETCH_CASH_ORDER_NEXT_ID, fetchCashOrderNextIdSaga),
        takeLatest(ON_CHANGE_CLIENT_SEARCH_QUERY, handleClientSearchSaga),
    ]);
}
