// vendor
import { call, put, takeEvery, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import { spreadProp } from 'ramda-adjunct';
import _ from 'lodash';
import moment from 'moment';
// import { routerReducer } from 'react-router-redux';

//proj
import { setOrdersFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchOrdersSuccess,
    fetchOrders,
    fetchOrdersStats,
    fetchOrdersStatsSuccess,
    createInviteOrdersSuccess,
    FETCH_ORDERS,
    FETCH_ORDERS_STATS,
    CREATE_INVITE_ORDERS,
    SET_UNIVERSAL_FILTERS,
    // SET_ORDERS_STATUS_FILTER,
} from './duck';

const selectFilter = ({ orders: { filter, sort, universalFilter } }) => ({
    sort,
    filter,
    universalFilter,
});

function mergeFilters(filter, universalFilters) {
    const modelsTransformQuery =
        universalFilters.models && universalFilters.models.length
            ? {
                models: _(universalFilters.models)
                    .map(model => model.split(','))
                    .flatten()
                    .value(),
            }
            : {};

    const [ startDate, endDate ] = universalFilters.beginDate || [];
    const [ createStartDate, createEndDate ] = universalFilters.createDate || [];

    const momentFields = _({
        startDate,
        endDate,
        createEndDate,
        createStartDate,
    })
        .pickBy(moment.isMoment)
        .mapValues(momentDate => momentDate.format('YYYY-MM-DD'))
        .value();

    return _.omit(
        {
            ...universalFilters,
            ...modelsTransformQuery,
            ...momentFields,
            ...filter,
        },
        [ 'beginDate', 'createDate' ],
    );
}

export function* fetchOrdersSaga() {
    while (true) {
        try {
            yield take(FETCH_ORDERS);
            yield nprogress.start();

            const {
                filter,
                universalFilter,
                sort: { field: sortField, order: sortOrder },
            } = yield select(selectFilter);

            // const activeStatuses = yield select(state =>
            //     _.get(state, 'router.location.state.status'));

            const ordersFilters = spreadProp('daterange', {
                ...filter,
                sortField,
                sortOrder,
            });

            const filters = mergeFilters(
                {
                    ...ordersFilters,
                    // ...activeStatuses && { status: activeStatuses },
                },
                universalFilter,
            );
            console.log('→ filters', filters);
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

export function* setUniversalFilter() {
    while (true) {
        yield take(SET_UNIVERSAL_FILTERS);
        yield put(fetchOrders());
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

/* eslint-disable array-element-newline */
export function* saga() {
    yield all([
        call(fetchOrdersSaga),
        call(setUniversalFilter),
        takeEvery(FETCH_ORDERS_STATS, fetchOrdersStatsSaga),
        takeEvery(CREATE_INVITE_ORDERS, createInviteOrders),
    ]);
}
/* eslint-enable array-element-newline */
