// vendor
import { all, call, put, take } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import nprogress from 'nprogress';

// proj
import { setAuthFetchingState } from 'core/ui/duck';
import { fetchAPI, setToken, removeToken } from 'utils';
import book from 'routes/book';

// own
import {
    loginSuccess,
    loginFail,
    logoutSuccess,
    logoutFail,
    LOGIN,
    LOGOUT,
} from './duck';

export function* loginSaga() {
    while (true) {
        try {
            const { payload: credentials } = yield take(LOGIN);
            yield nprogress.start();
            const data = yield call(
                fetchAPI,
                'POST',
                'login',
                null,
                credentials,
            );

            yield setToken(data.token);

            yield put(loginSuccess());
            yield put(replace(`${book.ordersAppointments}`));
        } catch (error) {
            yield put(loginFail(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* logoutSaga() {
    while (true) {
        try {
            yield take(LOGOUT);
            yield put(setAuthFetchingState(true));

            yield removeToken();

            yield put(logoutSuccess());
            yield put(replace(`${book.login}`));
        } catch (error) {
            yield put(logoutFail(error));
        } finally {
            yield put(setAuthFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(loginSaga), call(logoutSaga) ]);
}
