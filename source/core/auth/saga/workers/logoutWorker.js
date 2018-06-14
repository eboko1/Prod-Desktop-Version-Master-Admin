import { call, put } from 'redux-saga/effects';

import { replace } from 'react-router-redux';

import { authActions } from 'core/auth/actions';
import { uiActions } from 'core/ui/actions';
import { fetchAPI, removeToken } from 'utils';

export function* logoutWorker() {
    try {
        yield put(uiActions.setAuthFetchingState(true));

        // const response = yield call(fetchAPI, 'GET', 'logout');
        //
        // if (response.status !== 200) {
        //     const { message } = yield call([ response, response.json ]);
        //
        //     throw new Error(message);
        // }
        yield removeToken();

        yield put(authActions.logoutSuccess());
        yield put(replace('/login'));
    } catch (error) {
        yield put(authActions.logoutFail(error));
    } finally {
        // yield put(authActions.logoutSuccess());
        yield put(uiActions.setAuthFetchingState(false));
    }
}
