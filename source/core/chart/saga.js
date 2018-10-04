// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { setChartFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchChartSuccess, FETCH_CHART } from './duck';

export function* fetchChartSaga() {
    while (true) {
        try {
            yield take(FETCH_CHART);
            yield put(setChartFetchingState(true));

            const data = yield call(fetchAPI, 'GET', 'kpi');
            yield put(fetchChartSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setChartFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchChartSaga) ]);
}
