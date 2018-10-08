// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import _ from 'lodash';

//proj
import { setChartFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchChartSuccess, FETCH_CHART, selectChartFilter } from './duck';

export function* fetchChartSaga() {
    while (true) {
        try {
            const { payload: daterange } = yield take(FETCH_CHART);
            yield put(setChartFetchingState(true));
            const filter = yield select(selectChartFilter);
            const queries = {
                ...daterange,
                ..._.omit(filter, [ 'date' ]),
            };
            const data = yield call(fetchAPI, 'GET', 'kpi', queries);
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
