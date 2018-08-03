// vendor
import { call, put, all, take } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
// import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import { fetchProfileFormSuccess, FETCH_PROFILE_FORM } from './duck';

export function* fetchProfileFormSaga() {
    while (true) {
        yield take(FETCH_PROFILE_FORM);
        const data = yield call(fetchAPI, 'GET', 'orders/filter');

        yield put(fetchProfileFormSuccess(data));
    }
}

export function* saga() {
    yield all([ call(fetchProfileFormSaga) ]);
}
