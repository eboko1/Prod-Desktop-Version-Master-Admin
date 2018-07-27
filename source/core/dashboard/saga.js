// vendor
import { take, select, call, put, all } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import {
    fetchDashboardSuccess,
    fetchDashboard,
    FETCH_DASHBOARD,
    SET_DASHBOARD_MODE,
} from './duck';

const selectDashboardMode = state => state.dashboard.mode;
const selectDashboardDate = state => state.dashboard.date;
const selectDashboardStartDate = state => state.dashboard.startDate;

export function* fetchDashboardSaga() {
    while (true) {
        try {
            const {
                payload: { stations },
            } = yield take(FETCH_DASHBOARD);

            yield put(uiActions.setDashboardFetchingState(true));

            const beginDate =
                selectDashboardMode === 'calendar'
                    ? yield select(selectDashboardStartDate)
                    : yield select(selectDashboardDate);
            console.log(' *stations', stations);
            const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
                beginDate: beginDate.format('YYYY-MM-DD'),
                stations,
            });

            yield put(fetchDashboardSuccess(data));
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
            console.log('*mode', mode);
            const stations = mode === 'stations';
            console.log(' *stations', stations);
            yield put(fetchDashboard({ stations }));
        } catch (error) {
            yield put(uiActions.emitError(error));
        }
    }
}

export function* saga() {
    yield all([ call(fetchDashboardSaga), call(setDashboardModeSaga) ]);
}
