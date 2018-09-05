// vendor
import { call, put, all, take, takeEvery } from 'redux-saga/effects';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    saveEmployeeBreakScheduleSuccess,
    SAVE_EMPLOYEE_BREAK_SCHEDULE,
    FETCH_EMPLOYEE_BREAK_SCHEDULE,
    DELETE_EMPLOYEE_BREAK_SCHEDULE,
    deleteEmployeeBreakScheduleSuccess,
    fetchEmployeeBreakScheduleSuccess,
} from './duck';
import { fetchEmployeeById } from 'core/forms/employeeForm/duck';

export function* saveSchedule({ payload: { schedule, id, update } }) {
    try {
        const object = { ...schedule, subjectId: id };
        const data = yield call(fetchAPI, update?'PUT':'POST', update?`non_working_days/${id}`:'non_working_days', null, object);

        yield put(saveEmployeeBreakScheduleSuccess(data));
        yield put(fetchEmployeeById(id));
    } catch (error) {
        yield put(emitError(error));
    }
}

export function* deleteSchedule({ payload: { id, employeeId } }) {
    try {
        const data = yield call(fetchAPI, 'DELETE', `non_working_days/${id}`);

        yield put(deleteEmployeeBreakScheduleSuccess(data));
        yield put(fetchEmployeeById(employeeId));
    } catch (error) {
        yield put(emitError(error));
    }
}
export function* saga() {
    // yield all([ call(saveSchedule) ]);
    yield all([ takeEvery(SAVE_EMPLOYEE_BREAK_SCHEDULE, saveSchedule), takeEvery(DELETE_EMPLOYEE_BREAK_SCHEDULE, deleteSchedule)  ]);
}
