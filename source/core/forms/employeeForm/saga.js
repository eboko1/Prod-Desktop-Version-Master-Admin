// vendor
import { call, put, all, take } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import moment from 'moment';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';
import book from 'routes/book';

// own
import {
    saveEmployeeSuccess,
    SAVE_EMPLOYEE,
    FETCH_EMPLOYEE_BY_ID,
    fetchEmployeeByIdSuccess,
    FIRE_EMPLOYEE,
    fireEmployeeSuccess,
} from './duck';

export function* saveEmployee() {
    while (true) {
        try {
            const { payload: employee, id: id } = yield take(SAVE_EMPLOYEE);

            const normalizedEmployee = {
                ...employee.managerEnabled
                    ? { password: employee.password }
                    : {},
                email:              employee.email ? employee.email : null,
                managerEnabled:     employee.managerEnabled,
                phone:              String(employee.phone),
                enabled:            employee.enabled,
                hireDate:           moment(employee.hireDate).format('YYYY-MM-DD'),
                jobTitle:           employee.jobTitle,
                name:               employee.name,
                sendSmsCancelOrder: false,
                sendSmsManualOrder: false,
                sendSmsNewOrder:    false,
                surname:            employee.surname,
            };

            const data = yield call(
                fetchAPI,
                id ? 'PUT' : 'POST',
                id ? `employees/${id}` : 'employees',
                null,
                normalizedEmployee,
            );
            yield put(saveEmployeeSuccess(data));
            yield put(replace(book.employeesPage));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}
export function* fireEmployee() {
    while (true) {
        try {
            const {
                payload: employee,
                id: id,
                fireDate: fireDate,
            } = yield take(FIRE_EMPLOYEE);

            let normalizedEmployee = {
                email:              employee.email,
                phone:              String(employee.phone),
                enabled:            employee.enabled,
                hireDate:           moment(employee.hireDate).format('YYYY-MM-DD'),
                jobTitle:           employee.jobTitle,
                name:               employee.name,
                sendSmsCancelOrder: false,
                sendSmsManualOrder: false,
                sendSmsNewOrder:    false,
                surname:            employee.surname,
                fireDate:           moment(fireDate).format('YYYY-MM-DD'),
            };
            const data = yield call(
                fetchAPI,
                'PUT',
                id ? `employees/${id}` : 'employees',
                null,
                normalizedEmployee,
            );
            yield put(fireEmployeeSuccess(data));
            yield put(replace(book.employeesPage));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}
export function* fetchEmployee() {
    while (true) {
        try {
            const { payload: id } = yield take(FETCH_EMPLOYEE_BY_ID);
            const data = yield call(fetchAPI, 'GET', `employees/${id}`);

            yield put(fetchEmployeeByIdSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}
export function* saga() {
    yield all([ call(saveEmployee), call(fireEmployee), call(fetchEmployee) ]);
}
