// vendor
import { call, put, all, take, takeEvery } from 'redux-saga/effects';
import { saveAs } from 'file-saver';
import moment from 'moment';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchSalarySuccess,
    FETCH_SALARY,
    SAVE_SALARY,
    fetchSalary,
    DELETE_SALARY,
    deleteSalarySuccess,
    FETCH_SALARY_REPORT,
    fetchSalaryReportSuccess,
} from './duck';

export function* fetchSalariesSaga() {
    while (true) {
        try {
            yield take(FETCH_SALARY);
            const data = yield call(fetchAPI, 'GET', 'employees_salaries');

            yield put(fetchSalarySuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* saveSalarySaga() {
    while (true) {
        try {
            const {
                payload: { salary, meth },
            } = yield take(SAVE_SALARY);

            let salaryObj = {
                considerDiscount:
                    salary.considerDiscount === 'Yes' ? true : false,
                employeeId:    salary.employeeId,
                endDate:       salary.endDate,
                percent:       salary.percent,
                percentFrom:   salary.percentFrom,
                period:        salary.period,
                ratePerPeriod: salary.ratePerPeriod,
                startDate:     salary.startDate,
            };
            const data = yield call(
                fetchAPI,
                meth !== 'add' ? 'PUT' : 'POST',
                meth !== 'add'
                    ? `employees_salaries/${meth}`
                    : 'employees_salaries',
                null,
                salaryObj,
            );

            yield put(fetchSalary());
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* deleteSalarySaga() {
    while (true) {
        try {
            const {
                payload: { id },
            } = yield take(DELETE_SALARY);

            const data = yield call(
                fetchAPI,
                'DELETE',
                `employees_salaries/${id}`,
            );

            yield put(deleteSalarySuccess());
            yield put(fetchSalary());
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* fetchSalaryReport({ payload: info }) {
    try {
        const data = yield call(
            fetchAPI,
            'GET',
            '/employees_salaries/report',
            {
                startDate: info[ 0 ].toISOString(),
                endDate:   info[ 1 ].toISOString(),
            },
            null,
            { rawResponse: true },
            // `/employees_salaries/report?startDate=${ info[ 0 ].toISOString()}&endDate=${info[ 1 ].toISOString()}`,
        );
        const reportFile = yield data.blob();
        const contentDispositionHeader = data.headers.get(
            'content-disposition',
        );
        const fileName = contentDispositionHeader.match(
            /^attachment; filename="(.*)"/,
        )[ 1 ];
        yield saveAs(reportFile, fileName);
    } catch (error) {
        yield put(emitError(error));
    } finally {
        yield put(fetchSalaryReportSuccess());
    }
}

export function* saga() {
    /* eslint-disable array-element-newline */
    yield all([
        takeEvery(FETCH_SALARY_REPORT, fetchSalaryReport),
        call(fetchSalariesSaga),
        call(saveSalarySaga),
        call(deleteSalarySaga),
    ]);
    /* eslint-enable array-element-newline */
}
