// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';
import { emitError } from 'core/ui/duck';

// own
import {
    fetchReportCashFlowSuccess,
    fetchAnalyticsSuccess,
    fetchCashboxesSuccess,

    selectAnalyticsFilters,

    setAnalyticsFetchingState,
    setCashboxesFetchingState
} from './duck';

import {
    FETCH_REPORT_CASH_FLOW,
    FETCH_ANALYTICS,
    FETCH_CASHBOXES
} from './duck';

export function* fetchReportCashFlowSaga() {
    while (true) {
        try {
            yield take(FETCH_REPORT_CASH_FLOW);

            const {tableData, stats} = yield call( fetchAPI, 'GET', `/report/cash_flow`);

            yield put(fetchReportCashFlowSuccess({tableData, stats}));
        } catch(err) {
            emitError(err);
        }
    }
}

export function* fetchAnalyticsSaga() {
    while (true) {
        try {
            yield take(FETCH_ANALYTICS);

            yield put(setAnalyticsFetchingState(true));

            const filters = yield select(selectAnalyticsFilters);

            const {analytics} = yield call( fetchAPI, 'GET', `/report/analytics`, {filters});

            yield put(fetchAnalyticsSuccess({analytics}));
        } catch(err) {
            emitError(err);
        } finally {
            yield put(setAnalyticsFetchingState(false));
        }
    }
}

export function* fetchCashboxesSaga() {
    while (true) {
        try {
            yield take(FETCH_CASHBOXES);

            yield put(setCashboxesFetchingState(true));

            const cashboxes = yield call( fetchAPI, 'GET', `/cash_boxes`);

            yield put(fetchCashboxesSuccess({cashboxes}));
        } catch(err) {
            emitError(err);
        } finally {
            yield put(setCashboxesFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchReportCashFlowSaga), call(fetchAnalyticsSaga), call(fetchCashboxesSaga) ]);
}
