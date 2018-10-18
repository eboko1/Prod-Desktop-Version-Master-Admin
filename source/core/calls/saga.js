// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import moment from 'moment';
import _ from 'lodash';

//proj
import {
    setCallsFetchingState,
    setCallsChartFetchingState,
    emitError,
} from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { config } from './config';
import {
    selectCallsFilter,
    fetchCallsSuccess,
    fetchCallsChartSuccess,
    FETCH_CALLS,
    FETCH_CALLS_CHART,
} from './duck';

export function* fetchCallsSaga() {
    while (true) {
        try {
            yield take(FETCH_CALLS);
            // yield put(setCallsFetchingState(true));
            const filter = yield select(selectCallsFilter);

            const queries = {
                startDate: moment(filter.startDate).format('YYYY-MM-DD'),
                endDate:   moment(filter.endDate).format('YYYY-MM-DD'),
                statusIn:  config[ filter.mode ],
                page:      filter.page,
                channelId: filter.channelId,
                // ..._.omit(filter, [ 'period', 'mode' ]),
            };

            const data = yield call(fetchAPI, 'GET', 'calls', queries);
            yield put(fetchCallsSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            // yield put(setCallsFetchingState(false));
        }
    }
}

export function* fetchCallsChartSaga() {
    while (true) {
        try {
            yield take(FETCH_CALLS_CHART);
            yield put(setCallsChartFetchingState(true));
            const filter = yield select(selectCallsFilter);
            const queries = {
                startDate: moment(filter.startDate).format('YYYY-MM-DD'),
                endDate:   moment(filter.endDate).format('YYYY-MM-DD'),
                channelId: filter.channelId,
            };

            const data = yield call(fetchAPI, 'GET', 'calls/chart', queries);
            yield put(fetchCallsChartSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setCallsChartFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchCallsSaga), call(fetchCallsChartSaga) ]);
}
