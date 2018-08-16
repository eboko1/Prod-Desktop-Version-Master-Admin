// vendor
import { call, put, all, take, fork } from 'redux-saga/effects';
import { replace } from 'react-router-redux';

//proj
// import { setUser } from 'core/user/duck';
import { authenticateSaga } from 'core/auth/saga';
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
            yield fork(authenticateSaga, user);

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
