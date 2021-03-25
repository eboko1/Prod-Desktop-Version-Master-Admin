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
import {
    emitError,
    setCashOrderFetchingState,
    setClientOrdersFetchingState,
    setClientFetchingState,
    registerCashOrderInCashdesk
} from 'core/ui/duck';
import { fetchCashOrders } from 'core/cash/duck';
import { fetchAPI } from 'utils';
import {analyticsLevels} from 'core/forms/reportAnalyticsForm/duck'

// own
import {
    fetchCashOrderNextIdSuccess,
    fetchCashOrderFormSuccess,
    createCashOrderSuccess,
    //
    onChangeClientSearchQuery,
    onChangeClientSearchQueryRequest,
    onChangeClientSearchQuerySuccess,
    onChangeOrderSearchQuery,
    onChangeOrderSearchQueryRequest,
    onChangeOrderSearchQuerySuccess,
    onChangeStoreDocSearchQuery,
    onChangeStoreDocSearchQueryRequest,
    onChangeStoreDocSearchQuerySuccess,
    onClientSelectSuccess,
    //
    selectClient,
    selectClientOrdersFilters,
    selectSearchOrdersResultFilters,
    selectSearchStoreDocsResultFilters,
    setOrderSearchFilters,
    setStoreDocSearchFilters,
    setAnalyticsFetchingState,
    //
    fetchSelectedClientOrdersSuccess,
    fetchSearchOrderSuccess,
    fetchAnalyticsSuccess,
    printCashOrderSuccess,
    //
    FETCH_CASH_ORDER_NEXT_ID,
    FETCH_CASH_ORDER_FORM,
    FETCH_ANALYTICS,
    CREATE_CASH_ORDER,
    PRINT_CASH_ORDER,
    ON_CHANGE_CASH_ORDER_FORM,
    ON_CHANGE_CLIENT_SEARCH_QUERY,
    ON_CHANGE_ORDER_SEARCH_QUERY,
    ON_CHANGE_STORE_DOC_SEARCH_QUERY,
    FETCH_SEARCH_ORDER,
    FETCH_SEARCH_STORE_DOC,
    ON_CLIENT_SELECT,
    // ON_CLIENT_SELECT_SUCCESS,
    FETCH_SELECTED_CLIENT_ORDERS,
} from './duck';

export function* fetchCashOrderNextIdSaga() {
    try {
        yield put(setCashOrderFetchingState(true));
        const cashOrderNextId = yield call(
            fetchAPI,
            'GET',
            'cash_orders/next_id',
        );
        yield put(fetchCashOrderNextIdSuccess(cashOrderNextId));
        yield put(setCashOrderFetchingState(false));
    } catch (error) {
        yield put(emitError(error));
    }
}

