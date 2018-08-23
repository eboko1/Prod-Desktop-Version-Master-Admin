// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchEmployeeSuccess, FETCH_EMPLOYEES } from './duck';

export function* fetchMyTasks() {
    while (true) {
        try {
            const { payload: {page, kind} } = yield take(FETCH_EMPLOYEES);
            const data = yield call(
                fetchAPI,
                'GET',
                kind==='all'?'employees':
                    kind==='disabled'?'employees?disabled=true':'employees?disabled=false',
            );

            yield put(fetchEmployeeSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}
export function* saga() {
    yield all([ call(fetchMyTasks) ]);
}
