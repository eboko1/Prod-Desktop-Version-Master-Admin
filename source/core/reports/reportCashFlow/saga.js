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

            // const {tableData} = yield call( fetchAPI, 'GET', `/report/cash-flow`);

            //TEMP: while route is not work yet replace result with a plug
            const tableData = [
                {
                    analyticsName: 'Test Profit',
                    analyticsUniqueId: 1,
                    totalIncreaseSum: 200,
                    totalDecreaseSum: 400,
                    totalBalance: -200,
                    children: [
                        {
                            analyticsName: 'Test anali 1',
                            analyticsUniqueId: 2,
                            totalIncreaseSum: 100,
                            totalDecreaseSum: 200,
                            totalBalance: -100,
                        },
                        {
                            analyticsName: 'Test anali 2',
                            analyticsUniqueId: 3,
                            totalIncreaseSum: 100,
                            totalDecreaseSum: 200,
                            totalBalance: -100,
                        },
                    ]
                },
                {
                    analyticsName: 'Another Test Profit',
                    analyticsUniqueId: 4,
                    totalIncreaseSum: 1500,
                    totalDecreaseSum: 600,
                    totalBalance: 900,
                    children: [
                        {
                            analyticsName: 'Test anali 1',
                            analyticsUniqueId: 5,
                            totalIncreaseSum: 1000,
                            totalDecreaseSum: 200,
                            totalBalance: -100,
                        },
                        {
                            analyticsName: 'Test anali 2',
                            analyticsUniqueId: 6,
                            totalIncreaseSum: 500,
                            totalDecreaseSum: 400,
                            totalBalance: -100,
                        },
                    ]
                }
            ];

            const stats = {totalIncreaseSum: 293032.3892, totalDecreaseSum: 1032.98, totalBalance: 100};

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
