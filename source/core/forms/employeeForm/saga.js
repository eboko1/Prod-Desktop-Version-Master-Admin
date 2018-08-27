// vendor
import { call, put, all, take } from 'redux-saga/effects';
import moment from 'moment'
import { replace } from 'react-router-redux';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';
import book from 'routes/book';

// own
import { saveEmployeeSuccess, SAVE_EMPLOYEE, FETCH_EMPLOYEE_BY_ID, fetchEmployeeByIdSuccess} from './duck';

export function* saveEmployee() {
    while (true) {
        try {
            const { payload: employee, id:id } = yield take(SAVE_EMPLOYEE);
            let normilizedPhone= `+38(${employee.phone.value.substr(0, 3)}) ${employee.phone.value.substr(3, 3)}-${employee.phone.value.substr(6, 2)}-${employee.phone.value.substr(8, 2)}`
            let normalizedEmployee={
                email:              employee.email.value,
                phone:              normilizedPhone,
                enabled:            employee.enabled.value,
                hireDate:           moment(employee.hireDate.value).format('YYYY-MM-DD'),
                jobTitle:           employee.jobTitle.value,
                name:               employee.name.value,
                sendSmsCancelOrder: employee.sendSmsCancelOrder.value,
                sendSmsManualOrder: employee.sendSmsManualOrder.value,
                sendSmsNewOrder:    employee.sendSmsNewOrder.value,
                surname:            employee.surname.value,
            }
            const data = yield call(
                fetchAPI,
                id?'PUT':'POST',
                id?`employees/${id}`:'employees',
                null, normalizedEmployee,
            );
            yield put(saveEmployeeSuccess(data));
            console.warn(book)
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
            const data = yield call(
                fetchAPI,
                'GET',
                `employees/${id}`,
            );
            const numberPattern = /\d+/g;

            data.phone=data.phone.match( numberPattern ).slice(1).join('')
            yield put(fetchEmployeeByIdSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}
export function* saga() {
    yield all([ call(saveEmployee), call(fetchEmployee) ]);
}
