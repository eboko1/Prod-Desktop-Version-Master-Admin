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
    fetchCashboxesBalance,
    fetchCashboxesSuccess,
    fetchAnalyticsSuccess,
    setAnalyticsFetchingState,
    fetchCashOrders,
    registerCashOrderInCashdesk,
    fetchCashOrdersSuccess,
    fetchCashboxesBalanceSuccess,
    fetchCashboxesActivitySuccess,
    selectCashOrdersFilters,
    selectCashAccountingFilters,
    registerServiceInputCashOrderInCashdesk,
    registerServiceOutputCashOrderInCashdesk
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
    SERVICE_OUTPUT,
    FETCH_X_REPORT,
    REGISTER_CASH_ORDER_IN_CASHDESK,
    SEND_EMAIL_WITH_RECEIPT,
    SEND_SMS_WITH_RECEIPT,
    DOWNLOAD_RECEIPT,
    REGISTER_SERVICE_INPUT_CASH_ORDER_IN_CASHDESK,
    REGISTER_SERVICE_OUTPUT_CASH_ORDER_IN_CASHDESK,
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
            

            yield put(fetchCashboxesBalance());
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

            

            yield put(fetchCashboxesBalance());
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

            //Get cashbox to register in cashdesk later
            const cashBoxes = yield call(fetchAPI, 'GET', '/cash_boxes');
            const cashBox = _.get(_.filter(cashBoxes, (obj) => obj.id == cashboxId), '[0]');

            const isCashBoxRst =  Boolean(_.get(cashBox, 'rst'));

            const cashOrderPayload = {
                type: "INCOME",
                cashBoxId: cashboxId,
                increase: serviceInputSum,
                otherCounterparty: "Service input"
            };

            //Create CashOrder in our system first
            const {id: cashOrderId} = yield call(
                fetchAPI, 'POST', '/cash_orders', null, cashOrderPayload, { handleErrorInternally: true }
            );

            //If cashbox contains rst it must be registred in cashdesk if possible 
            if(isCashBoxRst) {
                yield put(registerServiceInputCashOrderInCashdesk({cashOrderId}));
            }

            yield put(fetchCashboxesBalance());
        } catch (error) {
            yield put(emitError(error));
            notification.error({ message: _.get(error, 'response.message')}); //Print special error message if it exists
        } finally {
            yield nprogress.done();
        }
    }
}

export function* serviceOutputSaga() {
    while (true) {
        try {
            const {payload: {cashboxId, serviceOutputSum}} = yield take(SERVICE_OUTPUT);

            yield nprogress.start();

            //Get cashbox to register in cashdesk later
            const cashBoxes = yield call(fetchAPI, 'GET', '/cash_boxes');
            const cashBox = _.get(_.filter(cashBoxes, (obj) => obj.id == cashboxId), '[0]');

            const isCashBoxRst =  Boolean(_.get(cashBox, 'rst'));

            const cashOrderPayload = {
                type: "EXPENSE",
                cashBoxId: cashboxId,
                decrease: serviceOutputSum,
                otherCounterparty: "Service output"
            };

            //Create CashOrder in our system first
            const {id: cashOrderId} = yield call(
                fetchAPI, 'POST', '/cash_orders', null, cashOrderPayload, { handleErrorInternally: true }
            );

            //If cashbox contains rst it must be registred in cashdesk if possible 
            if(isCashBoxRst) {
                yield put(registerServiceOutputCashOrderInCashdesk({cashOrderId}));
            }

            yield put(fetchCashboxesBalance());
        } catch (error) {
            yield put(emitError(error));
            notification.error({ message: _.get(error, 'response.message')}); //Print special error message if it exists
        } finally {
            yield nprogress.done();
        }
    }
}

/**
 * For cashboxes with rst we can register them in cashdesk
 */
export function* registerServiceInputSaga() {
    while (true) {
        try {
            const {payload: {cashOrderId}} = yield take(REGISTER_SERVICE_INPUT_CASH_ORDER_IN_CASHDESK);

            yield nprogress.start();

            yield call(
                fetchAPI, 'POST', '/cashdesk/service_input_cash_order', null, {localNumber: cashOrderId}, { handleErrorInternally: true }
            );

            yield put(fetchCashboxesBalance());
            yield put(fetchCashOrders());
        } catch (error) {
            yield put(emitError(error));
            notification.error({ message: _.get(error, 'response.message')}); //Print special error message if it exists
        } finally {
            yield nprogress.done();
        }
    }
}

/**
 * For cashboxes with rst we can register them in cashdesk
 */
export function* registerServiceOutputSaga() {
    while (true) {
        try {
            const {payload: {cashOrderId}} = yield take(REGISTER_SERVICE_OUTPUT_CASH_ORDER_IN_CASHDESK);

            yield nprogress.start();

            yield call(
                fetchAPI, 'POST', '/cashdesk/service_output_cash_order', null, {localNumber: cashOrderId}, { handleErrorInternally: true }
            );

            yield put(fetchCashboxesBalance());
            yield put(fetchCashOrders());
        } catch (error) {
            yield put(emitError(error));
            notification.error({ message: _.get(error, 'response.message')}); //Print special error message if it exists
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

            yield put(fetchCashboxesBalance());
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
        const {payload: {cashOrderId}} = yield take(SEND_EMAIL_WITH_RECEIPT);

        const requestPayload = {
            cashOrderId
        };

        try{
            //Just send an email
            yield call(fetchAPI, 'POST', `/cashdesk/send_email`, null, requestPayload, { handleErrorInternally: true });

            notification.success();
        } catch(err) {
            (err && err.response) && notification.error({
                message: err.response.message
            });
        }

    }
}

export function* sendSmsWithReceiptSaga() {
    while(true) {
        const {payload: {cashOrderId}} = yield take(SEND_SMS_WITH_RECEIPT);

        const requestPayload = {
            cashOrderId
        };

        //Just send an sms to receivers
        yield call(fetchAPI, 'POST', `/cashdesk/send_sms`, null, requestPayload);

        notification.success();

    }
}

export function* downloadReceiptSaga() {
    while (true) {
        try {
            const {payload: {cashOrderId}} = yield take(DOWNLOAD_RECEIPT);

            const response = yield call( fetchAPI, 'GET', `/cashdesk/receipt`, {data: {cashOrderId} }, null, {rawResponse: true} );

            const reportFile = yield response.blob();
    
            const contentDispositionHeader = response.headers.get(
                'content-disposition',
            );
            const fileName = contentDispositionHeader.match(
                /^attachment; filename="(.*)"/,
            )[ 1 ];
            yield saveAs(reportFile, fileName);

            notification.success();

        } catch(err) {
            emitError(err);
        }
    }
}

export function* saga() {
    yield all([
        call(openShiftSaga),
        call(closeShiftSaga),
        call(serviceInputSaga),
        call(serviceOutputSaga),
        call(registerServiceInputSaga),
        call(registerServiceOutputSaga),
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
        call(downloadReceiptSaga),
        takeLatest(SET_SEARCH_QUERY, handleCashOrdersSearchSaga),
    ]);
}
