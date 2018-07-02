// vendor
import { call, put, all, take } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
// import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import { fetchOrderFormSuccess, FETCH_ORDER_FORM } from './duck';

export function* fetchOrderFormSaga() {
    while (true) {
        const { payload: id } = yield take(FETCH_ORDER_FORM);
        const data = yield call(fetchAPI, 'GET', `orders/${id}`);

        yield put(fetchOrderFormSuccess(data));
    }
}

export function* saga() {
    yield all([ call(fetchOrderFormSaga) ]);
}
