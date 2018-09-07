// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { setMyTasksFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchMyTasksSuccess, FETCH_MY_TASKS } from './duck';
const selectFilter = ({ myTasksContainer: { filters } }) => ({
    filter: filters,
});
export function* fetchMyTasks() {
    while (true) {
        try {
            const{payload:{firstLoading}}=yield take(FETCH_MY_TASKS);
            if(firstLoading){
                yield put(setMyTasksFetchingState(true));

            }
            // const { filter } = yield select(selectFilter);
            const { filter } = yield select(selectFilter);

            let url = `orders/my-tasks?page=${filter.page}${
                filter.query ? `&query=${filter.query}` : ''
            }&${
                filter.status === 'active' ? 'notInStatus=COMPLETED' : ''
            }&sortField=${filter.sortField}&sortOrder=${filter.sortOrder}${
                filter.daterange.startDate
                    ? `&deadlineDateFrom=${filter.daterange.startDate}`
                    : ''
            }${
                filter.daterange.endDate
                    ? `&deadlineDateTo=${filter.daterange.endDate}`
                    : ''
            }`;
            const data = yield call(fetchAPI, 'GET', url);

            yield put(fetchMyTasksSuccess(data));
            if(firstLoading){

                yield put(setMyTasksFetchingState(false));
            }
        } catch (error) {
            yield put(emitError(error));
        }
    }
}
export function* saga() {
    yield all([ call(fetchMyTasks) ]);
}
