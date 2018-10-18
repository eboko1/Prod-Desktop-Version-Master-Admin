// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { setReviewsFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchReviewsSuccess,
    selectReviewsFilter,
    FETCH_REVIEWS,
} from './duck';

export function* fetchReviewsSaga() {
    while (true) {
        try {
            yield take(FETCH_REVIEWS);
            yield put(setReviewsFetchingState(true));

            const filter = yield select(selectReviewsFilter);

            const data = yield call(fetchAPI, 'GET', 'reviews', filter);
            yield put(fetchReviewsSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setReviewsFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchReviewsSaga) ]);
}
