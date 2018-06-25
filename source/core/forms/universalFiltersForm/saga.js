// vendor
import { call, put, all, take } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
// import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import { fetchUniversalFiltersSuccess, FETCH_UNIVERSAL_FILTERS } from './duck';

export function* fetchUniversalFiltersSaga() {
    while (true) {
        yield take(FETCH_UNIVERSAL_FILTERS);
        const data = yield call(fetchAPI, 'GET', 'orders/filter');

        yield put(fetchUniversalFiltersSuccess(data));
    }
}

export function* saga() {
    yield all([ call(fetchUniversalFiltersSaga) ]);
}
