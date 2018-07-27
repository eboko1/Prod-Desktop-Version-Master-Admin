// vendor
import { take, select, call, put, all } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import {
    initDashboardSuccess,
    fetchDashboardSuccess,
    fetchDashboard,
    INIT_DASHBOARD,
    FETCH_DASHBOARD,
    SET_DASHBOARD_MODE,
    // SET_DASHBOARD_WEEK_DATES,
} from './duck';

const selectDashboardMode = state => state.dashboard.mode;
const selectDashboardDate = state => state.dashboard.date;
const selectDashboardStartDate = state => state.dashboard.startDate;

// const STATIONS = selectDashboardMode === 'calendar';

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

            const stations = mode === 'stations';

            yield put(fetchDashboard({ stations }));
        } catch (error) {
            yield put(uiActions.emitError(error));
        }
    }
}

export function* fetchDashboardSaga() {
    while (true) {
        try {
            const {
                payload: { stations },
            } = yield take(FETCH_DASHBOARD);

            yield nprogress.start();

            const beginDate =
                selectDashboardMode === 'calendar'
                    ? yield select(selectDashboardStartDate)
                    : yield select(selectDashboardDate);

            // const mode = yield select(selectDashboardMode);
            // console.log('* beginDate', beginDate);

            const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
                beginDate: beginDate.format('YYYY-MM-DD'),
                stations,
            });

            yield put(fetchDashboardSuccess(data));
        } catch (error) {
            yield put(uiActions.emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

// export function* setDashboardDateSaga() {
//     while (true) {
//         try {
//             yield take(SET_DASHBOARD_WEEK_DATES);
//
//             const weekDates = yield select(selectDashboardStartDate);
//             console.log('* weekDates', weekDates);
//         } catch (error) {
//             yield put(uiActions.emitError(error));
//         } finally {
//             yield put(fetchDashboard({ stations: STATIONS }));
//         }
//     }
// }

export function* saga() {
    yield all([ call(initDashboardSaga), call(fetchDashboardSaga), call(setDashboardModeSaga) ]);
}
