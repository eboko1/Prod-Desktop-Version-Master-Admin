// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { setReviewFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchReviewsSuccess, FETCH_REVIEW } from './duck';

export function* fetchReviewsSaga() {
    while (true) {
        try {
            yield take(FETCH_REVIEW);
            yield put(setReviewFetchingState(true));

            const data = yield call(fetchAPI, 'GET', 'reviews');
            yield put(fetchReviewsSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setReviewFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchReviewsSaga) ]);
}
