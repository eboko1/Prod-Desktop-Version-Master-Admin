// vendor
import { take, call, put, all, takeLatest } from 'redux-saga/effects';
import { replace } from 'connected-react-router';

//proj
import { authenticate } from 'core/auth/duck';
import { setAuthFetchingState, emitError } from 'core/ui/duck';
import { setErrorMessage } from 'core/errorMessage/duck';
import { fetchAPI } from 'utils';
import book from 'routes/book';

// own
import { loginSuccess, LOGIN } from './duck';

export function* loginFormSaga() {
    while (true) {
        try {
            const {
                payload: { login, password },
            } = yield take(LOGIN);
            yield put(setAuthFetchingState(true));
            const user = yield call(
                fetchAPI,
                'POST',
                'login',
                null,
                { login: login.trim(), password: password.trim() },
                { handleErrorInternally: true },
            );

            yield put(authenticate(user));
            yield put(loginSuccess());
            yield put(replace(book.dashboard));
        } catch (error) {
            yield put(setErrorMessage(error));
        } finally {
            yield put(setAuthFetchingState(false));
        }
    }
}
// export function* loginFormSaga({ payload: { login, password } }) {
//     try {
//         yield put(setAuthFetchingState(true));
//         const user = yield call(
//             fetchAPI,
//             'POST',
//             'login',
//             null,
//             { login: login.trim(), password: password.trim() },
//             { handleErrorInternally: true },
//         );

//         yield put(authenticate(user));
//         yield put(loginSuccess());
//         yield put(replace(book.dashboard));
//     } catch (error) {
//         yield put(setErrorMessage(error));
//     } finally {
//         yield put(setAuthFetchingState(false));
//     }
// }

export function* saga() {
    yield all([ call(loginFormSaga) ]);
    // yield all([ takeLatest(LOGIN, loginFormSaga) ]);
}
