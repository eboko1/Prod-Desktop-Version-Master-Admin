// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import { saveAs } from 'file-saver';

//proj
import { emitError } from 'core/ui/duck';
import { setReportFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchReportSuccess,
    fetchExcelFileReportSuccess,
    selectFilter
} from './duck';

import {
    FETCH_REPORT,
    FETCH_EXCEL_FILE_REPORT
} from './duck';

export function* fetchReportSaga() {
    while (true) {
        try {
            yield take(FETCH_REPORT);
            yield put(setReportFetchingState(true));
            
            const { filter, sort } = yield select(selectFilter);
            const filters = { ...filter};
            const data = yield call(
                fetchAPI,
                'GET',
                '/report/client_debts',
                {filters}
            );
            yield put(fetchReportSuccess(data));
        } finally {
            yield put(setReportFetchingState(false));
        }
    }
}

export function* fetchExcelFileReportSaga() {
    while(true){
        try {
            yield take(FETCH_EXCEL_FILE_REPORT);
            yield nprogress.start();

            const { filter, sort } = yield select(selectFilter);
            const filters = { ...filter};

            const response = yield call(fetchAPI, 'GET', '/report/client_debts_excel_file', {filters}, null, {
                rawResponse: true,
            });

            const reportFile = yield response.blob();

            const contentDispositionHeader = response.headers.get('content-disposition');
            const fileName = contentDispositionHeader.match(/^attachment; filename="(.*)"/)[ 1 ];

            yield saveAs(reportFile, fileName);
            yield put(fetchExcelFileReportSuccess());        
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([ call(fetchReportSaga), call(fetchExcelFileReportSaga)]);
}
