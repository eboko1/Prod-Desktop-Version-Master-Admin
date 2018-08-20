// vendor
import {
    call,
    put,
    all,
    take,
    takeLatest,
    delay,
    select,
} from 'redux-saga/effects';
import { go } from 'react-router-redux';

// proj
import { authenticate, selectToken } from 'core/auth/duck';
import { setSearchBusinessesFetchingState } from 'core/ui/duck';

import { fetchAPI } from 'utils';
import book from 'routes/book';

// own
import { SET_SEARCH_QUERY, SET_BUSINESS } from './duck';
import { fetchBusinessesSuccess } from './duck';

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

function* setBusinessSaga() {
    while (true) {
        const {
            payload: { id },
        } = yield take(SET_BUSINESS);

        const user = yield call(
            fetchAPI,
            'POST',
            'managers/businesses/set',
            void 0,
            {
                businessId: id,
            },
        );
        const token = yield select(selectToken);
        yield put(authenticate({ ...user, token }));

        yield put(go(book.dashboard));
    }
}

export function* saga() {
    yield all([ takeLatest(SET_SEARCH_QUERY, handleBusinessesSearchSaga), call(setBusinessSaga) ]);
}
