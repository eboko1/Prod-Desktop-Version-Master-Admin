// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { setReviewFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchReviewSuccess, FETCH_REVIEW } from './duck';

export function* fetchReviewSaga() {
    while (true) {
        try {
            const {
                payload: { id },
            } = yield take(FETCH_REVIEW);
            yield put(setReviewFetchingState(true));

            const review = yield call(fetchAPI, 'GET', `reviews/${id}`);
            yield put(fetchReviewSuccess(review));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setReviewFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchReviewSaga) ]);
}
