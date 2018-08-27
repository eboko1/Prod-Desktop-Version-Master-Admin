// vendor
import { call, put, all, take } from 'redux-saga/effects';
//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchSalarySuccess, FETCH_SALARY, SAVE_SALARY, fetchSalary } from './duck';

export function* fetchSalaries() {
    while (true) {
        try {
            yield take(FETCH_SALARY);
            const data = yield call(
                fetchAPI,
                'GET',
                'employees_salaries',
            );

            yield put(fetchSalarySuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* saveSalary() {
    while (true) {
        try {
            const { payload: {salary, id} } =yield take(SAVE_SALARY);
            let salaryObj={
                
                'considerDiscount': salary.considerDiscount,
                'employeeId':       salary.employeeId,
                'endDate':          salary.endDate,
                'percent':          salary.percent,
                'percent_from':     salary.percent_from,
                'period':           salary.period,
                'ratePerPeriod':    salary.ratePerPeriod,
                'startDate':        salary.startDate,
                  
            }
            const data = yield call(
                fetchAPI,
                id!=='add'?'PUT':'POST',
                id!=='add'?`employees_salaries/${id}`:'employees_salaries',
                null, salaryObj,
            );

            yield put(fetchSalary());
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* saga() {
    yield all([ call(fetchSalaries), call(saveSalary) ]);
}
