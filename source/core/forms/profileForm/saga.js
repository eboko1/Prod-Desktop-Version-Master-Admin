// vendor
import { call, put, all, take } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchProfileFormSuccess, FETCH_PROFILE_FORM } from './duck';

export function* fetchProfileFormSaga() {
    while (true) {
        try {
            yield take(FETCH_PROFILE_FORM);
            const data = yield call(fetchAPI, 'GET', 'orders/filter');

            yield put(fetchProfileFormSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* saga() {
    yield all([ call(fetchProfileFormSaga) ]);
}
