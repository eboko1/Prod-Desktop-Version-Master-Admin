// vendor
import {
    call,
    put,
    putResolve,
    all,
    take,
    takeLatest,
    takeEvery,
    delay,
    select,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';

// proj
import { authenticate, selectToken } from 'core/auth/duck';
import { setSearchBusinessesFetchingState, emitError } from 'core/ui/duck';
import { SET_MODAL, MODALS } from 'core/modals/duck';

import { fetchAPI } from 'utils';
import book from 'routes/book';

// own
import { SET_SEARCH_QUERY, SET_BUSINESS } from './duck';
import { fetchBusinessesSuccess } from './duck';
import { fetchHeaderData } from 'core/subscription/duck';

function* handleBusinessesSearchSaga({ payload: { query } }) {
    yield delay(1000);

    if (query && query.length > 2) {
        yield put(setSearchBusinessesFetchingState(true));

        const businesses = yield call(fetchAPI, 'GET', 'businesses/search', {
            search: query,
        });
        yield put(fetchBusinessesSuccess(businesses));
        yield put(setSearchBusinessesFetchingState(false));
    }
}

function* onSetModalSaga({ payload }) {
    if (payload === MODALS.SWITCH_BUSINESS) {
        yield put(setSearchBusinessesFetchingState(true));

        const businesses = yield call(fetchAPI, 'GET', 'businesses/search');
        yield put(fetchBusinessesSuccess(businesses));
        yield put(setSearchBusinessesFetchingState(false));
    }
}

function* setBusinessSaga() {
    while (true) {
        try {
            const { payload: businessId } = yield take(SET_BUSINESS);

            const user = yield call(
                fetchAPI,
                'POST',
                'managers/businesses/set',
                void 0,
                {
                    businessId,
                },
            );
            const token = yield select(selectToken);
            yield putResolve(authenticate({ ...user, token }));
            // yield putResolve(fetchHeaderData(true));
            yield put(push(book.dashboard));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* saga() {
    /* eslint-disable array-element-newline */
    yield all([
        takeLatest(SET_SEARCH_QUERY, handleBusinessesSearchSaga),
        takeEvery(SET_MODAL, onSetModalSaga),
        call(setBusinessSaga),
    ]);
    /* eslint-enable array-element-newline */
}
