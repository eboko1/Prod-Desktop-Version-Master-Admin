// vendor
import { call, put, takeEvery, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import { spreadProp } from 'ramda-adjunct';
import _ from 'lodash';

//proj
import { setClientsFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchClients,
    fetchClientsSuccess,
    fetchClientsStats,
    fetchClientsStatsSuccess,
    fetchStatsCountsSuccess,
    inviteClientsSuccess,
    FETCH_CLIENTS,
    FETCH_CLIENTS_STATS,
    FETCH_STATS_COUNTS_PANEL,
    INVITE_CLIENTS,
    // SET_CLIENTS_STATUS_FILTER,
} from './duck';

const selectFilter = ({ clients: { filter, sort } }) => ({
    sort,
    filter,
});

export function* fetchClientsSagaTake() {
    while (true) {
        try {
            yield take(FETCH_CLIENTS);
            yield nprogress.start();

            const {
                filter,
                sort: { field: sortField, client: sortOrder },
            } = yield select(selectFilter);
            const filters = _.omit(
                spreadProp('daterange', { ...filter, sortField, sortOrder }),
                [ 'beginDate', 'createDate' ],
            );

            yield put(setClientsFetchingState(true));
            const data = yield call(fetchAPI, 'GET', 'clients', filters);

            yield put(fetchClientsSuccess(data));
            yield put(fetchClientsStats(_.omit(filters, [ 'page', 'status' ])));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setClientsFetchingState(false));
            yield nprogress.done();
        }
    }
}

export function* fetchClientsStatsSaga({ payload: filters = {} }) {
    try {
        yield nprogress.start();
        const statsFilters = _.omit(spreadProp('daterange', filters), [ 'page', 'status' ]);
        const data = yield call(fetchAPI, 'GET', 'clients/stats', statsFilters);

        yield put(fetchClientsStatsSuccess(data));
    } catch (error) {
        yield put(emitError(error));
    } finally {
        yield nprogress.done();
    }
}

export function* inviteClients({ payload: { invites, filters } }) {
    try {
        yield nprogress.start();
        const data = yield call(fetchAPI, 'POST', 'clients', null, invites);

        yield put(inviteClientsSuccess(data));
        yield nprogress.done();
    } catch (error) {
        yield put(emitError(error));
    } finally {
        yield put(fetchClients(filters));
    }
}

export function* fetchStatsCountsSaga() {
    try {
        yield nprogress.start();

        const data = yield call(fetchAPI, 'GET', 'clients');

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
        call(fetchClientsSagaTake),
        takeEvery(FETCH_CLIENTS_STATS, fetchClientsStatsSaga),
        takeEvery(FETCH_STATS_COUNTS_PANEL, fetchStatsCountsSaga),
        takeEvery(INVITE_CLIENTS, inviteClients),
    ]);
}
/* eslint-enable array-element-newline */
