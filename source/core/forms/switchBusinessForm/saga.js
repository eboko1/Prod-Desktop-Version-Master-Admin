// vendor
import { call, put, all, take, takeLatest, delay } from 'redux-saga/effects';
import { go } from 'react-router-redux';

// proj
import { fetchAPI } from 'utils';

// own
import { SET_SEARCH_QUERY, SET_BUSINESS } from 'core/forms/switchForm/duck';
import { fetchBusinessesSuccess } from 'core/forms/switchForm/duck';
import { setSearchBusinessesFetchingState } from 'core/ui/duck';

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

        yield call(fetchAPI, 'POST', 'managers/businesses/set', void 0, {
            businessId: id,
        });

        yield put(go('/orders/appointments'));
    }
}

export function* saga() {
    yield all([ takeLatest(SET_SEARCH_QUERY, handleBusinessesSearchSaga), call(setBusinessSaga) ]);
}
