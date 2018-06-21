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
        const action = yield take(FETCH_ORDERS); // Блочится на этом месте (можешь доставать экшн)

        const filters = yield select(selectFilter);

        delete filters.daterange; // пока API не работает

        yield nprogress.start();
        yield put(uiActions.setOrdersFetchingState(true));

        const data = yield call(fetchAPI, 'GET', 'orders', filters);

        // yield put(fetchOrdersSuccess(data));

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
    yield all([ call(fetchOrdersSagaTake), takeEvery(FETCH_ORDERS_STATS, fetchOrdersStatsSaga), takeEvery(FETCH_ORDERS_FILTERS, fetchOrdersFiltersSaga), takeEvery(ducks.ORDERS_SEARCH, ordersSearchSaga) ]);
}
