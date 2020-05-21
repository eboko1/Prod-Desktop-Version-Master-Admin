// vendor
import { take, select, call, put, all } from 'redux-saga/effects';
import nprogress from 'nprogress';
import _ from 'lodash';
import moment from 'moment';

//proj
import {
    setDashboardInitializingState,
    setDashboardFetchingState,
    emitError,
} from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    initDashboardSuccess,
    fetchDashboardCalendarSuccess,
    fetchDashboardStationsSuccess,
    fetchDashboardEmployeesSuccess,
    setDashboardWeekDates,
    setDashboardStationsDate,
    setDashboardEmployeesDate,
    setDashboardMode,
    updateDashboardOrderSuccess,
    transferOutdateRepairsSuccess,
    refreshDashboard,
    INIT_DASHBOARD,
    SET_DASHBOARD_MODE,
    SET_DASHBOARD_WEEK_DATES,
    SET_DASHBOARD_STATIONS_DATE,
    SET_DASHBOARD_EMPLOYEES_DATE,
    LINK_TO_DASHBOARD_STATIONS,
    LINK_TO_DASHBOARD_EMPLOYEES,
    UPDATE_DASHBOARD_ORDER,
    REFRESH_DASHBOARD,
    TRANSFER_OUTDATED_REPAIRS,
    // selectDashboardMode,
    selectDashboardDate,
    selectDashboardMode,
    selectDashboardStartDate,
    selectDashboardEndDate,
} from './duck';

export function* initDashboardSaga() {
    while (true) {
        try {
            yield take(INIT_DASHBOARD);
            yield put(setDashboardInitializingState(true));
            const beginDate = yield select(selectDashboardStartDate);

            const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
                beginDate: beginDate.format('YYYY-MM-DD'),
                stations:  false,
            });

            yield put(initDashboardSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setDashboardInitializingState(false));
        }
    }
}

export function* setDashboardModeSaga() {
    while (true) {
        try {
            const { payload: mode } = yield take(SET_DASHBOARD_MODE);

            if (mode === 'calendar') {
                const startDate = yield select(selectDashboardStartDate);
                const endDate = yield select(selectDashboardEndDate);

                yield put(setDashboardWeekDates({ startDate, endDate }));
            } else if (mode === 'stations') {
                const date = yield select(selectDashboardDate);
                yield put(setDashboardStationsDate(date));
            } else if (mode === 'employees') {
                const date = yield select(selectDashboardDate);
                yield put(setDashboardEmployeesDate(date));
            }
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* refreshDashboardSaga() {
    while (true) {
        try {
            yield take(REFRESH_DASHBOARD);
            yield nprogress.start();
            //yield put(setDashboardFetchingState(true));

            const mode = yield select(selectDashboardMode);

            if (mode === 'calendar') {
                const beginDate = yield select(selectDashboardStartDate);

                const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
                    stations:  false,
                    beginDate: beginDate.format('YYYY-MM-DD'),
                });

                yield put(fetchDashboardCalendarSuccess(data));
            } else if (mode === 'stations') {
                const beginDate = yield select(selectDashboardDate);
                
                const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
                    stations:  true,
                    beginDate: beginDate.format('YYYY-MM-DD'),
                });

                yield put(fetchDashboardStationsSuccess(data));
            } else if (mode === 'employees') {
                const beginDate = yield select(selectDashboardDate);

                const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
                    employees:  true,
                    beginDate: beginDate.format('YYYY-MM-DD'),
                });

                yield put(fetchDashboardEmployeesSuccess(data));
            }
        } catch (error) {
            yield put(emitError(error));
        } finally {
            //yield put(setDashboardFetchingState(false));
            yield nprogress.done();
        }
    }
}

export function* fetchDashboardCalendarSaga() {
    while (true) {
        try {
            yield take(SET_DASHBOARD_WEEK_DATES);
            yield nprogress.start();
            yield put(setDashboardFetchingState(true));

            const beginDate = yield select(selectDashboardStartDate);

            const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
                stations:  false,
                beginDate: beginDate.format('YYYY-MM-DD'),
            });

            yield put(fetchDashboardCalendarSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setDashboardFetchingState(false));
            yield nprogress.done();
        }
    }
}

export function* fetchDashboardStationsSaga() {
    while (true) {
        try {
            yield take(SET_DASHBOARD_STATIONS_DATE);
            yield nprogress.start();
            yield put(setDashboardFetchingState(true));

            const beginDate = yield select(selectDashboardDate);
            const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
                stations:  true,
                beginDate: beginDate.format('YYYY-MM-DD'),
            });

            yield put(fetchDashboardStationsSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setDashboardFetchingState(false));
            yield nprogress.done();
        }
    }
}

export function* fetchDashboardEmployeesSaga() {
    while (true) {
        try {
            yield take(SET_DASHBOARD_EMPLOYEES_DATE);
            yield nprogress.start();
            yield put(setDashboardFetchingState(true));

            const beginDate = yield select(selectDashboardDate);
            const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
                employees:  true,
                beginDate: beginDate.format('YYYY-MM-DD'),
            });

            yield put(fetchDashboardEmployeesSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setDashboardFetchingState(false));
            yield nprogress.done();
        }
    }
}

export function* linkToDashboardStationsSaga() {
    while (true) {
        try {
            const { payload: day } = yield take(LINK_TO_DASHBOARD_STATIONS);
            yield put(setDashboardStationsDate(moment(day)));
            yield put(setDashboardMode('stations'));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* linkToDashboardEmployeesSaga() {
    while (true) {
        try {
            const { payload: day } = yield take(LINK_TO_DASHBOARD_EMPLOYEES);
            yield put(setDashboardEmployeesDate(moment(day)));
            yield put(setDashboardMode('employees'));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* updateDashboardOrderSaga() {
    while (true) {
        try {
            const { payload: order } = yield take(UPDATE_DASHBOARD_ORDER);
            yield nprogress.start();
            yield call(
                fetchAPI,
                'PUT',
                `/stations/loads/${order.stationLoadId}`,
                {},
                _.omit(order, [ 'stationLoadId', 'employeeId' ]),
            );

            yield put(updateDashboardOrderSuccess());
            yield put(refreshDashboard());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* transferOutdateRepairsSaga() {
    while (true) {
        try {
            yield take(TRANSFER_OUTDATED_REPAIRS);
            yield nprogress.start();

            yield call(fetchAPI, 'POST', '/reschedule/orders');

            yield put(transferOutdateRepairsSuccess());
            yield put(refreshDashboard());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

/* eslint-disable array-element-newline */
export function* saga() {
    yield all([
        call(refreshDashboardSaga),
        call(initDashboardSaga),
        call(fetchDashboardCalendarSaga),
        call(fetchDashboardStationsSaga),
        call(fetchDashboardEmployeesSaga),
        call(setDashboardModeSaga),
        call(linkToDashboardStationsSaga),
        call(linkToDashboardEmployeesSaga),
        call(updateDashboardOrderSaga),
        call(transferOutdateRepairsSaga),
    ]);
}
/* eslint-enable array-element-newline */
