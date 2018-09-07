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
import { setOrdersFetchingState, emitError } from 'core/ui/duck';
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

const selectFilter = ({ orders: { filter, sort } }) => ({
    sort,
    filter,
});

export function* fetchOrdersSaga() {
    while (true) {
        try {
            yield take(FETCH_ORDERS);
            yield nprogress.start();

            const {
                filter,
                sort: { field: sortField, order: sortOrder },
            } = yield select(selectFilter);
            const filters = _.omit(
                spreadProp('daterange', { ...filter, sortField, sortOrder }),
                [ 'beginDate', 'createDate' ],
            );

            yield put(setOrdersFetchingState(true));
            const data = yield call(fetchAPI, 'GET', 'orders', filters);

            yield put(fetchOrdersSuccess(data));
            yield put(fetchOrdersStats(_.omit(filters, [ 'page', 'status' ])));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setOrdersFetchingState(false));
            yield nprogress.done();
        }
    }
}

export function* fetchOrdersStatsSaga({ payload: filters = {} }) {
    try {
        yield nprogress.start();
        const statsFilters = _.omit(spreadProp('daterange', filters), [ 'page', 'status' ]);
        const data = yield call(fetchAPI, 'GET', 'orders/stats', statsFilters);

        yield put(fetchOrdersStatsSuccess(data));
    } catch (error) {
        yield put(emitError(error));
    } finally {
        yield nprogress.done();
    }
}

export function* createInviteOrders({ payload: { invites, filters } }) {
    try {
        yield nprogress.start();
        const data = yield call(fetchAPI, 'POST', 'orders', null, invites);

        yield put(createInviteOrdersSuccess(data));
        yield nprogress.done();
    } catch (error) {
        yield put(emitError(error));
    } finally {
        yield put(fetchOrders(filters));
    }
}

export function* fetchStatsCountsSaga() {
    try {
        yield nprogress.start();

        const data = yield call(fetchAPI, 'GET', 'orders');

        yield put(fetchStatsCountsSuccess(data));
    } catch (error) {
        yield put(emitError(error));
    } finally {
        yield nprogress.done();
    }
}
/* eslint-disable array-element-newline */
export function* saga() {
    yield all([
        call(fetchOrdersSaga),
        takeEvery(FETCH_ORDERS_STATS, fetchOrdersStatsSaga),
        takeEvery(FETCH_STATS_COUNTS_PANEL, fetchStatsCountsSaga),
        takeEvery(CREATE_INVITE_ORDERS, createInviteOrders),
    ]);
}
/* eslint-enable array-element-newline */
