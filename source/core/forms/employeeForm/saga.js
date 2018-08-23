// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { saveEmployeeSuccess, SAVE_EMPLOYEE, FETCH_EMPLOYEE_BY_ID, fetchEmployeeByIdSuccess} from './duck';

export function* saveEmployee() {
    while (true) {
        try {
            const { payload: employee, id:id } = yield take(SAVE_EMPLOYEE);
            console.warn('HEllo from saga')
            let normalizedEmployee={}
            console.log(employee)
            // const data = yield call(
            //     fetchAPI,
            //     id?'PUT':'POST',
            //     id?`employees/${id}`:'employees',
            // );
            // yield put(saveEmployeeSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}
export function* fetchEmployee() {
    while (true) {
        try {
            const { payload: id } = yield take(FETCH_EMPLOYEE_BY_ID);
            const data = yield call(
                fetchAPI,
                'GET',
                `employees/${id}`,
            );
            yield put(fetchEmployeeByIdSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}
export function* saga() {
    yield all([ call(saveEmployee), call(fetchEmployee) ]);
}
