// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { setClientFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchClientSuccess } from './duck';

import { FETCH_CLIENT } from './duck';

export function* fetchClientSaga() {
    while (true) {
        try {
            const {
                payload: { id },
            } = yield take(FETCH_CLIENT);
            yield put(setClientFetchingState(true));

            const data = yield call(fetchAPI, 'GET', `clients/${id}`);
            yield put(fetchClientSuccess(data));
        } finally {
            yield put(setClientFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchClientSaga) ]);
}
