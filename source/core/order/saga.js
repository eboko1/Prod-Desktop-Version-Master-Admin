// vendor
import { call, put, takeEvery, all } from 'redux-saga/effects';
import nprogress from 'nprogress';
import { saveAs } from 'file-saver';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchOrderSuccess,
    fetchOrderFail,
    FETCH_ORDER,
    FETCH_REPORT,
    GET_REPORT,
} from './duck';

export function* fetchOrderSaga({ payload: id }) {
    try {
        yield nprogress.start();
        const data = yield call(fetchAPI, 'GET', `orders/${id}`);

        yield put(fetchOrderSuccess(data));
    } catch (error) {
        yield put(fetchOrderFail(error));
    } finally {
        yield nprogress.done();
    }
}

// export function* fetchReportSaga({ payload: report }) {
export function* fetchReportSaga({ payload: { reportType, id } }) {
    try {
        yield nprogress.start();
        yield call(fetchAPI, 'GET', `orders/reports/${reportType}/${id}`);
    } catch (error) {
        yield put(emitError(error));
    } finally {
        yield nprogress.done();
    }
}

// report
export function* getReportSaga({ payload: report }) {
    try {
        yield nprogress.start();

        const response = yield call(fetchAPI, 'GET', report.link, null, null, {
            rawResponse: true,
        });
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
/* eslint-disable array-element-newline */
export function* saga() {
    yield all([
        takeEvery(FETCH_ORDER, fetchOrderSaga),
        takeEvery(FETCH_REPORT, fetchReportSaga),
        takeEvery(GET_REPORT, getReportSaga),
    ]);
}
/* eslint-enable array-element-newline */
