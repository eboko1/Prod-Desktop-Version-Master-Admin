// vendor
import { call, put, all, take } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
// import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import {
    fetchUniversalFiltersFormSuccess,
    FETCH_UNIVERSAL_FILTERS_FORM,
} from './duck';

export function* fetchUniversalFiltersFormSaga() {
    while (true) {
        yield take(FETCH_UNIVERSAL_FILTERS_FORM);
        const data = yield call(fetchAPI, 'GET', 'orders/filter');

        yield put(fetchUniversalFiltersFormSuccess(data));
    }
}

export function* saga() {
    yield all([ call(fetchUniversalFiltersFormSaga) ]);
}
