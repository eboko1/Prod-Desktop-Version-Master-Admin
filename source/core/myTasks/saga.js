// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import _ from 'lodash';

//proj
import { setMyTasksFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchMyTasksSuccess, FETCH_MY_TASKS } from './duck';
const selectFilter = ({ myTasksContainer: { managerId, filters } }) => ({
    filter: filters,
    managerId,
});
export function* fetchMyTasks() {
    while (true) {
        try {
            const {
                payload: { firstLoading },
            } = yield take(FETCH_MY_TASKS);
            if (firstLoading) {
                yield put(setMyTasksFetchingState(true));
            }
            // const { filter } = yield select(selectFilter);
            const { filter, managerId } = yield select(selectFilter);

            const queryFilters = {
                ...filter.status === 'active' ? { notInStatus: 'CLOSED' } : {},
                managerId,
                page:             filter.page,
                query:            filter.query,
                sortField:        filter.sortField,
                sortOrder:        filter.sortOrder,
                deadlineDateFrom: _.get(filter, 'daterange.startDate'),
                deadlineDateTo:   _.get(filter, 'daterange.endDate'),
            };
            const url = 'orders/my-tasks';
            const data = yield call(fetchAPI, 'GET', url, queryFilters);

            yield put(fetchMyTasksSuccess(data));
            if (firstLoading) {
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
