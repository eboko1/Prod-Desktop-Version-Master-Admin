// vendor
import {
    call,
    put,
    all,
    takeLatest,
    delay,
} from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import { fetchBusinessesSuccess, setIsFetchingBusinesses } from './duck';

import { SET_BUSINESS_SEARCH_QUERY } from './duck';

function* handleBusinessesSearchSaga({ payload: query }) {
    yield delay(1000);

    if (query && query.length > 2) {
        yield put(setIsFetchingBusinesses(true));
        const businesses = yield call(fetchAPI, 'GET', 'businesses/search', {
            search: query,
        });
        yield put(fetchBusinessesSuccess(businesses));
        yield put(setIsFetchingBusinesses(false));
    }
}

export function* saga() {
    yield all([ takeLatest(SET_BUSINESS_SEARCH_QUERY, handleBusinessesSearchSaga) ]);
}
