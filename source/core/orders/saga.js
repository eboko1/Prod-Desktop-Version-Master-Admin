// vendor
import { call, put, takeEvery, all, apply } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import {
    fetchOrdersSuccess,
    fetchOrdersFail,
    fetchOrdersStatsSuccess,
    fetchOrdersStatsFail,
    ordersSearch,
    FETCH_ORDERS,
    FETCH_ORDERS_STATS,
    FETCH_ORDERS_FILTERS,
} from './duck';

import * as ducks from './duck';
// console.log('DUCKS', ducks);
export function* fetchOrdersSaga({ payload: { ...filter } }) {
// export function* fetchOrdersSaga(filter) {
    yield nprogress.start();
    yield put(uiActions.setOrdersFetchingState(true));
    // console.log('SAGA_payload', {...filter});
    // console.log('SAGA_payload', filter);
    const data = yield call(fetchAPI, 'GET', 'orders', {...filter});

    // console.log('data', data);

    yield put(fetchOrdersSuccess(data));
    yield put(uiActions.setOrdersFetchingState(false));
    yield nprogress.done();
}

export function* fetchOrdersStatsSaga() {
    yield nprogress.start();
    const data = yield call(fetchAPI, 'GET', 'orders/stats');

    // const data = yield apply( response, response.json );

    yield put(fetchOrdersStatsSuccess(data));
    yield nprogress.done();
}

export function* fetchOrdersFiltersSaga() {
    // try {
    yield nprogress.start();
    const data = yield call(fetchAPI, 'GET', 'orders/filter');

    // const data = yield apply(response, response.json);

    yield put(fetchOrdersStatsSuccess(data));
    yield nprogress.done();
}

export function* ordersSearchSaga({ payload: search }) {
    console.log('AHFHFD');
    const data = yield call(fetchAPI, 'GET', 'orders', { search });
    console.log(data);
    yield nprogress.start();
    yield put(ducks.ordersSearchSuccess(data));
    yield nprogress.done();
}

export function* saga() {
    yield all([ takeEvery(FETCH_ORDERS, fetchOrdersSaga), takeEvery(FETCH_ORDERS_STATS, fetchOrdersStatsSaga), takeEvery(FETCH_ORDERS_FILTERS, fetchOrdersFiltersSaga), takeEvery(ducks.ORDERS_SEARCH, ordersSearchSaga) ]);
}
