// vendor
import { take, select, call, put, all } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import {
    initDashboardSuccess,
    fetchDashboardCalendarSuccess,
    fetchDashboardStationsSuccess,
    setDashboardWeekDates,
    setDashboardDate,
    INIT_DASHBOARD,
    SET_DASHBOARD_MODE,
    SET_DASHBOARD_WEEK_DATES,
    SET_DASHBOARD_DATE,
    selectDashboardMode,
    selectDashboardDate,
    selectDashboardStartDate,
    selectDashboardEndDate,
} from './duck';

export function* initDashboardSaga() {
    while (true) {
        try {
            const {
                payload: { stations },
            } = yield take(INIT_DASHBOARD);

            yield put(uiActions.setDashboardFetchingState(true));

            const beginDate =
                selectDashboardMode === 'calendar'
                    ? yield select(selectDashboardStartDate)
                    : yield select(selectDashboardDate);

            const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
                beginDate: beginDate.format('YYYY-MM-DD'),
                stations,
            });

            yield put(initDashboardSuccess(data));
        } catch (error) {
            yield put(uiActions.emitError(error));
        } finally {
            yield put(uiActions.setDashboardFetchingState(false));
        }
    }
}

export function* setDashboardModeSaga() {
    while (true) {
        try {
            const { payload: mode } = yield take(SET_DASHBOARD_MODE);

            // const stations = yield select(selectDashboardMode);

            if (mode === 'calendar') {
                const startDate = yield select(selectDashboardStartDate);
                const endDate = yield select(selectDashboardEndDate);

                yield put(setDashboardWeekDates({ startDate, endDate }));
            }

            if (mode === 'stations') {
                const date = yield select(selectDashboardDate);
                yield put(setDashboardDate(date));
            }
        } catch (error) {
            yield put(uiActions.emitError(error));
        }
    }
}

export function* fetchDashboardCalendarSaga() {
    while (true) {
        try {
            yield take(SET_DASHBOARD_WEEK_DATES);
            yield nprogress.start();

            const beginDate = yield select(selectDashboardStartDate);

            const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
                stations:  false,
                beginDate: beginDate.format('YYYY-MM-DD'),
            });

            yield put(fetchDashboardCalendarSuccess(data));
        } catch (error) {
            yield put(uiActions.emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* fetchDashboardStationsSaga() {
    while (true) {
        try {
            yield take(SET_DASHBOARD_DATE);

            yield nprogress.start();
            const beginDate = yield select(selectDashboardDate);

            const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
                stations:  true,
                beginDate: beginDate.format('YYYY-MM-DD'),
            });

            yield put(fetchDashboardStationsSuccess(data));
        } catch (error) {
            yield put(uiActions.emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

/* eslint-disable array-element-newline */
export function* saga() {
    yield all([
        call(initDashboardSaga),
        call(fetchDashboardCalendarSaga),
        call(fetchDashboardStationsSaga),
        call(setDashboardModeSaga),
    ]);
}
/* eslint-enable array-element-newline */
