// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import { saveAs } from 'file-saver';

//proj
import { fetchAPI } from 'utils';
import { emitError } from 'core/ui/duck';

// own
import {
    fetchCashOrdersLogsSuccess,
} from './duck';

import {
    FETCH_CASH_ORDER_LOGS,
    FETCH_CASH_ORDERS_LOGS_RECEIPT
} from './duck';

export function* fetchCashOrdersLogsSaga() {
    while (true) {
        try {
            yield take(FETCH_CASH_ORDER_LOGS);

            const data = yield call(
                fetchAPI,
                'GET',
                `/cashdesk/logs`,
                {filters: {page: 1}}
            );
            yield put(fetchCashOrdersLogsSuccess(data));
        } catch(err) {
            emitError(err);
        }
    }
}

export function* fetchCashOrdersLogsReceiptSaga() {
    while (true) {
        try {
            const {payload: {receiptId}} = yield take(FETCH_CASH_ORDERS_LOGS_RECEIPT);

            const response = yield call(
                fetchAPI,
                'GET',
                `/cashdesk/tax`,
                {
                    data: {
                        taxId: receiptId,
                    }
                },
                null,
                {rawResponse: true}
            );

            // const response = yield call(fetchAPI, 'GET', report.link, null, null, {
            //     rawResponse: true,
            // });
            const reportFile = yield response.blob();
    
            const contentDispositionHeader = response.headers.get(
                'content-disposition',
            );
            const fileName = contentDispositionHeader.match(
                /^attachment; filename="(.*)"/,
            )[ 1 ];
            yield saveAs(reportFile, fileName);

            // yield saveAs(new Blob(file), 'Receipt.txt');
        } catch(err) {
            emitError(err);
        }
    }
}

export function* saga() {
    yield all([ call(fetchCashOrdersLogsSaga), call(fetchCashOrdersLogsReceiptSaga) ]);
}
