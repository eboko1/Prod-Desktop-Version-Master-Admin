// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import { fetchClient } from '../client/duck';

import {
    CREATE_CLIENT_REQUISITE,
    UPDATE_CLIENT_REQUISITE,
    DELETE_CLIENT_REQUISITE,
} from './duck';

export function* updateClientRequisiteSaga() {
    while (true) {
        const {
            payload: { clientId, id, entity },
        } = yield take(UPDATE_CLIENT_REQUISITE);
        const payload = { ...entity };
        yield call(fetchAPI, 'PUT', `/clients/requisites/${id}`, null, payload);

        yield put(fetchClient(clientId));
    }
}

export function* createClientRequisiteSaga() {
    while (true) {
        const {
            payload: { clientId, entity },
        } = yield take(CREATE_CLIENT_REQUISITE);
        const payload = { ...entity };

        yield call(
            fetchAPI,
            'POST',
            `clients/${clientId}/requisites`,
            null,
            payload,
        );

        yield put(fetchClient(clientId));
    }
}

export function* deleteClientRequisiteSaga() {
    while (true) {
        const {
            payload: { clientId, id },
        } = yield take(DELETE_CLIENT_REQUISITE);
        yield call(fetchAPI, 'DELETE', `clients/requisites/${id}`);

        yield put(fetchClient(clientId));
    }
}

export function* saga() {
    yield all([ call(updateClientRequisiteSaga), call(createClientRequisiteSaga), call(deleteClientRequisiteSaga) ]);
}
