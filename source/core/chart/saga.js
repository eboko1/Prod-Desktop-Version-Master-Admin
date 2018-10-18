// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import _ from 'lodash';
import moment from 'moment';

//proj
import { setChartFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchChartSuccess, FETCH_CHART, selectChartFilter } from './duck';

const getDaterange = (date, period) => {
    const formatDate = (date, range, period) =>
        moment(date)
            .add(range, period)
            .format('YYYY-MM-DD');

    const daterange = {
        month: date => ({
            startDate: formatDate(date, -13, 'M'),
            endDate:   formatDate(date, 1, 'M'),
        }),
        week: date => ({
            startDate: formatDate(date, -84, 'd'),
            endDate:   formatDate(date, 14, 'd'),
            // startDate: formatDate(date, -12, 'w'),
            // endDate:   formatDate(date, 2, 'w'),
        }),
        day: date => ({
            startDate: formatDate(date, -7, 'd'),
            endDate:   formatDate(date, 7, 'd'),
        }),
    };

    const { startDate, endDate } = daterange[ period ](date || new Date());

    return {
        startDate,
        endDate,
    };
};

export function* fetchChartSaga() {
    while (true) {
        try {
            yield take(FETCH_CHART);
            yield put(setChartFetchingState(true));
            const filter = yield select(selectChartFilter);

            const { startDate, endDate } = getDaterange(
                filter.date,
                filter.period,
            );

            const queries = {
                startDate,
                endDate,
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
