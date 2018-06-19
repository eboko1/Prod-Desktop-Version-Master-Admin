// vendor
import { call, put, takeEvery, all } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { fetchAPI } from 'utils';

// own
import {
    fetchOrderSuccess,
    fetchOrderFail,
    FETCH_ORDER,
    FETCH_REPORT,
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
        // console.log('payload', payload);
        console.log('reportType', reportType);
        console.log('id', id);
        const response = yield call(
            fetchAPI,
            'GET',
            `orders/reports/${reportType}/${id}`,
            // report,
        );

        // const data = yield call([ response, response.json ]);
        if (response.status !== 200) {
            throw new Error(response.message);
        }
    } catch (error) {
        yield put(fetchReportSaga(error));
    } finally {
        yield nprogress.done();
    }
}

export function* saga() {
    yield all([ takeEvery(FETCH_ORDER, fetchOrderSaga), takeEvery(FETCH_REPORT, fetchReportSaga) ]);
}
