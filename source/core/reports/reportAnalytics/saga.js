// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
// import nprogress from 'nprogress';
// import { saveAs } from 'file-saver';

//proj
import { fetchAPI } from 'utils';
// import {setReportOrdersFetching, emitError} from 'core/ui/duck';

// own
import {
    fetchReportAnalyticsSuccess,
    deleteReportAnalyticsSuccess,
    createReportAnalyticsSuccess
} from './duck';

import {
    FETCH_REPORT_ANALYTICS,
    DELETE_REPORT_ANALYTICS,
    CREATE_REPORT_ANALYTICS
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

export function* deleteReportAnalyticsSaga() {
    while (true) {
        try {
            yield take(DELETE_REPORT_ANALYTICS);
            // yield put(setReportOrdersFetching(true));

            yield call(
                fetchAPI,
                'DELETE',
                `/report/analytics`
            );
            yield put(deleteReportAnalyticsSuccess());
        } finally {
            // yield put(setReportOrdersFetching(false));
        }
    }
}

// export function* createReportAnalyticsSaga() {
//     while (true) {
//         try {
//             const {analyticsEntity} = yield take(CREATE_REPORT_ANALYTICS);
//             // yield put(setReportOrdersFetching(true));

//             yield call(
//                 fetchAPI,
//                 'POST',
//                 `/report/analytics`,
//                 null,
//                 analyticsEntity
//             );
//             yield put(createReportAnalyticsSuccess());
//         } finally {
//             // yield put(setReportOrdersFetching(false));
//         }
//     }
// }


export function* saga() {
    yield all([ call(fetchReportAnalyticsSaga), call(deleteReportAnalyticsSaga) ]);
}
