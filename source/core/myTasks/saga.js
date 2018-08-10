// vendor
import { call, put, all, take } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import { fetchMyTasksSuccess, FETCH_MY_TASKS } from './duck';

export function* fetchMyTasks() {
    while (true) {
        yield take(FETCH_MY_TASKS);
        yield put(uiActions.setOrderFetchingState(true));
        const data = yield call(fetchAPI, 'GET', 'orders/my-tasks');

        yield put(fetchMyTasksSuccess(data));
        yield put(uiActions.setOrderFetchingState(false));
    }
}
export function* saga() {
    yield all([ call(fetchMyTasks) ]);
}
