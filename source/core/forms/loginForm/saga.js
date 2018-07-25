// vendor
import { call, put, all, take } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
// import nprogress from 'nprogress';

//proj
import { uiActions } from 'core/ui/actions';
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
            yield put(uiActions.setAuthFetchingState(true));
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
            yield put(uiActions.emitError(error));
        } finally {
            yield put(uiActions.setAuthFetchingState(false));
            yield put(replace(book.dashboard));
        }
    }
}

export function* saga() {
    yield all([ call(loginFormSaga) ]);
}
