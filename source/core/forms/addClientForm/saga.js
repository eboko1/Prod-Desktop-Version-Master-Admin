// vendor
import { call, put, all, take } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
// import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import { fetchAddClientFormSuccess, FETCH_ADD_CLIENT_FORM } from './duck';

export function* fetchAddClientFormSaga() {
    while (true) {
        yield take(FETCH_ADD_CLIENT_FORM);
        // TODO: change endpoint
        const data = yield call(fetchAPI, 'GET', 'orders/clientForm');

        yield put(fetchAddClientFormSuccess(data));
    }
}

export function* saga() {
    yield all([ call(fetchAddClientFormSaga) ]);
}
