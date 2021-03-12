// vendor
import {
    call,
    put,
    all,
    take,
    select,
    delay,
    takeLatest,
} from 'redux-saga/effects';
import nprogress from 'nprogress';
import { saveAs } from 'file-saver';
import moment from 'moment';
import _ from 'lodash';

//proj
import { setCashOrdersFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';
import {analyticsLevels} from 'core/forms/reportAnalyticsForm/duck'


// own
import {
    fetchCashboxes,
    fetchCashboxesSuccess,
    fetchAnalyticsSuccess,
    setAnalyticsFetchingState,
    createCashboxSuccess,
    deleteCashboxSuccess,
    fetchCashOrders,
    fetchCashOrdersSuccess,
    fetchCashboxesBalanceSuccess,
    fetchCashboxesActivitySuccess,
    selectCashOrdersFilters,
    selectCashAccountingFilters,
    printCashOrderSuccess,

    
} from './duck';

import {
    FETCH_CASHBOXES,
    FETCH_CASHBOXES_BALANCE,
    FETCH_CASHBOXES_ACTIVITY,
    FETCH_ANALYTICS,
    CREATE_CASHBOX,
    DELETE_CASHBOX,
    FETCH_CASH_ORDERS,
    PRINT_CASH_ORDERS,
    SET_SEARCH_QUERY,
    OPEN_SHIFT,
} from './duck';

export function* openShiftSaga() {
    while (true) {
        try {
            const {payload} = yield take(OPEN_SHIFT);

            yield nprogress.start();
            // console.log("payload: ", payload);

            const requestPayload = {
                cashboxId: payload
            }

            yield call(fetchAPI, 'POST', '/cashdesk/open_shift', null, requestPayload);

            yield put(fetchCashboxes());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* fetchCashboxesSaga() {
    while (true) {
        try {
            yield take(FETCH_CASHBOXES);
            yield nprogress.start();

            const data = yield call(fetchAPI, 'GET', 'cash_boxes');

            yield put(fetchCashboxesSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* fetchCashboxesBalanceSaga() {
    while (true) {
        try {
            yield take(FETCH_CASHBOXES_BALANCE);
            yield nprogress.start();
            const { date } = yield select(selectCashAccountingFilters);

            const data = yield call(fetchAPI, 'GET', 'cash_boxes/balance', {
                endDate: moment(date).format('YYYY-MM-DD'),
            });

            yield put(fetchCashboxesBalanceSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* fetchCashboxesActivitySaga() {
    while (true) {
        try {
            yield take(FETCH_CASHBOXES_ACTIVITY);
            yield nprogress.start();
            const filters = yield select(selectCashAccountingFilters);

            const data = yield call(
                fetchAPI,
                'GET',
                'cash_boxes/activity',
                _.pick(filters, [ 'startDate', 'endDate' ]),
            );
            yield put(fetchCashboxesActivitySuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* fetchCashOrdersSaga() {
    while (true) {
        try {
            yield take(FETCH_CASH_ORDERS);
            yield put(setCashOrdersFetchingState(true));
            const filters = yield select(selectCashOrdersFilters);

            const data = yield call(fetchAPI, 'GET', 'cash_orders', filters);

            yield put(fetchCashOrdersSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setCashOrdersFetchingState(false));
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

function* handleCashOrdersSearchSaga() {
    try {
        yield delay(1000);
        yield put(fetchCashOrders());
    } catch (error) {
        yield put(emitError(error));
    }
}

export function* createCashboxSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_CASHBOX);
            yield nprogress.start();

            yield call(fetchAPI, 'POST', 'cash_boxes', null, payload);

            yield put(fetchCashboxes());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* deleteCashboxSaga() {
    while (true) {
        try {
            const { payload: id } = yield take(DELETE_CASHBOX);
            yield nprogress.start();

            yield call(fetchAPI, 'DELETE', `cash_boxes/${id}`);

            yield put(fetchCashboxes());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* printCashOrdersSaga() {
    while (true) {
        try {
            yield take(PRINT_CASH_ORDERS);
            yield nprogress.start();
            const filters = yield select(selectCashOrdersFilters);
            delete filters.page;
            const response = yield call(
                fetchAPI,
                'GET',
                'cash_orders/pdf',
                filters,
                null,
                { rawResponse: true },
            );

            const reportFile = yield response.blob();

            const contentDispositionHeader = response.headers.get(
                'content-disposition',
            );
            const fileName = contentDispositionHeader.match(
                /^attachment; filename="(.*)"/,
            )[ 1 ];
            yield saveAs(reportFile, fileName);
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([
        call(openShiftSaga),
        call(fetchCashboxesSaga),
        call(fetchCashboxesBalanceSaga),
        call(fetchCashboxesActivitySaga),
        call(createCashboxSaga),
        call(deleteCashboxSaga),
        call(printCashOrdersSaga),
        call(fetchCashOrdersSaga),
        call(fetchAnalyticsSaga),
        takeLatest(SET_SEARCH_QUERY, handleCashOrdersSearchSaga),
    ]);
}
