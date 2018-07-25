// vendor
import { take, select, call, put, takeEvery, all } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import { fetchDashboardSuccess, FETCH_DASHBOARD } from './duck';

const selectDashboardMode = state => state.dashboard.mode;
const selectDashboardDate = state => state.dashboard.date;
const selectDashboardStartDate = state => state.dashboard.startDate;

export function* fetchDashboardSaga() {
    while (true) {
        const {
            payload: { stations },
        } = yield take(FETCH_DASHBOARD);

        yield put(uiActions.setDashboardFetchingState(true));
        const beginDate =
            selectDashboardMode === 'calendar'
                ? yield select(selectDashboardStartDate)
                : yield select(selectDashboardDate);
        // console.log('→ date', beginDate.format('YYYY-MM-DD'));
        const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
            stations,
            // beginDate,
            beginDate: beginDate.format('YYYY-MM-DD'),
        });

        yield put(fetchDashboardSuccess(data));
        yield put(uiActions.setDashboardFetchingState(false));
    }
}

export function* saga() {
    yield all([ call(fetchDashboardSaga) ]);
}

// takeEvery(FETCH_DASHBOARD, fetchDashboardSaga),