export function* fetchCashOrderFormSaga() {
    while (true) {
        try {
            const { payload } = yield take(FETCH_CASH_ORDER_FORM);
            console.log(payload);
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
            if (field === 'searchOrderQuery') {
                yield put(onChangeOrderSearchQuery(payload[ field ].value));
            }
            if (field === 'searchStoreDocQuery') {
                yield put(onChangeStoreDocSearchQuery(payload[ field ].value));
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

export function* handleOrderSearchSaga({ payload }) {
    try {
        yield put(onChangeOrderSearchQueryRequest());
        yield delay(1000);
        yield put(setClientOrdersFetchingState(true));
        yield put(setOrderSearchFilters({ query: payload }));
        if (payload.length >= 1) {
            const response = yield call(fetchAPI, 'GET', 'orders', {
                sumRemains: true,
                query:      payload,
            });
            yield put(onChangeOrderSearchQuerySuccess(response));
        } else {
            yield put(onChangeOrderSearchQuerySuccess([]));
        }
        yield put(setClientOrdersFetchingState(false));
    } catch (error) {
        yield put(emitError(error));
    }
}

export function* handleStoreDocSearchSaga({ payload }) {
    try {
        yield put(onChangeStoreDocSearchQueryRequest());
        yield delay(1000);
        yield put(setClientOrdersFetchingState(true));
        yield put(setStoreDocSearchFilters({ query: payload }));
        if (payload.length >= 1) {
            const response = yield call(fetchAPI, 'GET', 'store_docs', {
                type: "EXPENSE",
                documentType: "CLIENT",
                status: "DONE",
                query:  payload,
            });
            yield put(onChangeStoreDocSearchQuerySuccess(response));
        } else {
            yield put(onChangeStoreDocSearchQuerySuccess([]));
        }
        yield put(setClientOrdersFetchingState(false));
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
            yield put(setClientOrdersFetchingState(true));
            const selectedClientOrders = yield call(fetchAPI, 'GET', 'orders', {
                sumRemains: true,
                client:     clientId,
            });
            yield put(onClientSelectSuccess(selectedClientOrders));
            yield put(setClientOrdersFetchingState(false));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* fetchSelectedClientOrders() {
    while (true) {
        try {
            yield take(FETCH_SELECTED_CLIENT_ORDERS);
            yield put(setClientFetchingState(true));
            const filters = yield select(selectClientOrdersFilters);
            const { clientId } = yield select(selectClient);

            const data = yield call(fetchAPI, 'GET', 'orders', {
                ...filters,
                sumRemains: true,
                client:     clientId,
            });

            yield put(fetchSelectedClientOrdersSuccess(data));
            yield put(setClientFetchingState(false));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* fetchSearchOrderSaga() {
    while (true) {
        try {
            yield take(FETCH_SEARCH_ORDER);
            yield put(setClientFetchingState(true));
            const filters = yield select(selectSearchOrdersResultFilters);

            const data = yield call(fetchAPI, 'GET', 'orders', {
                sumRemains: true,
                ...filters,
            });

            yield put(fetchSearchOrderSuccess(data));
            yield put(setClientFetchingState(false));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* fetchSearchStoreDocSaga() {
    while (true) {
        try {
            yield take(FETCH_SEARCH_STORE_DOC);
            yield put(setClientFetchingState(true));
            const filters = yield select(selectSearchStoreDocsResultFilters);

            const data = yield call(fetchAPI, 'GET', 'store_docs', {
                //sumRemains: true,
                ...filters,
            });

            yield put(fetchSearchOrderSuccess(data));
            yield put(setClientFetchingState(false));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* fetchAnalyticsSaga() {
    while (true) {
        try {
            yield take(FETCH_ANALYTICS);
            yield put(setAnalyticsFetchingState(true));
            
            const filters = {
                level: analyticsLevels.analytics
            }

            const {analytics} = yield call(fetchAPI, 'GET', '/report/analytics', {filters});

            yield put(fetchAnalyticsSuccess(analytics));
            yield put(setAnalyticsFetchingState(false));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* createCashOrderSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_CASH_ORDER);

            const isCashBoxRst = payload.cashBox.rst;
            const cashOrder = _.omit(payload, [
                'counterpartyType',
                'sumType',
                'editMode',
                'cashBox',
                payload.editMode && 'id',
            ]);

            yield call(
                fetchAPI,
                payload.editMode ? 'PUT' : 'POST',
                payload.editMode ? `cash_orders/${payload.id}` : 'cash_orders',
                null,
                cashOrder,
            );

            //If cashbox contains rst it must be registred in cashdesk if possible 
            if(isCashBoxRst && !payload.editMode ) {
                yield put(registerCashOrderInCashdesk(payload.id))
            }

            yield put(createCashOrderSuccess());
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



export function* saga() {
    yield all([
        call(createCashOrderSaga),
        call(fetchCashOrderFormSaga),
        call(onChangeCashOrderFormSaga),
        call(handleClientSelectSaga),
        call(fetchSelectedClientOrders),
        call(fetchSearchOrderSaga),
        call(fetchSearchStoreDocSaga),
        call(fetchAnalyticsSaga),
        call(printCashOrderSaga),
        takeLatest(FETCH_CASH_ORDER_NEXT_ID, fetchCashOrderNextIdSaga),
        takeLatest(ON_CHANGE_CLIENT_SEARCH_QUERY, handleClientSearchSaga),
        takeLatest(ON_CHANGE_ORDER_SEARCH_QUERY, handleOrderSearchSaga),
        takeLatest(ON_CHANGE_STORE_DOC_SEARCH_QUERY, handleStoreDocSearchSaga),
    ]);
}
