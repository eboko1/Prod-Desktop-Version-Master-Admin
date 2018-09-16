// vendor
import { call, all, takeEvery } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import {} from './duck';

import {
    CREATE_EMPLOYEE_SCHEDULE,
    UPDATE_EMPLOYEE_SCHEDULE,
    DELETE_EMPLOYEE_SCHEDULE,
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
}

export function* deleteEmployeeScheduleSaga({ payload: { scheduleId } }) {
    yield call(fetchAPI, 'DELETE', `schedule/${scheduleId}`);
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
}

export function* saga() {
    yield all([ takeEvery(CREATE_EMPLOYEE_SCHEDULE, createEmployeeScheduleSaga), takeEvery(UPDATE_EMPLOYEE_SCHEDULE, updateEmployeeScheduleSaga), takeEvery(DELETE_EMPLOYEE_SCHEDULE, deleteEmployeeScheduleSaga) ]);
}
