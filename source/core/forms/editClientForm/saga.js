// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';
import { fetchClient } from 'core/client/duck';

// own

import { UPDATE_CLIENT, updateClientSuccess } from './duck';

export function* updateClientSaga() {
    while (true) {
        const {
            payload: { clientId, client },
        } = yield take(UPDATE_CLIENT);

        yield call(fetchAPI, 'PUT', `clients/${clientId}`, null, client, {
            handleErrorInternally: true,
        });
        yield put(fetchClient(clientId));
        yield put(updateClientSuccess());
    }
}

export function* saga() {
    yield all([ call(updateClientSaga) ]);
}
