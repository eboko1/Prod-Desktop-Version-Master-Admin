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
import _ from 'lodash';
// import * as RA from 'ramda-adjunct';

//proj
import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import {
    fetchOrdersSuccess,
    fetchOrders,
    fetchOrdersStats,
    fetchOrdersStatsSuccess,
    fetchStatsCountsSuccess,
    createInviteOrdersSuccess,
    FETCH_ORDERS,
    FETCH_ORDERS_STATS,
    FETCH_STATS_COUNTS_PANEL,
    CREATE_INVITE_ORDERS,
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
        // const action = yield take(FETCH_ORDERS); // Блочится на этом месте (можно доставать action)
        yield take(FETCH_ORDERS);
        yield nprogress.start();

        const filter = yield select(selectFilter);
        const filters = spreadProp('daterange', filter);

        yield put(uiActions.setOrdersFetchingState(true));
        const data = yield call(fetchAPI, 'GET', 'orders', filters);

        yield put(fetchOrdersSuccess(data));

        yield put(uiActions.setOrdersFetchingState(false));
        yield put(fetchOrdersStats(_.omit(filters, [ 'page', 'status' ])));
        yield nprogress.done();
    }
}

export function* fetchOrdersStatsSaga({ payload: filters = {} }) {
    yield nprogress.start();
    const statsFilters = _.omit(spreadProp('daterange', filters), [ 'page', 'status' ]);
    const data = yield call(fetchAPI, 'GET', 'orders/stats', statsFilters);

    yield put(fetchOrdersStatsSuccess(data));
    yield nprogress.done();
}

export function* createInviteOrders({ payload: { invites, filters } }) {
    yield nprogress.start();
    const data = yield call(fetchAPI, 'POST', 'orders', null, invites);

    yield put(createInviteOrdersSuccess(data));
    yield nprogress.done();

    yield put(fetchOrders(filters));
}

export function* fetchStatsCountsSaga() {
    yield nprogress.start();
    const data = yield call(fetchAPI, 'GET', 'orders');

    yield put(fetchStatsCountsSuccess(data));
    yield nprogress.done();
}

export function* saga() {
    yield all([ call(fetchOrdersSagaTake), takeEvery(FETCH_ORDERS_STATS, fetchOrdersStatsSaga), takeEvery(FETCH_STATS_COUNTS_PANEL, fetchStatsCountsSaga), takeEvery(CREATE_INVITE_ORDERS, createInviteOrders) ]);
}
