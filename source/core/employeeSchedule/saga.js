// vendor
import { call, all, takeEvery, put } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own

import {
    createEmployeeScheduleSuccess,
    updateEmployeeScheduleSuccess,
    deleteEmployeeScheduleSuccess,

    createEmployeeBreakScheduleSuccess,
    updateEmployeeBreakScheduleSuccess,
    deleteEmployeeBreakScheduleSuccess,

    fetchEmployeeSchedule,
    fetchEmployeeScheduleSuccess,
} from './duck';

import {
    CREATE_EMPLOYEE_SCHEDULE,
    UPDATE_EMPLOYEE_SCHEDULE,
    DELETE_EMPLOYEE_SCHEDULE,

    CREATE_BREAK_EMPLOYEE_SCHEDULE,
    UPDATE_BREAK_EMPLOYEE_SCHEDULE,
    DELETE_BREAK_EMPLOYEE_SCHEDULE,

    FETCH_EMPLOYEE_SCHEDULE,
} from './duck';

export function* fetchEmployeeScheduleSaga({payload: id}) {
    const data = yield call(fetchAPI, 'GET', `employees/${id}`);
    yield put(fetchEmployeeScheduleSuccess(data));
}

export function* updateEmployeeScheduleSaga({
    payload: { scheduleId, schedule, employeeId },
}) {
    const payload = {
        ...schedule,
        subjectId:   employeeId,
        type:        'standard',
        subjectType: 'employee',
    };
    yield call(fetchAPI, 'PUT', `schedule/${scheduleId}`, null, payload);
    yield put(updateEmployeeScheduleSuccess());
    yield put(fetchEmployeeSchedule(employeeId));
}

export function* deleteEmployeeScheduleSaga({ payload: { scheduleId, employeeId } }) {
    yield call(fetchAPI, 'DELETE', `schedule/${scheduleId}`);
    yield put(deleteEmployeeScheduleSuccess());
    yield put(fetchEmployeeSchedule(employeeId));
}

export function* createEmployeeScheduleSaga({
    payload: { schedule, employeeId },
}) {
    const payload = {
        ...schedule,
        subjectId:   employeeId,
        type:        'standard',
        subjectType: 'employee',
    };
    yield call(fetchAPI, 'POST', 'schedule', null, payload);
    yield put(createEmployeeScheduleSuccess());
    yield put(fetchEmployeeSchedule(employeeId));
}

export function* createEmployeeBreakScheduleSaga({
    payload: { breakSchedule, employeeId },
}) {
    const payload = { ...breakSchedule, subjectId: employeeId };
    yield call(fetchAPI, 'POST', 'non_working_days', null, payload);
    yield put(createEmployeeBreakScheduleSuccess());
    yield put(fetchEmployeeSchedule(employeeId));
}

export function* updateEmployeeBreakScheduleSaga({
    payload: { breakScheduleId, breakSchedule, employeeId },
}) {
    const payload = { ...breakSchedule, subjectId: employeeId };
    yield call(
        fetchAPI,
        'PUT',
        `non_working_days/${breakScheduleId}`,
        null,
        payload,
    );
    yield put(updateEmployeeBreakScheduleSuccess());
    yield put(fetchEmployeeSchedule(employeeId));
}

export function* deleteEmployeeBreakScheduleSaga({
    payload: { breakScheduleId, employeeId },
}) {
    yield call(fetchAPI, 'DELETE', `non_working_days/${breakScheduleId}`);
    yield put(deleteEmployeeBreakScheduleSuccess());
    yield put(fetchEmployeeSchedule(employeeId));
}

export function* saga() {
    yield all([
        takeEvery(FETCH_EMPLOYEE_SCHEDULE, fetchEmployeeScheduleSaga),
        takeEvery(CREATE_EMPLOYEE_SCHEDULE, createEmployeeScheduleSaga),
        takeEvery(UPDATE_EMPLOYEE_SCHEDULE, updateEmployeeScheduleSaga),
        takeEvery(DELETE_EMPLOYEE_SCHEDULE, deleteEmployeeScheduleSaga),
        takeEvery(
            CREATE_BREAK_EMPLOYEE_SCHEDULE,
            createEmployeeBreakScheduleSaga,
        ),
        takeEvery(
            UPDATE_BREAK_EMPLOYEE_SCHEDULE,
            updateEmployeeBreakScheduleSaga,
        ),
        takeEvery(
            DELETE_BREAK_EMPLOYEE_SCHEDULE,
            deleteEmployeeBreakScheduleSaga,
        ),
    ]);
}
