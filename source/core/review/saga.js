// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import {
    setReviewFetchingState,
    setReviewReplyState,
    setReviewComplaintState,
    emitError,
} from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchReviewSuccess,
    postReviewReply,
    postReviewReplySuccess,
    postReviewComplain,
    postReviewComplainSuccess,
    FETCH_REVIEW,
    POST_REVIEW_REPLY,
    POST_REVIEW_REPLY_SUCCESS,
    POST_REVIEW_COMPLAIN,
    POST_REVIEW_COMPLAIN_SUCCESS,
} from './duck';

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

export function* postReviewReplySaga() {
    while (true) {
        try {
            const {
                payload: { id, reply },
            } = yield take(POST_REVIEW_REPLY);
            yield put(setReviewReplyState(true));

            yield call(
                fetchAPI,
                'POST',
                `reviews/${id}/reply`,
                {},
                { message: reply },
            );

            yield put(postReviewReplySuccess(reply));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setReviewReplyState(false));
        }
    }
}

export function* postReviewComplainSaga() {
    while (true) {
        try {
            const {
                payload: { id, complain },
            } = yield take(POST_REVIEW_COMPLAIN);
            yield put(setReviewComplaintState(true));

            yield call(
                fetchAPI,
                'POST',
                `reviews/${id}/complain`,
                {},
                { message: complain },
            );

            yield put(postReviewComplainSuccess(complain));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setReviewComplaintState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchReviewSaga), call(postReviewReplySaga), call(postReviewComplainSaga) ]);
}
