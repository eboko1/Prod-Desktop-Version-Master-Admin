// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
// import nprogress from 'nprogress';
// import { saveAs } from 'file-saver';

//proj
import { fetchAPI } from 'utils';
// import {setReportOrdersFetching, emitError} from 'core/ui/duck';

// own
import {
    fetchReportAnalyticsSuccess
} from './duck';

import {
    FETCH_REPORT_ANALYTICS
} from './duck';

export function* fetchReportAnalyticsSaga() {
    while (true) {
        try {
            yield take(FETCH_REPORT_ANALYTICS);
            // yield put(setReportOrdersFetching(true));

            const data = yield call(
                fetchAPI,
                'GET',
                `/report/analytics`
            );
            yield put(fetchReportAnalyticsSuccess(data));
        } finally {
            // yield put(setReportOrdersFetching(false));
        }
    }
}


export function* saga() {
    yield all([ call(fetchReportAnalyticsSaga) ]);
}
