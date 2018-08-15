// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { setMyTasksFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchMyTasksSuccess, FETCH_MY_TASKS } from './duck';

export function* fetchMyTasks() {
    while (true) {
        try {
            const { payload: page } = yield take(FETCH_MY_TASKS);
            yield put(setMyTasksFetchingState(true));
            const data = yield call(
                fetchAPI,
                'GET',
                `orders/my-tasks?page=${page}`,
            );

            yield put(fetchMyTasksSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setMyTasksFetchingState(false));
        }
    }
}
export function* saga() {
    yield all([ call(fetchMyTasks) ]);
}
