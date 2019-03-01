//vendor
import { all, call, put, take } from 'redux-saga/effects';

// proj
import { setHeaderFetchingState } from 'core/ui/duck';

import { getCookie, setCookie, fetchAPI } from 'utils';

// own
import { fetchHeaderDataSuccess, FETCH_HEADER_DATA } from './duck';

export function* headerDataSaga() {
    while (true) {
        try {
            const { payload: force } = yield take(FETCH_HEADER_DATA);
            if (!navigator.cookieEnabled) {
                console.info(
                    'Please, turn on your cookies for the proper application workflow!',
                );
            }

            if (force) {
                yield put(setHeaderFetchingState(true));
                // 1h 3600 * 1000(ms)
                const expires = new Date(
                    new Date().getTime() + 1800 * 1000,
                ).toUTCString();

                setCookie('@@my.carbook.pro/header', 'subscribe', { expires });
                const response = yield call(fetchAPI, 'GET', '/header');
                yield put(fetchHeaderDataSuccess(response));
                yield put(setHeaderFetchingState(false));
            }
            if (!force) {
                if (!getCookie('@@my.carbook.pro/header')) {
                    yield put(setHeaderFetchingState(true));
                    // 1h 3600 * 1000(ms)
                    const expires = new Date(
                        new Date().getTime() + 1800 * 1000,
                    ).toUTCString();

                    setCookie('@@my.carbook.pro/header', 'subscribe', {
                        expires,
                    });
                    const response = yield call(fetchAPI, 'GET', '/header');
                    yield put(fetchHeaderDataSuccess(response));
                    yield put(setHeaderFetchingState(false));
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

export function* saga() {
    yield all([ call(headerDataSaga) ]);
}
