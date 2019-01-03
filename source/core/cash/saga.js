// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchCashboxesSuccess,
    createCashboxSuccess,
    deleteCashboxSuccess,
    FETCH_CASHBOXES,
    CREATE_CASHBOX,
    DELETE_CASHBOX,
} from './duck';

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

export function* createCashboxSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_CASHBOX);
            yield nprogress.start();

            const data = yield call(
                fetchAPI,
                'POST',
                'cash_boxes',
                null,
                payload,
            );

            yield put(createCashboxSuccess(data));
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

            const data = yield call(fetchAPI, 'DELETE', `cash_boxes${id}`);

            yield put(deleteCashboxSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([ call(fetchCashboxesSaga), call(createCashboxSaga), call(deleteCashboxSaga) ]);
}
