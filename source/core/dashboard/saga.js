// vendor
import { call, put, takeEvery, all } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import {
    fetchDashboardSuccess,
    fetchPostsLoadSuccess,
    FETCH_DASHBOARD,
    FETCH_POSTS_LOAD,
} from './duck';

export function* fetchDashboardSaga({ payload: { beginDate, stations } }) {
    yield put(uiActions.setDashboardFetchingState(true));
    console.log('→ *fetchDashboardSaga beginDate', beginDate, stations);
    const data = yield call(fetchAPI, 'GET', 'dashboard/orders', {
        beginDate,
        stations,
    });

    yield put(fetchDashboardSuccess(data));
    yield put(uiActions.setDashboardFetchingState(false));
}

export function* fetchPostsLoadSaga() {
    yield nprogress.start();
    const data = yield call(fetchAPI, 'GET', 'dashboard/loading');

    yield put(fetchPostsLoadSuccess(data));
    yield nprogress.done();
}

export function* saga() {
    yield all([ takeEvery(FETCH_DASHBOARD, fetchDashboardSaga), takeEvery(FETCH_POSTS_LOAD, fetchPostsLoadSaga) ]);
}
