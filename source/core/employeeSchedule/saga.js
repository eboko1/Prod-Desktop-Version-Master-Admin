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
} from './duck';

import {
    CREATE_EMPLOYEE_SCHEDULE,
    UPDATE_EMPLOYEE_SCHEDULE,
    DELETE_EMPLOYEE_SCHEDULE,
    CREATE_BREAK_EMPLOYEE_SCHEDULE,
    UPDATE_BREAK_EMPLOYEE_SCHEDULE,
    DELETE_BREAK_EMPLOYEE_SCHEDULE,
} from './duck';

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
}

export function* deleteEmployeeScheduleSaga({ payload: { scheduleId } }) {
    yield call(fetchAPI, 'DELETE', `schedule/${scheduleId}`);
    yield put(deleteEmployeeScheduleSuccess());
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
}

export function* createEmployeeBreakScheduleSaga({
    payload: { breakSchedule, employeeId },
}) {
    const payload = { ...breakSchedule, subjectId: employeeId };
    yield call(fetchAPI, 'POST', 'non_working_days', null, payload);
    yield put(createEmployeeBreakScheduleSuccess());
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
}

export function* deleteEmployeeBreakScheduleSaga({
    payload: { breakScheduleId },
}) {
    yield call(fetchAPI, 'DELETE', `non_working_days/${breakScheduleId}`);
    yield put(deleteEmployeeBreakScheduleSuccess());
}

export function* saga() {
    yield all([
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
