// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import { saveAs } from 'file-saver';

//proj
import { fetchAPI } from 'utils';
import { emitError } from 'core/ui/duck';

// own
import {
    fetchReportCashFlowSuccess,
    fetchAnalyticsSuccess,
    fetchCashboxesSuccess,
    fetchExcelFileReportSuccess,

    selectAnalyticsFilters,
    selectCashFlowFilters,

    setAnalyticsFetchingState,
    setCashboxesFetchingState
} from './duck';

import {
    FETCH_REPORT_CASH_FLOW,
    FETCH_ANALYTICS,
    FETCH_CASHBOXES,
    FETCH_EXCEL_FILE_REPORT
} from './duck';

export function* fetchReportCashFlowSaga() {
    while (true) {
        try {
            yield take(FETCH_REPORT_CASH_FLOW);

            const filters = yield select(selectCashFlowFilters);

            const {tableData, stats} = yield call( fetchAPI, 'GET', `/report/cash_flow`, {filters});

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

export function* fetchExcelFileReportSaga() {
    while(true){
        try {
            yield take(FETCH_EXCEL_FILE_REPORT);

            yield nprogress.start();

            const filters = yield select(selectCashFlowFilters);

            const response = yield call(fetchAPI, 'GET', '/report/cash_flow_report_excel_file', {filters}, null, {
                rawResponse: true,
            });

            const reportFile = yield response.blob();

            const contentDispositionHeader = response.headers.get('content-disposition');
            const fileName = contentDispositionHeader.match(/^attachment; filename="(.*)"/)[ 1 ];

            yield saveAs(reportFile, fileName);
            yield put(fetchExcelFileReportSuccess());        
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([ call(fetchReportCashFlowSaga), call(fetchAnalyticsSaga), call(fetchCashboxesSaga), call(fetchExcelFileReportSaga) ]);
}
