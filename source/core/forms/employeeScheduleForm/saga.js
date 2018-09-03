// vendor
import { call, put, all, take, takeEvery } from 'redux-saga/effects';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    saveEmployeeScheduleSuccess,
    SAVE_EMPLOYEE_SCHEDULE,
    FETCH_EMPLOYEE_SCHEDULE,
    DELETE_EMPLOYEE_SCHEDULE,
    deleteEmployeeScheduleSuccess,
    fetchEmployeeScheduleSuccess,
} from './duck';
import { fetchEmployeeById } from 'core/forms/employeeForm/duck';

export function* saveSchedule({ payload: { schedule, id } }) {
    try {
        const object = { ...schedule, subjectId: id };
        const data = yield call(fetchAPI, 'POST', 'schedule', null, object);

        yield put(saveEmployeeScheduleSuccess(data));
        yield put(fetchEmployeeById(id));
    } catch (error) {
        yield put(emitError(error));
    }
}

export function* deleteSchedule({ payload: { id, employeeId } }) {
    try {
        const data = yield call(fetchAPI, 'DELETE', `schedule/${id}`);

        yield put(deleteEmployeeScheduleSuccess(data));
        yield put(fetchEmployeeById(employeeId));
    } catch (error) {
        yield put(emitError(error));
    }
}
export function* saga() {
    // yield all([ call(saveSchedule) ]);
    yield all([
        takeEvery(SAVE_EMPLOYEE_SCHEDULE, saveSchedule), takeEvery(DELETE_EMPLOYEE_SCHEDULE, deleteSchedule),
    ]);
}
