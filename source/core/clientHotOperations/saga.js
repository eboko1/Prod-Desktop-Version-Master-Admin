// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { fetchAPI } from 'utils';
import {setReportOrdersFetching, emitError} from 'core/ui/duck';

// own
import {
    fetchClientsSuccess,
    selectFilters,
    selectSort,
    setClientsFetching,
    setClientOrdersFetching,
    fetchClientOrdersSuccess
} from './duck';

import {
    FETCH_CLIENTS,
    FETCH_CLIENT_ORDERS
} from './duck';

export function* fetchClientsSaga() {
    while (true) {
        try {
            yield take(FETCH_CLIENTS);
            yield put(setClientsFetching(true));

            const filters = yield select(selectFilters);
            const sort = yield select(selectSort);

            const {clients, stats} = yield call(
                fetchAPI,
                'GET',
                `/clients`,
                {filters, sort},
            );

            yield put(fetchClientsSuccess({clients, stats}));
        } finally {
            yield put(setClientsFetching(false));
        }
    }
}

export function* fetchClientOrdersSaga() {
    while (true) {
        try {
            const {payload: {clientId}} = yield take(FETCH_CLIENT_ORDERS);
            yield put(setClientOrdersFetching(true));

            console.log("ClientId: ", clientId);

            const {orders, stats} = yield call(
                fetchAPI,
                'GET',
                `/orders/client/${clientId}`
            );
            
            console.log("Req res: ", orders, stats);

            yield put(fetchClientOrdersSuccess({orders, stats}));
        } finally {
            yield put(setClientOrdersFetching(false));
        }
    }
}


export function* saga() {
    yield all([ call(fetchClientsSaga), call(fetchClientOrdersSaga) ]);
}
