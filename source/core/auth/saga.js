// vendor
import { all, call, put, take } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import { purgeStoredState } from 'redux-persist';
import moment from 'moment';

// proj
import { emitError, setAuthFetchingState } from 'core/ui/duck';
import { persistConfig } from 'store/rootReducer';
import book from 'routes/book';
import { setToken, removeToken, setLocale, removeLocale } from 'utils';

// own
import {
    authenticateSuccess,
    logoutSuccess,
    updateUserSuccess,
    AUTHENTICATE,
    UPDATE_USER,
    LOGOUT,
} from './duck';

export function* authenticateSaga() {
    while (true) {
        try {
            const { payload: user } = yield take(AUTHENTICATE);
            yield setLocale(user.language);
            yield setToken(user.token);
            yield authenticateSuccess();
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* logoutSaga() {
    while (true) {
        try {
            yield take(LOGOUT);

            yield put(setAuthFetchingState(true));
            yield removeLocale();
            yield removeToken();
            yield put(replace(`${book.login}`));

            yield purgeStoredState(persistConfig);
            yield put(logoutSuccess());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setAuthFetchingState(false));
        }
    }
}

export function* updateUserSaga() {
    while (true) {
        try {
            const { payload: user } = yield take(UPDATE_USER);
            yield setLocale(user.language);
            yield put(updateUserSuccess(user));
        } catch {
            yield put(emitError(error));
        }
    }
}

export function* saga() {
    yield all([ call(authenticateSaga), call(logoutSaga), call(updateUserSaga) ]);
}
