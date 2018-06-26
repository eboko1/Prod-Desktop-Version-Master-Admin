// vendor
import { call, put, all, take } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
// import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import { fetchAddOrderFormSuccess, FETCH_ADD_ORDER_FORM } from './duck';

export function* fetchAddOrderFormSaga() {
    while (true) {
        yield take(FETCH_ADD_ORDER_FORM);
        const data = yield call(fetchAPI, 'GET', 'orders/form');

        yield put(fetchAddOrderFormSuccess(data));
    }
}

export function* saga() {
    yield all([ call(fetchAddOrderFormSaga) ]);
}
