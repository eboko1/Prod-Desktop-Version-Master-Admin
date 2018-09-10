// vendor
import {
    call,
    put,
    all,
    take,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchUniversalFiltersFormSuccess,
    FETCH_UNIVERSAL_FILTERS_FORM,
} from './duck';

export function* fetchUniversalFiltersFormSaga() {
    while (true) {
        try {
            yield take(FETCH_UNIVERSAL_FILTERS_FORM);
            const data = yield call(fetchAPI, 'GET', 'orders/filter');

            yield put(fetchUniversalFiltersFormSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* saga() {
    /* eslint-disable array-element-newline */
    yield all([
        call(fetchUniversalFiltersFormSaga),
        // takeEvery(ON_CHANGE_UNIVERSAL_FILTERS_FORM, fetchStatsSaga),
    ]);
    /* eslint-enable array-element-newline */
}
