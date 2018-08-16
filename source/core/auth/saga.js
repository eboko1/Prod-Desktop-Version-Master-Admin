// vendor
import { all, call, put, take, delay, takeEvery } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
// import nprogress from 'nprogress';

// proj
import { emitError } from 'core/ui/duck';
import { setAuthFetchingState } from 'core/ui/duck';
import { setToken, removeToken } from 'utils';
import book from 'routes/book';
import persistor from 'store/store';

// own
import {
    authenticate,
    authenticateSuccess,
    logoutSuccess,
    LOGOUT,
} from './duck';

export function* authenticateSaga(user) {
    try {
        yield put(authenticate(user));
        yield setToken(user.token);
        yield authenticateSuccess();
    } catch (error) {
        yield put(emitError(error));
    }
}

export function* logoutSaga() {
    while (true) {
        try {
            yield take(LOGOUT);

            yield put(setAuthFetchingState(true));

            yield removeToken();
            yield put(replace(`${book.login}`));
            // console.log('→ persistor', persistor);
            yield persistor.purge();
            yield put(logoutSuccess());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setAuthFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(authenticateSaga), call(logoutSaga) ]);
}
