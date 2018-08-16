// vendor
import { all, call, put, take } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import { purgeStoredState } from 'redux-persist';
// import nprogress from 'nprogress';

// proj
import { emitError } from 'core/ui/duck';
import { setAuthFetchingState } from 'core/ui/duck';
import { setToken, removeToken } from 'utils';
import book from 'routes/book';
import persistor from 'store/store';
import { persistConfig } from 'store/rootReducer';

// own
import {
    authenticateSuccess,
    logoutSuccess,
    AUTHENTICATE,
    LOGOUT,
} from './duck';

export function* authenticateSaga() {
    while (true) {
        try {
            const { payload: user } = yield take(AUTHENTICATE);

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
            yield removeToken();
            yield put(replace(`${book.login}`));
            // yield put(purge(ReducerState));

            yield purgeStoredState(persistConfig);
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
