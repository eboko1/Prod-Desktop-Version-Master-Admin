// vendor
import { call, put, takeEvery, all } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { fetchAPI } from 'utils';

// own
import {
    fetchAddOrderSuccess,
    fetchAddOrderFail,
    FETCH_ADD_ORDER,
} from './duck';

export function* fetchOrderSaga() {
    try {
        yield nprogress.start();
        const response = yield call(fetchAPI, 'GET', '/orders/form');

        const data = yield call([ response, response.json ]);
        if (response.status !== 200) {
            throw new Error(response.message);
        }

        yield put(fetchAddOrderSuccess(data));
    } catch (error) {
        yield put(fetchAddOrderFail(error));
    } finally {
        yield nprogress.done();
    }
}

export function* saga() {
    yield all([ takeEvery(FETCH_ADD_ORDER, fetchOrderSaga) ]);
}
