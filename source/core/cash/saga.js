// vendor
import {
    call,
    put,
    all,
    take,
    select,
    delay,
    takeLatest,
} from 'redux-saga/effects';
import nprogress from 'nprogress';
import { saveAs } from 'file-saver';
import moment from 'moment';
import _ from 'lodash';
import { notification } from 'antd';

//proj
import { setCashOrdersFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';
import {analyticsLevels} from 'core/forms/reportAnalyticsForm/duck'


// own
import {
    fetchCashboxes,
    fetchCashboxesSuccess,
    fetchAnalyticsSuccess,
    setAnalyticsFetchingState,
    createCashboxSuccess,
    deleteCashboxSuccess,
    fetchCashOrders,
    fetchCashOrdersSuccess,
    fetchCashboxesBalanceSuccess,
    fetchCashboxesActivitySuccess,
    selectCashOrdersFilters,
    selectCashAccountingFilters,
    printCashOrderSuccess,

    
} from './duck';

import {
    FETCH_CASHBOXES,
    FETCH_CASHBOXES_BALANCE,
    FETCH_CASHBOXES_ACTIVITY,
    FETCH_ANALYTICS,
    CREATE_CASHBOX,
    DELETE_CASHBOX,
    FETCH_CASH_ORDERS,
    PRINT_CASH_ORDERS,
    SET_SEARCH_QUERY,
    OPEN_SHIFT,
    CLOSE_SHIFT,
    SERVICE_INPUT,
    FETCH_X_REPORT,
    REGISTER_CASH_ORDER_IN_CASHDESK,
    SEND_EMAIL_WITH_RECEIPT,
    SEND_SMS_WITH_RECEIPT
} from './duck';

export function* openShiftSaga() {
    while (true) {
        try {
            const {payload} = yield take(OPEN_SHIFT);

            yield nprogress.start();

            const requestPayload = {
                cashboxId: payload
            }

            try {
                yield call(fetchAPI, 'POST', '/cashdesk/open_shift', null, requestPayload, { handleErrorInternally: true});
            } catch(err) {
                notification.error({message: err.response.message});
            }
            

            yield put(fetchCashboxes());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* closeShiftSaga() {
    while (true) {
        try {
            const {payload} = yield take(CLOSE_SHIFT);

            yield nprogress.start();

            const requestPayload = {
                cashboxId: payload
            }

            try {
                const {pdf} = yield call(fetchAPI, 'POST', '/cashdesk/close_shift', null, requestPayload, { handleErrorInternally: true});

                //Unknown error, the only way to convert is to use uint8Array:
                //https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
                const bin = new Blob([Uint8Array.from(atob(pdf), c => c.charCodeAt(0))], {type: 'application/pdf'});

                yield saveAs(bin, 'z-report.pdf');
            } catch(err) {
                notification.error({message: err.response.message});
            }

            

            yield put(fetchCashboxes());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* serviceInputSaga() {
    while (true) {
        try {
            const {payload: {cashboxId, serviceInputSum}} = yield take(SERVICE_INPUT);

            yield nprogress.start();

            const requestPayload = {
                cashboxId: cashboxId,
                sum: serviceInputSum
            }

            try {
                yield call(fetchAPI, 'POST', '/cashdesk/service_input', null, requestPayload, { handleErrorInternally: true});
            } catch(err) {
                notification.error({message: err.response.message});
            }

            yield put(fetchCashboxes());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* xReportSaga() {
    while (true) {
        try {
            const { payload } = yield take(FETCH_X_REPORT);

            yield nprogress.start();

            const requestPayload = {
                cashboxId: payload,
            }

            try {
                const { pdf } = yield call(fetchAPI, 'POST', '/cashdesk/x_report', null, requestPayload, { handleErrorInternally: true});

                //Unknown error, the only way to convert is to use uint8Array:
                //https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
                const bin = new Blob([Uint8Array.from(atob(pdf), c => c.charCodeAt(0))], {type: 'application/pdf'});

                yield saveAs(bin, 'x-report.pdf');
            } catch(err) {
                notification.error({message: err.response.message});
            }

            

            yield put(fetchCashboxes());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}


export function* fetchCashboxesSaga() {
    while (true) {
        try {
            yield take(FETCH_CASHBOXES);
            yield nprogress.start();

            const data = yield call(fetchAPI, 'GET', 'cash_boxes');

            yield put(fetchCashboxesSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* fetchCashboxesBalanceSaga() {
    while (true) {
        try {
            yield take(FETCH_CASHBOXES_BALANCE);
            yield nprogress.start();
            const { date } = yield select(selectCashAccountingFilters);

            const data = yield call(fetchAPI, 'GET', 'cash_boxes/balance', {
                endDate: moment(date).format('YYYY-MM-DD'),
            });

            yield put(fetchCashboxesBalanceSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* fetchCashboxesActivitySaga() {
    while (true) {
        try {
            yield take(FETCH_CASHBOXES_ACTIVITY);
            yield nprogress.start();
            const filters = yield select(selectCashAccountingFilters);

            const data = yield call(
                fetchAPI,
                'GET',
                'cash_boxes/activity',
                _.pick(filters, [ 'startDate', 'endDate' ]),
            );
            yield put(fetchCashboxesActivitySuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* fetchCashOrdersSaga() {
    while (true) {
        try {
            yield take(FETCH_CASH_ORDERS);
            yield put(setCashOrdersFetchingState(true));
            const filters = yield select(selectCashOrdersFilters);

            const data = yield call(fetchAPI, 'GET', 'cash_orders', filters);

            yield put(fetchCashOrdersSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setCashOrdersFetchingState(false));
        }
    }
}

export function* fetchAnalyticsSaga() {
    while (true) {
        try {
            yield take(FETCH_ANALYTICS);
            yield put(setAnalyticsFetchingState(true));
            
            const filters = {
                level: analyticsLevels.analytics
            }

            const {analytics} = yield call(fetchAPI, 'GET', '/report/analytics', {filters});

            yield put(fetchAnalyticsSuccess(analytics));
            yield put(setAnalyticsFetchingState(false));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

function* handleCashOrdersSearchSaga() {
    try {
        yield delay(1000);
        yield put(fetchCashOrders());
    } catch (error) {
        yield put(emitError(error));
    }
}

export function* createCashboxSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_CASHBOX);
            yield nprogress.start();

            yield call(fetchAPI, 'POST', 'cash_boxes', null, payload);

            yield put(fetchCashboxes());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* deleteCashboxSaga() {
    while (true) {
        try {
            const { payload: id } = yield take(DELETE_CASHBOX);
            yield nprogress.start();

            yield call(fetchAPI, 'DELETE', `cash_boxes/${id}`);

            yield put(fetchCashboxes());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* printCashOrdersSaga() {
    while (true) {
        try {
            yield take(PRINT_CASH_ORDERS);
            yield nprogress.start();
            const filters = yield select(selectCashOrdersFilters);
            delete filters.page;
            const response = yield call(
                fetchAPI,
                'GET',
                'cash_orders/pdf',
                filters,
                null,
                { rawResponse: true },
            );

            const reportFile = yield response.blob();

            const contentDispositionHeader = response.headers.get(
                'content-disposition',
            );
            const fileName = contentDispositionHeader.match(
                /^attachment; filename="(.*)"/,
            )[ 1 ];
            yield saveAs(reportFile, fileName);
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

/**
 * This saga cash order in cash desk by provided cashOrderId
 */
export function* registerCashOrderInCashdeskSaga() {
    while(true) {
        const {payload: cashOrderId} = yield take(REGISTER_CASH_ORDER_IN_CASHDESK);

        const requestPayload = {
            localNumber: cashOrderId
        };

        try{
            
            const { pdf } =yield call(fetchAPI, 'POST', `/cashdesk/sale_or_return`, null, requestPayload, { handleErrorInternally: true });

            //Unknown error, the only way to convert is to use uint8Array:
            //https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
            const bin = new Blob([Uint8Array.from(atob(pdf), c => c.charCodeAt(0))], {type: 'application/pdf'});

            yield saveAs(bin, 'sale.pdf');

        } catch(err) {
            notification.error({
                message: err.response.message
            });
        }

        yield put(fetchCashOrders());
    }
}

export function* sendEmailWithReceiptSaga() {
    while(true) {
        const {payload: {receivers, cashOrderId}} = yield take(SEND_EMAIL_WITH_RECEIPT);

        const requestPayload = {
            receivers,
            cashOrderId
        };

        try{
            //Just send an email
            yield call(fetchAPI, 'POST', `/cashdesk/send_email`, null, requestPayload);
        } catch(err) {}
    }
}

export function* sendSmsWithReceiptSaga() {
    while(true) {
        const {payload: {receivers, cashOrderId}} = yield take(SEND_SMS_WITH_RECEIPT);

        const requestPayload = {
            receivers,
            cashOrderId
        };

        try{
            //Just send an sms to receivers
            yield call(fetchAPI, 'POST', `/cashdesk/send_sms`, null, requestPayload);
        } catch(err) {}
    }
}

export function* saga() {
    yield all([
        call(openShiftSaga),
        call(closeShiftSaga),
        call(serviceInputSaga),
        call(xReportSaga),
        call(fetchCashboxesSaga),
        call(fetchCashboxesBalanceSaga),
        call(fetchCashboxesActivitySaga),
        call(createCashboxSaga),
        call(deleteCashboxSaga),
        call(printCashOrdersSaga),
        call(fetchCashOrdersSaga),
        call(fetchAnalyticsSaga),
        call(registerCashOrderInCashdeskSaga),
        call(sendEmailWithReceiptSaga),
        call(sendSmsWithReceiptSaga),
        takeLatest(SET_SEARCH_QUERY, handleCashOrdersSearchSaga),
    ]);
}
