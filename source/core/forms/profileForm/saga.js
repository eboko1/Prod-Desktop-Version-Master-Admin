// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { submitProfileSuccess, SUBMIT_PROFILE_FORM } from './duck';

export function* submitProfileFormSaga() {
    while (true) {
        try {
            const { payload: user } = yield take(SUBMIT_PROFILE_FORM);
            yield nprogress.start();
            yield call(fetchAPI, 'PUT', '/managers', null, user);

            yield put(submitProfileSuccess());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([ call(submitProfileFormSaga) ]);
}
