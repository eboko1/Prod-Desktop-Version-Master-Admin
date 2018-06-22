// vendor
import {
    call,
    put,
    takeEvery,
    all,
    apply,
    take,
    select,
} from 'redux-saga/effects';
import nprogress from 'nprogress';
import { spreadProp } from 'ramda-adjunct';
// import * as RA from 'ramda-adjunct';

//proj
import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import {
    fetchOrdersSuccess,
    fetchOrdersStatsSuccess,
    fetchStatsCountsSuccess,
    FETCH_ORDERS,
    FETCH_ORDERS_STATS,
    FETCH_STATS_COUNTS_PANEL,
    // SET_ORDERS_STATUS_FILTER,
} from './duck';

// import * as ducks from './duck';
//
// export function* fetchOrdersSaga(action) { // сейчас не работает, только для примера
//     yield nprogress.start();
//     yield put(uiActions.setOrdersFetchingState(true));
//
//     const data = yield call(fetchAPI, "GET", "orders", action.payload);
//
//     yield put(fetchOrdersSuccess(data));
//     yield put(uiActions.setOrdersFetchingState(false));
//     yield nprogress.done();
// }

const selectFilter = state => state.orders.filter;

export function* fetchOrdersSagaTake() {
    // сейчас работает (подключена в рут саге)
    while (true) {
        // const action = yield take(FETCH_ORDERS); // Блочится на этом месте (можно доставать экшн)
        yield take(FETCH_ORDERS);
        const filter = yield select(selectFilter);
        const filters = spreadProp('daterange', filter);
        // console.log('→ saga filters', filters);
        yield nprogress.start();
        yield put(uiActions.setOrdersFetchingState(true));
        const data = yield call(fetchAPI, 'GET', 'orders', filters);

        yield put(fetchOrdersSuccess(data));

        yield put(uiActions.setOrdersFetchingState(false));
        yield nprogress.done();
    }
}

export function* fetchOrdersStatsSaga() {
    yield nprogress.start();
    const data = yield call(fetchAPI, 'GET', 'orders/stats');

    yield put(fetchOrdersStatsSuccess(data));
    yield nprogress.done();
}

export function* fetchStatsCountsSaga() {
    yield nprogress.start();
    const data = yield call(fetchAPI, 'GET', 'orders');

    yield put(fetchStatsCountsSuccess(data));
    yield nprogress.done();
}

export function* saga() {
    yield all([ call(fetchOrdersSagaTake), takeEvery(FETCH_ORDERS_STATS, fetchOrdersStatsSaga), takeEvery(FETCH_STATS_COUNTS_PANEL, fetchStatsCountsSaga) ]);
}
