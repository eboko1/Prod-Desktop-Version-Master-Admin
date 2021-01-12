// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import { saveAs } from 'file-saver';

//proj
import { fetchAPI } from 'utils';
import {setReportOrdersFetching, emitError} from 'core/ui/duck';

// own
import {
    fetchReportOrdersSuccess,
    fetchReportOrdersFilterOptionsSuccess,
    fetchExcelFileReportSuccess
} from './duck';

import {
    FETCH_REPORT_ORDERS,
    FETCH_REPORT_ORDERS_FILTER_OPTIONS,
    FETCH_EXCEL_FILE_REPORT
} from './duck';

const selectFilter = ({ reportOrders: { filter, options, exportOptions } }) => ({
    filter,
    options,
    exportOptions
});

export function* fetchReportOrdersSaga() {
    while (true) {
        try {
            yield take(FETCH_REPORT_ORDERS);
            yield put(setReportOrdersFetching(true));

            const {
                filter,
                options
            } = yield select(selectFilter);

            const data = yield call(
                fetchAPI,
                'GET',
                `/report/orders`,
                {filters: {...filter}, options},
            );
            yield put(fetchReportOrdersSuccess(data));
        } finally {
            yield put(setReportOrdersFetching(false));
        }
    }
}

export function* fetchReportOrdersFilterOptionsSaga() {
    while (true) {
        try {
            yield take(FETCH_REPORT_ORDERS_FILTER_OPTIONS);

            const data = yield call(
                fetchAPI,
                'GET',
                `/orders/form`
            );
            yield put(fetchReportOrdersFilterOptionsSuccess(data));
        } finally {
        }
    }
}

export function* fetchExcelFileReportSaga() {
    while(true){
        try {
            yield take(FETCH_EXCEL_FILE_REPORT);

            yield nprogress.start();

            const { filter, options, exportOptions } = yield select(selectFilter);
            const filters = { ...filter};
            const finalOptions = {...options, ...exportOptions}

            const response = yield call(fetchAPI, 'GET', '/report/orders/file', {filters, options: {...finalOptions}}, null, {
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
    yield all([ call(fetchReportOrdersSaga), call(fetchReportOrdersFilterOptionsSaga), call(fetchExcelFileReportSaga) ]);
}
