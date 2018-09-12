// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchEmployeesSuccess,
    FETCH_EMPLOYEES,
    fetchEmployees,
    DELETE_EMPLOYEE,
    deleteEmployeeSuccess,
} from './duck';

export function* fetchEmployeesSaga() {
    while (true) {
        try {
            yield take(FETCH_EMPLOYEES);

            const filter = yield select(state => state.employees.filter);

            const data = yield call(fetchAPI, 'GET', 'employees', filter);

            yield put(fetchEmployeesSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}
export function* deleteEmployee() {
    while (true) {
        try {
            const { payload: id } = yield take(DELETE_EMPLOYEE);

            const data = yield call(fetchAPI, 'DELETE', `employees/${id}`);

            yield put(deleteEmployeeSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(fetchEmployees());
        }
    }
}
export function* saga() {
    yield all([ call(fetchEmployeesSaga), call(deleteEmployee) ]);
}
