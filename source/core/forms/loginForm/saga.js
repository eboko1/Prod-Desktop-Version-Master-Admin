// vendor
import { call, put, all, take } from 'redux-saga/effects';
import { replace } from 'react-router-redux';

//proj
import { setAuthFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI, setToken } from 'utils';
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
            const data = yield call(
                fetchAPI,
                'POST',
                'login',
                null,
                credentials,
                // false,
            );

            yield put(loginSuccess(data));
            yield setToken(data.token);
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setAuthFetchingState(false));
            yield put(replace(book.dashboard));
        }
    }
}

export function* saga() {
    yield all([ call(loginFormSaga) ]);
}
