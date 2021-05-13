// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
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
                startDate: filter.startDate,
                endDate:   filter.endDate,
                statusIn:  config[ filter.mode ], //Fetch calls base on a selected mode(all calls, or answered types or missed...)
                page:      filter.page,
                channelId: filter.channelId,
                clientId:  filter.clientId,
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
                startDate:   filter.startDate,
                endDate:     filter.endDate,
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
