// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import moment from 'moment';
import _ from 'lodash';

//proj
import {
    setCallsFetchingState,
    setCallsChartFetchingState,
    emitError,
    setCallsInitializingState,
} from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { config } from './config';
import {
    selectCallsFilter,
    fetchCallsSuccess,
    fetchCallsChartSuccess,
    fetchRecordingLinkSuccess,
    FETCH_CALLS,
    FETCH_CALLS_CHART,
    FETCH_RECORDING_LINK,
} from './duck';

export function* fetchCallsSaga() {
    while (true) {
        try {
            yield take(FETCH_CALLS);
            yield put(setCallsFetchingState(true));
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
            yield put(setCallsFetchingState(false));
        }
    }
}

export function* fetchCallsChartSaga() {
    while (true) {
        try {
            const { payload: init } = yield take(FETCH_CALLS_CHART);
            if (init) {
                yield put(setCallsInitializingState(true));
            } else {
                yield put(setCallsChartFetchingState(true));
            }

            const filter = yield select(selectCallsFilter);

            const queries = {
                startDate:   moment(filter.startDate).format('YYYY-MM-DD'),
                endDate:     moment(filter.endDate).format('YYYY-MM-DD'),
                channelId:   filter.channelId,
                period:      filter.period,
                statusNotIn: Object.keys(filter.chartModes)
                    .filter(
                        key => filter.chartModes[ key ],
                    ) /* eslint-disable-line */
                    .map(mode => config[ mode ]),
            };

            const data = yield call(fetchAPI, 'GET', 'calls/chart', queries);
            yield put(fetchCallsChartSuccess(data));
            if (init) {
                yield put(setCallsInitializingState(false));
            } else {
                yield put(setCallsChartFetchingState(false));
            }
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* fetchRecordingLinkSaga() {
    while (true) {
        try {
            const { payload: {callId} } = yield take(FETCH_RECORDING_LINK);
            
            const {link} = yield call(fetchAPI, 'GET', `binotel_get_audio_url/${callId}`);

            yield put(fetchRecordingLinkSuccess({callId: callId, recordingLink: link}));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* saga() {
    yield all([ call(fetchCallsSaga), call(fetchCallsChartSaga), call(fetchRecordingLinkSaga) ]);
}
