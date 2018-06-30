// vendor
import { call, put, all, take } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
// import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import { fetchAddOrderFormSuccess, FETCH_ADD_CLIENT_FORM } from './duck';

export function* fetchAddOrderFormSaga() {
    while (true) {
        yield take(FETCH_ADD_CLIENT_FORM);
        // TODO: change endpoint
        const data = yield call(fetchAPI, 'GET', 'orders/clientForm');

        yield put(fetchAddOrderFormSuccess(data));
    }
}

export function* saga() {
    yield all([ call(fetchAddOrderFormSaga) ]);
}
