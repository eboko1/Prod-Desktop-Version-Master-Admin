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
import nprogress from 'nprogress';
import { saveAs } from 'file-saver';
import _ from 'lodash';

//proj
import { emitError, setCashOrderFetchingState } from 'core/ui/duck';
import { fetchCashOrders } from 'core/cash/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchCashOrderNextIdSuccess,
    fetchCashOrderFormSuccess,
    createCashOrderSuccess,
    editCashOrderSuccess,
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
    //
    onOrderSearchSuccess,
    printCashOrderSuccess,
    FETCH_CASH_ORDER_NEXT_ID,
    FETCH_CASH_ORDER_FORM,
    CREATE_CASH_ORDER,
    EDIT_CASH_ORDER,
    PRINT_CASH_ORDER,
    ON_CHANGE_CASH_ORDER_FORM,
    ON_CHANGE_CLIENT_SEARCH_QUERY,
    ON_CLIENT_SELECT,
    // ON_CLIENT_SELECT_SUCCESS,
    FETCH_SELECTED_CLIENT_ORDERS,
    //
    ON_ORDER_SEARCH,
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
            console.log('** payload', payload);
            const cashOrder = _.omit(payload, [
                'counterpartyType',
                'sumType',
                'editMode',
                payload.editMode && 'id',
            ]);
            yield call(
                fetchAPI,
                payload.editMode ? 'PUT' : 'POST',
                payload.editMode ? `cash_orders/${payload.id}` : 'cash_orders',
                null,
                cashOrder,
            );
            yield put(createCashOrderSuccess());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(fetchCashOrders());
        }
    }
}
export function* editCashOrderSaga() {
    while (true) {
        try {
            const { payload } = yield take(EDIT_CASH_ORDER);
            const cashOrder = _.omit(payload, [ 'counterpartyType', 'sumType' ]);
            yield call(
                fetchAPI,
                'PUT',
                `cash_orders/${payload.id}`,
                null,
                cashOrder,
            );
            yield put(editCashOrderSuccess());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(fetchCashOrders());
        }
    }
}

export function* printCashOrderSaga() {
    while (true) {
        try {
            const { payload } = yield take(PRINT_CASH_ORDER);
            yield nprogress.start();

            const response = yield call(
                fetchAPI,
                'GET',
                `cash_orders/${payload}/pdf`,
                null,
                null,
                {
                    rawResponse: true,
                },
            );
            const reportFile = yield response.blob();

            const contentDispositionHeader = response.headers.get(
                'content-disposition',
            );
            const fileName = contentDispositionHeader.match(
                /^attachment; filename="(.*)"/,
            )[ 1 ];
            yield saveAs(reportFile, fileName);

            yield put(printCashOrderSuccess());
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* onOrderSearchSaga() {
    while (true) {
        try {
            const { payload } = yield take(ON_ORDER_SEARCH);

            const response = yield call(fetchAPI, 'GET', 'orders', {
                query: payload,
            });
            const selectedOrder = _.get(response, 'orders[0]');
            yield put(onOrderSearchSuccess(selectedOrder));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
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
        call(onOrderSearchSaga),
        call(printCashOrderSaga),
        takeLatest(FETCH_CASH_ORDER_NEXT_ID, fetchCashOrderNextIdSaga),
        takeLatest(ON_CHANGE_CLIENT_SEARCH_QUERY, handleClientSearchSaga),
    ]);
}
