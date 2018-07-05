import { call, put } from 'redux-saga/effects';
import nprogress from 'nprogress';
import { replace } from 'react-router-redux';

import { authActions } from 'core/auth/actions';
import { fetchAPI, setToken } from 'utils';

export function* loginWorker({ payload: credentials }) {
    try {
        yield nprogress.start();
        const data = yield call(fetchAPI, 'POST', 'login', null, credentials);

        yield setToken(data.token);

        yield put(authActions.loginSuccess());
        yield put(replace('/orders/appointments'));
    } catch (error) {
        yield put(authActions.loginFail(error));
    } finally {
        yield nprogress.done();
    }
}
