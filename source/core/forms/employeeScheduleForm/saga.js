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

// export function* fetchSchedule(payload) {
//     try {
//         console.log('HEllo', payload.payload);
//         const data = yield call(fetchAPI, 'GET', `schedule/${payload.payload}`);

//         yield put(fetchEmployeeScheduleSuccess(data));
//     } catch (error) {
//         yield put(emitError(error));
//     }
// }
export function* saga() {
    // yield all([ call(saveSchedule) ]);
    yield all([
        takeEvery(SAVE_EMPLOYEE_SCHEDULE, saveSchedule),
        //  takeEvery(FETCH_EMPLOYEE_SCHEDULE, fetchSchedule),
    ]);
}
