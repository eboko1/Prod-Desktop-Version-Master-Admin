// vendor
import { call, put, all, take, takeLatest, delay } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import {
    SEARCH_BUSINESSES,
    SUBMIT_SPREAD_BUSINESS_BRANDS,
    searchBusinessesSuccess,
    submitSpreadBusinessBrandsSuccess,
} from './duck';

export function* searchBusinessesSaga({ payload: { id, query } }) {
    yield delay(1000);
    const data = yield call(fetchAPI, 'GET', '/businesses/search', {
        search: query,
    });

    yield put(searchBusinessesSuccess(id, data));
}

export function* submitSpreadBusinessBrandsSaga() {
    while (true) {
        const {
            payload: { businessId, businessIds },
        } = yield take(SUBMIT_SPREAD_BUSINESS_BRANDS);
        yield call(fetchAPI, 'POST', 'tecdoc/brands/businesses/copy', void 0, {
            businessId,
            businessIds,
        });

        yield put(submitSpreadBusinessBrandsSuccess());
    }
}

export function* saga() {
    yield all([ takeLatest(SEARCH_BUSINESSES, searchBusinessesSaga), call(submitSpreadBusinessBrandsSaga) ]);
}
