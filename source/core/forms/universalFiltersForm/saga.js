// vendor
import { call, put, all, take, takeEvery } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
// import { fetchStatsCountsSuccess } from 'core/orders/duck';
// import { fetchClientsStatsCountsSuccess } from 'core/clients/duck';
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchStatsCountsSuccess,
    fetchUniversalFiltersFormSuccess,
    FETCH_UNIVERSAL_FILTERS_FORM,
    FETCH_STATS_COUNTS_PANEL,
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

export function* fetchStatsSaga() {
    try {
        yield nprogress.start();
        console.log('*fetchStatsCountsSaga111');
        const data = yield call(fetchAPI, 'GET', 'orders');
        console.log('* fetchStatsCountsSaga222', data);
        yield put(fetchStatsCountsSuccess(data.stats));
    } catch (error) {
        yield put(emitError(error));
    } finally {
        yield nprogress.done();
    }
}

export function* saga() {
    /* eslint-disable array-element-newline */
    yield all([
        call(fetchUniversalFiltersFormSaga),
        takeEvery(FETCH_STATS_COUNTS_PANEL, fetchStatsSaga),
    ]);
    /* eslint-enable array-element-newline */
}
