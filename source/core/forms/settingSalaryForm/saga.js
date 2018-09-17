// vendor
import { call, put, all, take, takeEvery } from 'redux-saga/effects';
import { saveAs } from 'file-saver';
import moment from 'moment';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    FETCH_SALARY,
    FETCH_SALARY_REPORT,
    FETCH_ANNUAL_SALARY_REPORT,
    DELETE_SALARY,
    CREATE_SALARY,
    UPDATE_SALARY,
} from './duck';

import {
    fetchSalarySuccess,
    fetchSalary,
    updateSalarySuccess,
    createSalarySuccess,
    deleteSalarySuccess,
    fetchSalaryReportSuccess,
    fetchAnnualSalaryReportSuccess,
} from './duck';

export function* fetchSalariesSaga() {
    while (true) {
        const { payload: employeeId } = yield take(FETCH_SALARY);
        const data = yield call(
            fetchAPI,
            'GET',
            `employees_salaries?employeeId=${employeeId}`,
        );

        yield put(fetchSalarySuccess(data));
    }
}

export function* createSalarySaga() {
    while (true) {
        const {
            payload: { salary, employeeId },
        } = yield take(CREATE_SALARY);
        const payload = { ...salary, employeeId };

        yield call(fetchAPI, 'POST', 'employees_salaries', null, payload);

        yield put(createSalarySuccess());
        yield put(fetchSalary(employeeId));
    }
}

export function* updateSalarySaga() {
    while (true) {
        const {
            payload: { salary, employeeId, salaryId },
        } = yield take(UPDATE_SALARY);
        const payload = { ...salary, employeeId };

        yield call(
            fetchAPI,
            'PUT',
            `employees_salaries/${salaryId}`,
            null,
            payload,
        );

        yield put(updateSalarySuccess());
        yield put(fetchSalary(employeeId));
    }
}

export function* deleteSalarySaga() {
    while (true) {
        const {
            payload: { salaryId, employeeId },
        } = yield take(DELETE_SALARY);

        yield call(fetchAPI, 'DELETE', `employees_salaries/${salaryId}`);

        yield put(deleteSalarySuccess());
        yield put(fetchSalary(employeeId));
    }
}

export function* fetchAnnualSalaryReport({ payload }) {
    try {
        const data = yield call(
            fetchAPI,
            'GET',
            '/employees_salaries/annual_report',
            payload,
            null,
            { rawResponse: true },
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
        yield put(fetchAnnualSalaryReportSuccess());
    }
}

export function* fetchSalaryReport({ payload }) {
    try {
        const data = yield call(
            fetchAPI,
            'GET',
            '/employees_salaries/report',
            payload,
            null,
            { rawResponse: true },
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
        takeEvery(FETCH_ANNUAL_SALARY_REPORT, fetchAnnualSalaryReport),
        call(fetchSalariesSaga),
        call(createSalarySaga),
        call(updateSalarySaga),
        call(deleteSalarySaga),
    ]);
    /* eslint-enable array-element-newline */
}
