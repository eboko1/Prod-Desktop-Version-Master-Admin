// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';
import { emitError} from 'core/ui/duck';

// own
import {
    fetchReportAnalyticsSuccess,
    deleteReportAnalyticsSuccess,
    resetAllReportAnalyticsSuccess,
} from './duck';

import {
    FETCH_REPORT_ANALYTICS,
    DELETE_REPORT_ANALYTICS,
    RESET_ALL_REPORT_ANALYTICS
} from './duck';

export function* fetchReportAnalyticsSaga() {
    while (true) {
        try {
            yield take(FETCH_REPORT_ANALYTICS);

            const data = yield call(
                fetchAPI,
                'GET',
                `/report/analytics`
            );
            yield put(fetchReportAnalyticsSuccess(data));
        } catch(err) {
            emitError(err);
        }
    }
}

export function* deleteReportAnalyticsSaga() {
    while (true) {
        try {
            const {payload: {analyticsId}} = yield take(DELETE_REPORT_ANALYTICS);

            const filters = {analyticsId};

            yield call(
                fetchAPI,
                'DELETE',
                `/report/analytics`,
                {filters}
            );
            yield put(deleteReportAnalyticsSuccess());
        } catch(err) {
            emitError(err);
        }
    }
}

export function* resetAllReportAnalytics() {
    while(true) {
        try {
            const {payload: {areYouSureToDeleteAll}} = yield take(RESET_ALL_REPORT_ANALYTICS);

            yield call(fetchAPI, 'DELETE', `/report/analytics`, {areYouSureToDeleteAll});

            yield put(resetAllReportAnalyticsSuccess());
        } catch(err) {
            emitError(err);
        }
    }
}


export function* saga() {
    yield all([ call(fetchReportAnalyticsSaga), call(deleteReportAnalyticsSaga), call(resetAllReportAnalytics) ]);
}
