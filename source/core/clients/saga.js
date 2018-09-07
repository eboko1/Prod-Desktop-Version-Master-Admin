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
    inviteClientsSuccess,
    selectFilter,
    FETCH_CLIENTS,
    INVITE_CLIENTS,
    // SET_CLIENTS_STATUS_FILTER,
} from './duck';

export function* fetchClientsSaga() {
    while (true) {
        try {
            yield take(FETCH_CLIENTS);
            console.log('fetch');
            yield nprogress.start();

            const { filter, sort } = yield select(selectFilter);
            console.log('* filter', { filter, sort });
            // yield put(setClientsFetchingState(true));
            const data = yield call(fetchAPI, 'GET', 'clients', {
                filter,
                sort,
            });

            yield put(fetchClientsSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            // yield put(setClientsFetchingState(false));
            yield nprogress.done();
        }
    }
}

export function* inviteClients({ payload: { invites, filters } }) {
    try {
        yield nprogress.start();
        const data = yield call(fetchAPI, 'POST', 'clients', null, invites);

        yield put(inviteClientsSuccess(data));
    } catch (error) {
        yield put(emitError(error));
    } finally {
        yield nprogress.done();
        yield put(fetchClients(filters));
    }
}

/* eslint-disable array-element-newline */
export function* saga() {
    yield all([
        call(fetchClientsSaga),
        takeEvery(INVITE_CLIENTS, inviteClients),
    ]);
}
/* eslint-enable array-element-newline */
