// vendor
import { call, put, all, take } from 'redux-saga/effects';
import { replace } from 'connected-react-router';

//proj
import { authenticate } from 'core/auth/duck';
import { setAuthFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';
import book from 'routes/book';

// own
import { loginSuccess, LOGIN } from './duck';

export function* loginFormSaga() {
    while (true) {
        try {
            const {
                payload: { ...credentials },
            } = yield take(LOGIN);

            yield put(setAuthFetchingState(true));
            const user = yield call(
                fetchAPI,
                'POST',
                'login',
                null,
                credentials,
                // false,
            );

            yield put(authenticate(user));
            yield put(loginSuccess());
            yield put(replace(book.dashboard));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setAuthFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(loginFormSaga) ]);
}
