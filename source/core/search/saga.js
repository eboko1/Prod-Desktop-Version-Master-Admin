// vendor
import { call, put, all, takeLatest, delay } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import {
    fetchBusinessesSuccess,
    setIsFetchingBusinesses,
    fetchManagersSuccess,
    setIsFetchingManagers,
} from './duck';

import { SET_BUSINESS_SEARCH_QUERY, SET_MANAGER_SEARCH_QUERY } from './duck';

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

function* handleManagersSearchSaga({ payload: query }) {
    yield delay(1000);

    yield put(setIsFetchingManagers(true));
    const managers = yield call(fetchAPI, 'GET', 'managers/search', {
        search: query,
    });
    yield put(fetchManagersSuccess(managers));
    yield put(setIsFetchingManagers(false));
}

export function* saga() {
    yield all([ takeLatest(SET_BUSINESS_SEARCH_QUERY, handleBusinessesSearchSaga), takeLatest(SET_MANAGER_SEARCH_QUERY, handleManagersSearchSaga) ]);
}
