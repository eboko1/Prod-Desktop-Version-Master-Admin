// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { setCallsFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchCallsSuccess, FETCH_CALLS } from './duck';

export function* fetchCallsSaga() {
    while (true) {
        try {
            yield take(FETCH_CALLS);
            yield put(setCallsFetchingState(true));

            const data = yield call(fetchAPI, 'GET', 'calls');
            yield put(fetchCallsSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setCallsFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchCallsSaga) ]);
}
