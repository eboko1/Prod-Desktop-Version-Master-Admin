// vendor
import { all, call, put, take, takeEvery } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
// import nprogress from 'nprogress';

// proj
import { setUser } from 'core/user/duck';
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

// export function* loginSaga({ payload: credentials }) {
export function* loginSaga() {
    while (true) {
        try {
            const { payload: credentials } = yield take(LOGIN);
            console.log('*login111');
            yield put(setAuthFetchingState(true));
            console.log('*login');
            const user = yield call(
                fetchAPI,
                'POST',
                'login',
                null,
                credentials,
            );
            console.log('→ user', user);
            yield put(setUser(user));
            yield setToken(user.token);

            yield put(loginSuccess());
            yield put(replace(`${book.ordersAppointments}`));
        } catch (error) {
            yield put(loginFail(error));
        } finally {
            yield put(setAuthFetchingState(false));
        }
    }
}

export function* logoutSaga() {
    while (true) {
        try {
            yield take(LOGOUT);
            console.log('→ logout');
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
    // yield all([ takeEvery(LOGIN, loginSaga), takeEvery(LOGOUT, logoutSaga) ]);
    yield all([ call(loginSaga), call(logoutSaga) ]);
}
