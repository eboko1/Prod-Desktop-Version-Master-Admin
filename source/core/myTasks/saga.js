// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';

// import nprogress from 'nprogress';

//proj
import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';
// own
import {
    fetchMyTasksSuccess,
    fetchMyTasksFailure,
    FETCH_MY_TASKS,
} from './duck';

export function* fetchMyTasks() {
    while (true) {
        try {
            yield take(FETCH_MY_TASKS);
            yield put(uiActions.setMyTasksFetchingState(true));
            const data = yield call(fetchAPI, 'GET', 'orders/my-tasks');
            yield put(fetchMyTasksSuccess(data));
            yield put(uiActions.setMyTasksFetchingState(false));
        } catch (error) {
            yield put(fetchMyTasksFailure(error));
        } finally {
            yield put(uiActions.setMyTasksFetchingState(false));
        }
    }
}
export function* saga() {
    yield all([ call(fetchMyTasks) ]);
}
